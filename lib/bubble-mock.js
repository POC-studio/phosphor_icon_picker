/**
 * Mock de l'API Bubble pour le développement local
 */

class BubbleInstance {
  constructor(canvasContainer) {
    // Le DOM element pointant sur la cellule Bubble (wrapper jQuery)
    this.canvas = $(canvasContainer);
    
    // Objet pour stocker l'état interne de l'élément (analogue à instance.data)
    this.data = {};
  }

  /**
   * Bubble API: publishState
   * @param {string} name - Le nom du state
   * @param {any} value - La valeur du state
   */
  publishState(name, value) {
    console.log(`[Bubble API] publishState('${name}',`, value, ')');
    
    // Mise à jour de l'UI de la sandbox
    const monitor = document.getElementById('state-monitor');
    
    // Check if empty state message is still there
    const emptyState = monitor.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    // Trouver ou créer l'élément state
    let stateItem = document.getElementById(`state-${name}`);
    if (!stateItem) {
      stateItem = document.createElement('div');
      stateItem.id = `state-${name}`;
      stateItem.className = 'state-item';
      
      const nameEl = document.createElement('span');
      nameEl.className = 'name';
      nameEl.textContent = name;
      
      const valueEl = document.createElement('span');
      valueEl.className = 'value';
      
      stateItem.appendChild(nameEl);
      stateItem.appendChild(valueEl);
      monitor.appendChild(stateItem);
    }
    
    const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
    stateItem.querySelector('.value').textContent = String(displayValue);
  }

  /**
   * Bubble API: publishAutobindingValue
   * Utilisé par les éléments de type "input" pour l'auto-binding.
   * Dans la sandbox : affiche dans le State Monitor et, si un callback est enregistré,
   * le déclenche pour mettre à jour le champ lié (ex. initial_icon) et relancer update.
   */
  publishAutobindingValue(value) {
    console.log('[Bubble API] publishAutobindingValue(', value, ')');

    const monitor = document.getElementById('state-monitor');
    if (monitor) {
      const name = 'autobinding_value';
      let stateItem = document.getElementById(`state-${name}`);
      if (!stateItem) {
        stateItem = document.createElement('div');
        stateItem.id = `state-${name}`;
        stateItem.className = 'state-item';
        const nameEl = document.createElement('span');
        nameEl.className = 'name';
        nameEl.textContent = name;
        const valueEl = document.createElement('span');
        valueEl.className = 'value';
        stateItem.appendChild(nameEl);
        stateItem.appendChild(valueEl);
        monitor.appendChild(stateItem);
      }
      const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
      stateItem.querySelector('.value').textContent = String(displayValue);
    }

    if (typeof this._onAutobindingValue === 'function') {
      this._onAutobindingValue(value);
    }
  }

  /**
   * Bubble API: triggerEvent
   * @param {string} name - Le nom de l'événement
   * @param {function} callback - Callback optionnel
   */
  triggerEvent(name, callback) {
    console.log(`[Bubble API] triggerEvent('${name}')`);
    
    // Mise à jour de l'UI de la sandbox
    const log = document.getElementById('event-log');
    
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    li.textContent = `[${time}] ${name}`;
    
    log.prepend(li);
    
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
}

class BubbleContext {
  constructor() {
    this.jQuery = window.jQuery;
  }
  
  uploadContent(fileName, base64Content, callback) {
    console.log('[Bubble API] context.uploadContent called for', fileName);
    if(callback) callback(null, 'https://mock-url.com/' + fileName);
  }
  
  reportDebugger(message) {
    console.log('[Bubble API] context.reportDebugger:', message);
  }
}

export { BubbleInstance, BubbleContext };
