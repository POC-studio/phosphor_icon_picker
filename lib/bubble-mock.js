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
      
      const valueEl = document.createElement('div');
      valueEl.className = 'value';
      
      stateItem.appendChild(nameEl);
      stateItem.appendChild(valueEl);
      monitor.appendChild(stateItem);
    }
    
    this._renderStateValue(stateItem.querySelector('.value'), value);
  }

  _renderStateValue(container, value) {
    if (!container) return;
    container.innerHTML = '';

    const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const trimmed = (displayValue || '').trim();
    const isJsonLike = (trimmed.startsWith('{') && trimmed.endsWith('}'))
      || (trimmed.startsWith('[') && trimmed.endsWith(']'));
    const shouldCollapse = isJsonLike || trimmed.length > 220 || trimmed.includes('\n');

    if (!shouldCollapse) {
      const valueEl = document.createElement('span');
      valueEl.textContent = displayValue;
      container.appendChild(valueEl);
      return;
    }

    const summary = document.createElement('button');
    summary.type = 'button';
    summary.className = 'state-collapse-toggle';
    summary.textContent = 'Afficher le contenu';

    const pre = document.createElement('pre');
    pre.className = 'state-collapsible-value';
    pre.textContent = displayValue;
    pre.style.display = 'none';

    summary.addEventListener('click', () => {
      const expanded = pre.style.display !== 'none';
      pre.style.display = expanded ? 'none' : 'block';
      summary.textContent = expanded ? 'Afficher le contenu' : 'Masquer le contenu';
    });

    container.appendChild(summary);
    container.appendChild(pre);
  }

  /**
   * Bubble API: publishAutobindingValue(value)
   * Met à jour la propriété de l’élément qui a « Accepts autobinding » dans l’éditeur plugin.
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
      this._renderStateValue(stateItem.querySelector('.value'), value);
    }

    if (typeof this._onAutobindingValue === 'function') {
      this._onAutobindingValue(value);
    }
  }

  /**
   * Bubble API: triggerEvent
   * @param {string} name - Le nom de l'événement
   * @param {function} callback - Callback optionnel (Bubble)
   * @param {any} value - Optionnel : valeur affichée dans le journal de la sandbox (ex. % pour button_dragged)
   */
  triggerEvent(name, callback, value) {
    // Pas de console.log ici : publishCanvasJson déclenche souvent publishState + json_changed ;
    // un seul log (publishState) suffit. Les événements restent visibles dans #event-log.

    // Mise à jour de l'UI de la sandbox
    const log = document.getElementById('event-log');
    
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    const suffix =
      arguments.length >= 3 && typeof value !== 'undefined' && value !== null
        ? ` (${value})`
        : '';
    li.textContent = `[${time}] ${name}${suffix}`;
    
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
    if (!callback) return;
    // En prod, Bubble renvoie une URL CDN réelle. En local on fabrique une
    // blob: URL depuis le contenu reçu pour qu'elle soit réellement chargeable.
    try {
      const bin = atob(String(base64Content || ''));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const ext = String(fileName || '').split('.').pop().toLowerCase();
      const mime = {
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
        webp: 'image/webp', svg: 'image/svg+xml', pdf: 'application/pdf',
      }[ext] || 'application/octet-stream';
      callback(null, URL.createObjectURL(new Blob([bytes], { type: mime })));
    } catch (e) {
      console.warn('[Bubble API] uploadContent mock: contenu base64 invalide', e);
      callback(null, 'https://mock-url.com/' + fileName);
    }
  }
  
  reportDebugger(message) {
    console.log('[Bubble API] context.reportDebugger:', message);
  }
}

export { BubbleInstance, BubbleContext };
