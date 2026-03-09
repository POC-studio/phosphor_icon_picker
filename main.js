import { BubbleInstance, BubbleContext } from './lib/bubble-mock.js';

// Global variables for emulator
let currentInstance = null;
let currentContext = null;

// Initialisation
async function initSandbox() {
  const pluginSelector = document.getElementById('plugin-selector');
  const elementSelector = document.getElementById('element-selector');
  
  // Ecouteurs pour les changements
  pluginSelector.addEventListener('change', () => {
    loadPlugin(pluginSelector.value, elementSelector.value);
  });
  
  elementSelector.addEventListener('change', () => {
    loadPlugin(pluginSelector.value, elementSelector.value);
  });
  
  // Ecouteur pour les modes de rendu (Preview vs Run)
  const modeRadios = document.querySelectorAll('input[name="preview-mode"]');
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      loadPlugin(pluginSelector.value, elementSelector.value);
    });
  });

  // Charger le plugin par défaut
  loadPlugin(pluginSelector.value, elementSelector.value);
}

async function loadPlugin(pluginName, elementName) {
  console.log(`Loading plugin: ${pluginName}, element: ${elementName}`);
  
  // Vider le conteneur
  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.innerHTML = '';
  
  // Réinitialiser les objets Bubble
  currentInstance = new BubbleInstance(canvasContainer);
  currentContext = new BubbleContext();
  
  // Déterminer le mode (preview ou run)
  const mode = document.querySelector('input[name="preview-mode"]:checked').value;
  
  try {
    // 1. Charger la config
    const configModule = await import(`./plugins/${pluginName}/${elementName}/config.json`);
    const config = configModule.default;
    
    // Configurer l'UI en fonction de la config
    setupInputEmulator(config, pluginName, elementName);
    
    // 2. Charger le code source (pour affichage dans la sidebar droite)
    // Vite permet d'importer le contenu brut d'un fichier avec ?raw
    const sharedRaw = await import(`./plugins/${pluginName}/shared.js?raw`).catch(() => ({default: ''}));
    const initRaw = await import(`./plugins/${pluginName}/${elementName}/initialize.js?raw`).catch(() => ({default: ''}));
    const updateRaw = await import(`./plugins/${pluginName}/${elementName}/update.js?raw`).catch(() => ({default: ''}));
    const previewRaw = await import(`./plugins/${pluginName}/${elementName}/preview.js?raw`).catch(() => ({default: ''}));
    
    displayCode('shared.js', sharedRaw.default);
    displayCode('initialize.js', initRaw.default);
    displayCode('update.js', updateRaw.default);
    displayCode('preview.js', previewRaw.default);

    // 3. Exécuter le code du plugin
    if (mode === 'preview') {
      // En mode Editeur (Preview)
      const previewModule = await import(`./plugins/${pluginName}/${elementName}/preview.js`);
      if (previewModule.default) {
        previewModule.default(currentInstance, currentContext);
      }
    } else {
      // En mode Run (Initialize + Update)
      const initModule = await import(`./plugins/${pluginName}/${elementName}/initialize.js`);
      if (initModule.default) {
        initModule.default(currentInstance, currentContext);
      }
      
      const updateModule = await import(`./plugins/${pluginName}/${elementName}/update.js`);
      if (updateModule.default) {
        // En mode run, on simule l'appel à update avec les propriétés par défaut
        const properties = getMockProperties(config);
        updateModule.default(currentInstance, properties, currentContext);
      }
    }
    
  } catch (error) {
    console.error("Erreur lors du chargement du plugin :", error);
    canvasContainer.innerHTML = `<div style="color:red; padding:20px;">Error loading plugin: ${error.message}</div>`;
  }
}

// Configurer les contrôles basés sur config.json
function setupInputEmulator(config, pluginName, elementName) {
  const container = document.getElementById('input-emulator');
  container.innerHTML = '';
  
  if (!config.properties || Object.keys(config.properties).length === 0) {
    container.innerHTML = '<p class="empty-state">No properties defined for this plugin.</p>';
    return;
  }
  
  for (const [key, propConfig] of Object.entries(config.properties)) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';
    
    const label = document.createElement('label');
    label.textContent = key;
    label.style.display = 'block';
    label.style.fontSize = '12px';
    label.style.marginBottom = '4px';
    label.style.color = '#666';
    
    let input;
    if (propConfig.type === 'text') {
      input = document.createElement('input');
      input.type = 'text';
      input.value = propConfig.default || '';
      input.style.width = '100%';
      input.style.padding = '6px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
    } else if (propConfig.type === 'integer') {
      input = document.createElement('input');
      input.type = 'number';
      input.value = propConfig.default !== undefined ? propConfig.default : '';
      input.style.width = '100%';
      input.style.padding = '6px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
    } else if (propConfig.type === 'dropdown') {
      input = document.createElement('select');
      input.style.width = '100%';
      input.style.padding = '6px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
      if (propConfig.options) {
        propConfig.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (opt === propConfig.default) option.selected = true;
          input.appendChild(option);
        });
      }
    } else if (propConfig.type === 'long_text') {
      input = document.createElement('textarea');
      input.value = propConfig.default || '';
      input.style.width = '100%';
      input.style.padding = '6px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
      input.style.resize = 'vertical';
      input.style.minHeight = '60px';
    } else {
      // Fallback pour les autres types
      input = document.createElement('input');
      input.type = 'text';
      input.value = propConfig.default || '';
    }
    
    input.id = `input-${key}`;
    input.dataset.key = key;
    
    // Ecouteur pour relancer 'update' du plugin
    input.addEventListener('input', async (e) => {
      if (currentInstance) {
        const properties = getMockProperties(config);
        
        try {
          const updateModule = await import(`./plugins/${pluginName}/${elementName}/update.js`);
          if (updateModule.default) {
            updateModule.default(currentInstance, properties, currentContext);
          }
        } catch (err) {
          console.error("Error calling update.js:", err);
        }
      }
    });
    
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  }
}

// Simuler les properties de Bubble pour la fonction Update
function getMockProperties(config) {
  const properties = {};
  if (config.properties) {
    for (const [key, propConfig] of Object.entries(config.properties)) {
      // Chercher si un input existe pour cette propriété
      const input = document.getElementById(`input-${key}`);
      if (input) {
        if (propConfig.type === 'integer') {
          properties[key] = parseInt(input.value, 10);
        } else {
          properties[key] = input.value;
        }
      } else {
        properties[key] = propConfig.default;
      }
    }
  }
  return properties;
}

// Afficher et permettre la copie du code source
function displayCode(filename, code) {
  const container = document.getElementById('code-exports');
  
  // On nettoie le conteneur si c'est le premier fichier (shared.js)
  if (filename === 'shared.js') {
    container.innerHTML = '';
  }
  
  if (!code) return; // Si le fichier est vide ou n'existe pas

  // On nettoie le code (on enlève les import/export locaux de la sandbox)
  let cleanCode = code;
  // Nettoyage basique des imports/exports (peut être amélioré selon la syntaxe)
  cleanCode = cleanCode.replace(/import\s+.*?;?\n/g, '');
  cleanCode = cleanCode.replace(/export\s+default\s+function\s*\(.*?\)\s*{([\s\S]*)}/g, '$1'); // Extraire le corps de la fonction si export default
  
  // Mais comme l'utilisateur Bubble colle tout le contenu de la fonction Initialize, 
  // on peut garder la fonction complète si c'est plus simple, mais le plan dit "sans les imports/exports".
  // On va juste enlever les imports et le mot-clé export default
  cleanCode = code.replace(/import\s+.*?;?\n/g, '').replace(/export\s+default\s+/g, '').trim();

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  
  const header = document.createElement('div');
  header.className = 'code-block-header';
  
  const title = document.createElement('h3');
  title.textContent = filename;
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.title = 'Copy to Clipboard';
  
  const copyIcon = document.createElement('i');
  copyIcon.className = 'ph ph-copy';
  copyBtn.appendChild(copyIcon);
  
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cleanCode).then(() => {
      copyIcon.className = 'ph ph-check';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyIcon.className = 'ph ph-copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });
  
  header.appendChild(title);
  header.appendChild(copyBtn);
  
  const pre = document.createElement('pre');
  pre.textContent = cleanCode;
  
  // Rendre le bloc extensible au clic
  pre.addEventListener('click', () => {
    pre.classList.toggle('expanded');
  });
  
  wrapper.appendChild(header);
  wrapper.appendChild(pre);
  
  container.appendChild(wrapper);
}

// Lancer l'app
document.addEventListener('DOMContentLoaded', initSandbox);
