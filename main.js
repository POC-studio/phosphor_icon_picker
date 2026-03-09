import { BubbleInstance, BubbleContext } from './lib/bubble-mock.js';

// Global variables for emulator
let currentInstance = null;
let currentContext = null;

// Initialisation
async function initSandbox() {
  const pluginSelector = document.getElementById('plugin-selector');
  const elementSelector = document.getElementById('element-selector');
  const widthInput = document.getElementById('canvas-width-input');
  const heightInput = document.getElementById('canvas-height-input');
  const canvasContainer = document.getElementById('canvas-container');
  
  // Initialiser la taille du canvas
  function updateCanvasSize() {
    if (canvasContainer && widthInput && heightInput) {
      canvasContainer.style.width = `${widthInput.value}px`;
      canvasContainer.style.height = `${heightInput.value}px`;
    }
  }
  
  widthInput.addEventListener('input', () => {
    updateCanvasSize();
    // Relancer update pour prendre en compte la nouvelle taille
    if (currentInstance) {
      const mode = document.querySelector('input[name="preview-mode"]:checked').value;
      if (mode === 'run') {
        const configModule = import(`./plugins/${pluginSelector.value}/${elementSelector.value}/config.json`)
          .then(m => {
            const properties = getMockProperties(m.default);
            import(`./plugins/${pluginSelector.value}/${elementSelector.value}/update.js`)
              .then(updateModule => {
                if (updateModule.default) updateModule.default(currentInstance, properties, currentContext);
              });
          });
      } else {
        loadPlugin(pluginSelector.value, elementSelector.value); // Recharger en preview
      }
    }
  });
  
  heightInput.addEventListener('input', () => {
    updateCanvasSize();
    if (currentInstance) {
      const mode = document.querySelector('input[name="preview-mode"]:checked').value;
      if (mode === 'run') {
        const configModule = import(`./plugins/${pluginSelector.value}/${elementSelector.value}/config.json`)
          .then(m => {
            const properties = getMockProperties(m.default);
            import(`./plugins/${pluginSelector.value}/${elementSelector.value}/update.js`)
              .then(updateModule => {
                if (updateModule.default) updateModule.default(currentInstance, properties, currentContext);
              });
          });
      } else {
        loadPlugin(pluginSelector.value, elementSelector.value); // Recharger en preview
      }
    }
  });
  
  updateCanvasSize(); // Set initial size
  
  function updateElementOptions() {
    elementSelector.innerHTML = '';
    if (pluginSelector.value === 'phosphor-icon-picker') {
      elementSelector.innerHTML = `
        <option value="icon-picker">Icon Picker</option>
        <option value="icon-viewer">Icon Viewer</option>
      `;
    } else if (pluginSelector.value === 'lucide-icon-picker') {
      elementSelector.innerHTML = `
        <option value="icon-picker">Icon Picker</option>
        <option value="icon-viewer">Icon Viewer</option>
      `;
    } else if (pluginSelector.value === 'emoji-picker') {
      elementSelector.innerHTML = `
        <option value="picker">Emoji Picker</option>
      `;
    }
  }

  // Ecouteurs pour les changements
  pluginSelector.addEventListener('change', () => {
    updateElementOptions();
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

  // Initialiser les options du deuxième dropdown
  updateElementOptions();
  
  // Charger le plugin par défaut
  loadPlugin(pluginSelector.value, elementSelector.value);
}

async function loadPlugin(pluginName, elementName) {
  console.log(`Loading plugin: ${pluginName}, element: ${elementName}`);
  
  // Vider le conteneur
  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.innerHTML = '';
  
  // Réinitialiser le State Monitor pour ce nouvel élément
  const stateMonitor = document.getElementById('state-monitor');
  if (stateMonitor) {
    stateMonitor.innerHTML = '<p class="empty-state">No states published yet.</p>';
  }
  
  // Réinitialiser le Event Log pour ce nouvel élément
  const eventLog = document.getElementById('event-log');
  if (eventLog) {
    eventLog.innerHTML = '';
  }
  
  // Réinitialiser les objets Bubble
  currentInstance = new BubbleInstance(canvasContainer);
  currentContext = new BubbleContext();
  
  // Déterminer le mode (preview ou run)
  const mode = document.querySelector('input[name="preview-mode"]:checked').value;
  
  try {
    // 1. Charger la config de l'élément
    const configModule = await import(`./plugins/${pluginName}/${elementName}/config.json`);
    const config = configModule.default;
    
    // 1b. Charger la config globale du plugin
    let pluginConfig = {};
    try {
      const pluginConfigModule = await import(`./plugins/${pluginName}/config.json`);
      pluginConfig = pluginConfigModule.default;
    } catch (e) {
      // Ignorer si le fichier n'existe pas
    }
    
    // Configurer l'UI en fonction de la config de l'élément
    setupInputEmulator(config, pluginName, elementName);
    
    // Configurer les actions spécifiques au plugin global
    setupActions(pluginConfig, pluginName);
    
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
        const properties = getMockProperties(config);
        previewModule.default(currentInstance, properties);
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

// Configurer les actions spécifiques au plugin
function setupActions(config, pluginName) {
  const section = document.getElementById('plugin-actions-section');
  const container = document.getElementById('plugin-actions');
  
  container.innerHTML = '';
  
  if (!config.actions || config.actions.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  
  config.actions.forEach(action => {
    const btn = document.createElement('button');
    btn.textContent = action.label;
    btn.className = 'action-btn';
    btn.style.width = '100%';
    btn.style.padding = '10px';
    btn.style.marginBottom = '8px';
    btn.style.backgroundColor = '#2563eb'; // Primary blue
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'center';
    btn.style.fontWeight = '600';
    btn.style.transition = 'background-color 0.2s';
    
    btn.addEventListener('mouseover', () => {
      if (!btn.disabled) btn.style.backgroundColor = '#1d4ed8'; // Darker blue
    });
    
    btn.addEventListener('mouseout', () => {
      if (!btn.disabled) btn.style.backgroundColor = '#2563eb';
    });
    
    btn.addEventListener('click', async () => {
      try {
        const originalText = btn.textContent;
        btn.textContent = 'Running...';
        btn.disabled = true;
        btn.style.backgroundColor = '#93c5fd'; // Light blue when disabled
        
        // Importer et exécuter le script
        const actionModule = await import(`./plugins/${pluginName}/${action.file}`);
        if (actionModule.default) {
          const result = await actionModule.default();
          
          if (result && result.code) {
            // Afficher le résultat dans la zone d'export
            displayCode(`Result: ${action.id}`, result.code);
            
            // Faire clignoter le bouton en vert
            btn.textContent = 'Success!';
            btn.style.backgroundColor = '#10b981'; // Green
          }
        }
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = '#2563eb';
        }, 2000);
        
      } catch (err) {
        console.error(`Error running action ${action.id}:`, err);
        btn.textContent = 'Error!';
        btn.style.backgroundColor = '#ef4444'; // Red
        
        setTimeout(() => {
          btn.textContent = action.label;
          btn.disabled = false;
          btn.style.backgroundColor = '#2563eb';
        }, 3000);
      }
    });
    
    container.appendChild(btn);
  });
}

// Simuler les properties de Bubble pour la fonction Update
function getMockProperties(config) {
  const properties = {
    // On simule l'objet bubble avec des fonctions pour tester le cas réel Bubble
    bubble: {
      width: () => {
        const container = document.getElementById('canvas-container');
        return container ? container.offsetWidth : 32;
      },
      height: () => {
        const container = document.getElementById('canvas-container');
        return container ? container.offsetHeight : 32;
      }
    }
  };
  
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
