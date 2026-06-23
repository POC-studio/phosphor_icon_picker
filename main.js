import { BubbleInstance, BubbleContext } from './lib/bubble-mock.js';
import { sharedScriptsReady } from './shared-loader.js';
import fabricViewInitialJsonDefault from './plugins/fabric/fabric-view/initial-json-default.json?raw';

// Global variables for emulator
let currentInstance = null;
let currentContext = null;
let currentElementUseBubbleSize = true;
let applyBubbleSizeCallback = null;

// Initialisation
async function initSandbox() {
  await sharedScriptsReady;
  const pluginSelector = document.getElementById('plugin-selector');
  const elementSelector = document.getElementById('element-selector');
  const widthInput = document.getElementById('canvas-width-input');
  const heightInput = document.getElementById('canvas-height-input');
  const canvasContainer = document.getElementById('canvas-container');
  const app = document.getElementById('app');
  const leftSidebar = document.querySelector('.left-sidebar');
  const rightSidebar = document.querySelector('.right-sidebar');
  const canvasArea = document.querySelector('.canvas-area');
  let floatingToggleBtn = document.getElementById('floating-toggle-sidebars-btn');
  if (!floatingToggleBtn) {
    floatingToggleBtn = document.createElement('button');
    floatingToggleBtn.id = 'floating-toggle-sidebars-btn';
    floatingToggleBtn.type = 'button';
    floatingToggleBtn.textContent = 'Masquer les sidebars';
  }
  // Le bouton doit être un enfant direct de body pour ne jamais être recouvert
  // par les layouts internes des plugins.
  if (floatingToggleBtn.parentElement !== document.body) {
    document.body.appendChild(floatingToggleBtn);
  }
  floatingToggleBtn.style.position = 'fixed';
  floatingToggleBtn.style.top = '12px';
  floatingToggleBtn.style.right = '12px';
  floatingToggleBtn.style.zIndex = '2147483647';
  floatingToggleBtn.style.pointerEvents = 'auto';

  function applyFocusMode(isFocus) {
    if (!app || !floatingToggleBtn) return;

    // État global sur body : plus robuste qu'un état sur #app.
    document.body.classList.toggle('sidebars-hidden', isFocus);

    // Nettoyer d'éventuels styles inline hérités d'anciens essais.
    if (leftSidebar) leftSidebar.style.removeProperty('display');
    if (rightSidebar) rightSidebar.style.removeProperty('display');
    if (canvasArea) {
      canvasArea.style.removeProperty('width');
      canvasArea.style.removeProperty('flex');
    }

    floatingToggleBtn.setAttribute('aria-pressed', String(isFocus));
    floatingToggleBtn.textContent = isFocus ? 'Afficher les sidebars' : 'Masquer les sidebars';

    try {
      localStorage.setItem('sandbox-focus-mode', isFocus ? '1' : '0');
    } catch (e) {
      // Ignore les erreurs de stockage (navigation privée, blocage storage, etc.)
    }

    if (typeof applyBubbleSizeCallback === 'function') {
      applyBubbleSizeCallback();
    }

    // Refresh léger universel : laisse les plugins avec ResizeObserver se recalculer.
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    });
  }

  // Handler global en capture : évite qu'un plugin bloque le clic (stopPropagation, overlay, etc.).
  if (!document.body.dataset.sidebarsToggleBound) {
    document.addEventListener('click', (event) => {
      const btn = event.target && event.target.closest
        ? event.target.closest('#floating-toggle-sidebars-btn')
        : null;
      if (!btn) return;
      event.preventDefault();
      const isFocus = !document.body.classList.contains('sidebars-hidden');
      applyFocusMode(isFocus);
    }, true);
    document.body.dataset.sidebarsToggleBound = '1';
  }

  // Raccourci de sécurité pour toujours pouvoir ressortir du mode focus
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('sidebars-hidden')) {
      applyFocusMode(false);
    }
    if (event.key.toLowerCase() === 'f') {
      const isFocus = !document.body.classList.contains('sidebars-hidden');
      applyFocusMode(isFocus);
    }
  });

  let savedFocus = false;
  try {
    savedFocus = localStorage.getItem('sandbox-focus-mode') === '1';
  } catch (e) {
    savedFocus = false;
  }
  applyFocusMode(savedFocus);
  
  // Initialiser la taille du canvas (affichage des champs W/H selon config use_bubble_size de l'élément)
  function updateCanvasSize() {
    if (!canvasContainer) return;
    const sizeSection = document.getElementById('bubble-size-section');
    if (sizeSection) sizeSection.style.display = currentElementUseBubbleSize ? 'block' : 'none';
    if (!currentElementUseBubbleSize) {
      canvasContainer.style.width = '100%';
      canvasContainer.style.height = '100%';
    } else if (widthInput && heightInput) {
      canvasContainer.style.width = `${widthInput.value}px`;
      canvasContainer.style.height = `${heightInput.value}px`;
    }
  }
  applyBubbleSizeCallback = updateCanvasSize;
  
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
    } else if (pluginSelector.value === 'avatar') {
      elementSelector.innerHTML = `
        <option value="view">Avatar</option>
      `;
    } else if (pluginSelector.value === 'word-cloud') {
      elementSelector.innerHTML = `
        <option value="word-cloud-view">Word Cloud</option>
      `;
    } else if (pluginSelector.value === 'fabric') {
      elementSelector.innerHTML = `
        <option value="fabric-view">Fabric View</option>
      `;
    } else if (pluginSelector.value === 'imgly') {
      elementSelector.innerHTML = `
        <option value="imgly-view">IMG.LY View</option>
      `;
    } else if (pluginSelector.value === 'slider-button') {
      elementSelector.innerHTML = `
        <option value="slider-button-view">Slider Button</option>
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
  
  // Réinitialiser la sidebar de droite (code export) pour ce nouvel élément
  const codeExports = document.getElementById('code-exports');
  if (codeExports) {
    codeExports.innerHTML = '';
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

    currentElementUseBubbleSize = config.use_bubble_size !== false;
    if (applyBubbleSizeCallback) applyBubbleSizeCallback();

    // Callback d'autobinding : publishAutobindingValue(value) → on met à jour le champ configuré (ex. value) et on relance update
    const autobindingProp = config.autobinding_property;
    if (autobindingProp) {
      currentInstance._onAutobindingValue = async (value) => {
        const input = document.getElementById(`input-${autobindingProp}`);
        if (input) {
          input.value = value;
          const properties = getMockProperties(config);
          try {
            const updateModule = await import(`./plugins/${pluginName}/${elementName}/update.js`);
            if (updateModule.default) {
              updateModule.default(currentInstance, properties, currentContext);
            }
          } catch (err) {
            console.error('Error calling update after autobinding:', err);
          }
        }
      };
    }

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
    
    // Configurer les actions d'élément (ex. Export as PNG sur Word Cloud)
    setupElementActions(config, pluginName, elementName);
    
    // 2. Charger le code source (pour affichage dans la sidebar droite)
    // Vite permet d'importer le contenu brut d'un fichier avec ?raw
    const sharedRaw = await import(`./plugins/${pluginName}/shared.html?raw`).catch(() => ({ default: '' }));
    const initRaw = await import(`./plugins/${pluginName}/${elementName}/initialize.js?raw`).catch(() => ({ default: '' }));
    const updateRaw = await import(`./plugins/${pluginName}/${elementName}/update.js?raw`).catch(() => ({ default: '' }));
    const previewRaw = await import(`./plugins/${pluginName}/${elementName}/preview.js?raw`).catch(() => ({ default: '' }));

    // Adapter le format affiché pour qu'il soit directement copiable dans Bubble
    const toBubbleCode = (source) => {
      if (source == null) return '';
      if (typeof source !== 'string') {
        if (typeof source === 'function') {
          source = source.toString();
        } else {
          source = String(source);
        }
      }
      const lines = source.split('\n');
      const out = [];
      for (let line of lines) {
        const trimmed = line.trim();
        // Supprimer les imports ES modules (Bubble ne les supporte pas)
        if (trimmed.startsWith('import ')) continue;
        // Transformer "export default function" en simple "function"
        if (trimmed.startsWith('export default function') || trimmed.startsWith('export default async function')) {
          out.push(line.replace('export default ', ''));
          continue;
        }
        // Supprimer les "export default xxx;" terminaux
        if (trimmed.startsWith('export default')) continue;
        out.push(line);
      }
      return out.join('\n');
    };

    displayCode('shared.html', sharedRaw.default);
    displayCode('initialize.js', toBubbleCode(initRaw.default));
    displayCode('update.js', toBubbleCode(updateRaw.default));
    displayCode('preview.js', toBubbleCode(previewRaw.default));

    // Scripts d’actions d’élément : format Bubble (sans export default)
    if (config.actions && Array.isArray(config.actions)) {
      for (const action of config.actions) {
        if (!action || !action.file) continue;
        const actionRaw = await import(
          /* @vite-ignore */ `./plugins/${pluginName}/${elementName}/${action.file}?raw`
        ).catch(() => ({ default: '' }));
        displayCode(action.file, toBubbleCode(actionRaw.default));
      }
    }

    // Scripts d’actions du plugin (racine plugins/<id>/, ex. actions/update-icons.js)
    if (pluginConfig.actions && Array.isArray(pluginConfig.actions)) {
      for (const action of pluginConfig.actions) {
        if (!action || !action.file) continue;
        const actionRaw = await import(
          /* @vite-ignore */ `./plugins/${pluginName}/${action.file}?raw`
        ).catch(() => ({ default: '' }));
        displayCode(action.file, toBubbleCode(actionRaw.default));
      }
    }

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

    // États déclarés dans config.states : afficher dans le State Monitor même avant le 1er publishState explicite
    if (config.states && typeof config.states === 'object') {
      for (const stateKey of Object.keys(config.states)) {
        if (document.getElementById(`state-${stateKey}`)) continue;
        currentInstance.publishState(stateKey, '');
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

    if (
      key === 'initial_json'
      && pluginName === 'fabric'
      && elementName === 'fabric-view'
      && typeof fabricViewInitialJsonDefault === 'string'
      && fabricViewInitialJsonDefault.trim().length > 0
    ) {
      input.value = fabricViewInitialJsonDefault.trim();
      input.style.minHeight = '220px';
      input.style.fontFamily = 'ui-monospace, Menlo, monospace';
      input.style.fontSize = '11px';
      input.style.lineHeight = '1.35';
    }

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
        const actionModule = await import(/* @vite-ignore */ `./plugins/${pluginName}/${action.file}`);
        if (actionModule.default) {
          const result = await actionModule.default();
          
          if (result && result.code) {
            displayCode(`Result: ${action.id}`, result.code);
            btn.textContent = 'Success!';
            btn.style.backgroundColor = '#10b981';

            // Pour lucide-icon-picker / update-icons : mettre à jour initialize.js et copier dans le presse-papiers
            if (pluginName === 'lucide-icon-picker' && action.id === 'update-icons' && result.icons && result.icons.length > 0) {
              try {
                const initRaw = await import(`./plugins/${pluginName}/icon-picker/initialize.js?raw`);
                let initContent = initRaw.default;
                const newIconsBlock = '  const ICONS = [\n    ' + result.icons.map((icon) => `"${icon}"`).join(',\n    ') + '\n  ];';
                initContent = initContent.replace(/  const ICONS = \[[\s\S]*?\n  \];/, newIconsBlock);
                await navigator.clipboard.writeText(initContent);
                const notice = document.createElement('div');
                notice.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:90%;text-align:center;';
                notice.textContent = 'initialize.js mis à jour copié dans le presse-papiers. Collez (Ctrl+V) dans le fichier pour remplacer.';
                document.body.appendChild(notice);
                setTimeout(() => notice.remove(), 6000);
              } catch (e) {
                console.warn('Could not update initialize.js / clipboard:', e);
              }
            }
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

// Configurer les actions d'élément (ex. Export as PNG)
function setupElementActions(elementConfig, pluginName, elementName) {
  const section = document.getElementById('element-actions-section');
  const container = document.getElementById('element-actions');
  if (!section || !container) return;

  container.innerHTML = '';

  if (!elementConfig.actions || elementConfig.actions.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  elementConfig.actions.forEach((action) => {
    const btn = document.createElement('button');
    btn.textContent = action.label;
    btn.className = 'action-btn';
    btn.style.cssText = 'width:100%;padding:10px;margin-bottom:8px;background:#7c3aed;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;';
    btn.addEventListener('click', async () => {
      try {
        btn.disabled = true;
        btn.textContent = 'Running...';
        const actionModule = await import(/* @vite-ignore */ `./plugins/${pluginName}/${elementName}/${action.file}`);
        const run = actionModule.default;
        const properties = getMockProperties(elementConfig);

        let context = currentContext;
        if (action.id === 'export_png') {
          context = {
            ...currentContext,
            uploadContent(fileName, base64Content, callback) {
              try {
                const binary = atob(base64Content);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                const blob = new Blob([bytes], { type: 'image/png' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'wordcloud.png';
                a.click();
                URL.revokeObjectURL(url);
              } catch (e) {
                console.warn('Download failed:', e);
              }
              if (callback) callback(null, 'https://mock-url.com/' + (fileName || 'wordcloud.png'));
            },
          };
        }

        const result = await run(currentInstance, properties, context);
        if (currentInstance && result != null) {
          currentInstance.publishState(`action_result_${action.id}`, result);
        }
        btn.textContent = 'Done';
        btn.style.backgroundColor = '#10b981';
      } catch (err) {
        console.error('Element action error:', err);
        btn.textContent = 'Error';
        btn.style.backgroundColor = '#ef4444';
      }
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = action.label;
        btn.style.backgroundColor = '#7c3aed';
      }, 2000);
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
// options.raw : affiche le fichier tel quel (imports inclus), utile pour les actions d’élément à coller dans Bubble
function displayCode(filename, code, options = {}) {
  const container = document.getElementById('code-exports');
  
  // On nettoie le conteneur si c'est le premier fichier (shared.html)
  if (filename === 'shared.html') {
    container.innerHTML = '';
  }
  
  if (code == null || code === '') return;

  let cleanCode = code;
  if (typeof cleanCode !== 'string') {
    cleanCode = typeof cleanCode === 'function' ? cleanCode.toString() : String(cleanCode);
  }
  if (!options.raw) {
    // On nettoie le code (on enlève les import/export locaux de la sandbox)
    // 1) Enlever tous les imports
    cleanCode = cleanCode.replace(/import\s+.*?;?\n/g, '');
    // 2) Enlever le mot-clé "export default"
    cleanCode = cleanCode.replace(/export\s+default\s+/g, '');
    // 3) Normaliser la signature des fonctions anonymes pour Bubble : "function(instance, ...)" sans espace
    cleanCode = cleanCode.replace(/function\s+\(/g, 'function(');
    cleanCode = cleanCode.trim();
  } else {
    cleanCode = String(cleanCode).trim();
  }

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

// Indicateur de build des plugins bundlés : pendant un rebuild esbuild (events
// HMR custom envoyés par vite.config.js), on bloque la copie du code — il serait
// périmé — et on fait tourner les icônes "copier".
function setCopyButtonsBuilding(isBuilding) {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.disabled = isBuilding;
    btn.classList.toggle('building', isBuilding);
    const icon = btn.querySelector('i');
    if (icon) icon.className = isBuilding ? 'ph ph-spinner' : 'ph ph-copy';
  });
}

if (import.meta.hot) {
  import.meta.hot.on('plugin-build:start', () => setCopyButtonsBuilding(true));
  import.meta.hot.on('plugin-build:end', () => setCopyButtonsBuilding(false));
}

// Lancer l'app
document.addEventListener('DOMContentLoaded', initSandbox);
