import { addRasterImageFromUrl, insertImageFileOnCanvas } from '../clipboard.js';
import { PHOSPHOR_REGULAR_ICONS_FALLBACK, PHOSPHOR_STYLES } from '../constants.js';
import { alignSelectionToDocument, getDocumentSize } from '../guides.js';
import { fetchAllPhosphorIconsByStyle } from '../icons.js';
import { createDefaultTextbox, getObjectStyle } from '../objects.js';
import { loadWebFontsThenRedraw } from '../text.js';
import { updateTopBarForSelection } from './toolbar-sync.js';

/** Menus flottants (formes, icônes, bookmarks, table) + boutons de la barre gauche. */
export function setupMenus(app) {
  const { instance, context, fabricCanvas, fabricLib, ui, syncToolButtonHighlightToMode, setToolMode, exitPanMode, addShapeByType, addTableGrid, addPhosphorSvg } = app;

  ui.textBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = 'none';
    const docSize = getDocumentSize(instance);
    const text = createDefaultTextbox(fabricLib, docSize.width, docSize.height);
    if (!text) return;
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    // La web font (display=swap) n'est pas forcément prête à la création : on
    // remesure une fois la face chargée pour fiabiliser le placement du curseur.
    loadWebFontsThenRedraw(fabricCanvas, [text]);
  });

  const shapeMenu = document.createElement('div');
  shapeMenu.style.position = 'absolute';
  shapeMenu.style.left = '62px';
  shapeMenu.style.top = '108px';
  shapeMenu.style.display = 'none';
  shapeMenu.style.flexDirection = 'column';
  shapeMenu.style.gap = '8px';
  shapeMenu.style.padding = '8px';
  shapeMenu.style.background = '#ffffff';
  shapeMenu.style.border = '1px solid #e2e8f0';
  shapeMenu.style.borderRadius = '12px';
  shapeMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  shapeMenu.style.zIndex = '25';

  const makeShapeItem = (iconClass, title, type) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.borderRadius = '10px';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.cursor = 'pointer';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);

    btn.addEventListener('click', () => {
      addShapeByType(type);
      shapeMenu.style.display = 'none';
      if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = 'none';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f8fafc';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    return btn;
  };

  shapeMenu.appendChild(makeShapeItem('ph ph-square', 'Carre', 'square'));
  shapeMenu.appendChild(makeShapeItem('ph ph-circle', 'Cercle', 'circle'));
  shapeMenu.appendChild(makeShapeItem('ph ph-triangle', 'Triangle', 'triangle'));
  shapeMenu.appendChild(makeShapeItem('ph ph-star', 'Etoile', 'star'));
  ui.root.appendChild(shapeMenu);
  instance.data.shapeMenu = shapeMenu;

  const iconMenu = document.createElement('div');
  iconMenu.style.position = 'absolute';
  iconMenu.style.left = '62px';
  iconMenu.style.top = '64px';
  iconMenu.style.display = 'none';
  iconMenu.style.flexDirection = 'column';
  iconMenu.style.alignItems = 'stretch';
  iconMenu.style.gap = '8px';
  iconMenu.style.padding = '10px';
  iconMenu.style.background = '#ffffff';
  iconMenu.style.border = '1px solid #e2e8f0';
  iconMenu.style.borderRadius = '12px';
  iconMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  iconMenu.style.zIndex = '25';
  iconMenu.style.width = '198px';

  const styleSelect = document.createElement('select');
  styleSelect.style.height = '32px';
  styleSelect.style.border = '1px solid #cbd5e1';
  styleSelect.style.borderRadius = '8px';
  styleSelect.style.padding = '0 10px';
  styleSelect.style.fontSize = '12px';
  styleSelect.style.outline = 'none';
  styleSelect.style.color = '#0f172a';
  styleSelect.style.background = '#ffffff';
  PHOSPHOR_STYLES.forEach((style) => {
    const opt = document.createElement('option');
    opt.value = style;
    opt.textContent = style.charAt(0).toUpperCase() + style.slice(1);
    styleSelect.appendChild(opt);
  });
  iconMenu.appendChild(styleSelect);

  const iconSearch = document.createElement('input');
  iconSearch.type = 'text';
  iconSearch.placeholder = 'Search icon...';
  iconSearch.autocomplete = 'off';
  iconSearch.spellcheck = false;
  iconSearch.style.height = '32px';
  iconSearch.style.border = '1px solid #cbd5e1';
  iconSearch.style.borderRadius = '8px';
  iconSearch.style.padding = '0 10px';
  iconSearch.style.fontSize = '12px';
  iconSearch.style.outline = 'none';
  iconSearch.style.color = '#0f172a';
  iconSearch.style.background = '#ffffff';
  iconMenu.appendChild(iconSearch);

  const iconGridScroller = document.createElement('div');
  iconGridScroller.style.maxHeight = '320px';
  iconGridScroller.style.overflowY = 'auto';
  iconGridScroller.style.paddingRight = '2px';
  iconMenu.appendChild(iconGridScroller);

  const iconGrid = document.createElement('div');
  iconGrid.style.display = 'grid';
  iconGrid.style.gridTemplateColumns = 'repeat(4, 36px)';
  iconGrid.style.justifyContent = 'space-between';
  iconGrid.style.gap = '8px';
  iconGridScroller.appendChild(iconGrid);

  const iconStatus = document.createElement('div');
  iconStatus.style.fontSize = '11px';
  iconStatus.style.color = '#64748b';
  iconStatus.style.padding = '6px 0';
  iconStatus.style.textAlign = 'left';
  iconGridScroller.appendChild(iconStatus);

  let allIconNames = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
  let isLoadingIcons = false;
  let loadedStyle = '';
  let currentIconStyle = 'regular';

  const iconClassPrefixByStyle = {
    regular: 'ph',
    bold: 'ph-bold',
    fill: 'ph-fill',
    light: 'ph-light',
    thin: 'ph-thin',
    duotone: 'ph-duotone',
  };

  const makeIconItem = (iconName) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = iconName;
    btn.style.width = '36px';
    btn.style.minWidth = '36px';
    btn.style.height = '36px';
    btn.style.flex = '0 0 auto';
    btn.style.alignSelf = 'center';
    btn.style.padding = '0';
    btn.style.appearance = 'none';
    btn.style.webkitAppearance = 'none';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.borderRadius = '10px';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.cursor = 'pointer';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    const icon = document.createElement('i');
    const styleClass = iconClassPrefixByStyle[currentIconStyle] || 'ph';
    icon.className = `${styleClass} ph-${iconName}`;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f8fafc';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    btn.addEventListener('click', () => {
      addPhosphorSvg(iconName, currentIconStyle);
      iconMenu.style.display = 'none';
      if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = 'none';
    });
    return btn;
  };

  const renderIconGrid = (filterText = '') => {
    const q = String(filterText || '').trim().toLowerCase();
    iconGrid.innerHTML = '';
    const filtered = q
      ? allIconNames.filter((name) => name.includes(q))
      : allIconNames;
    filtered.forEach((iconName) => iconGrid.appendChild(makeIconItem(iconName)));
    if (isLoadingIcons) {
      iconStatus.textContent = 'Loading all icons...';
    } else if (filtered.length === 0) {
      iconStatus.textContent = 'No icon found.';
    } else {
      iconStatus.textContent = `${filtered.length} icon${filtered.length > 1 ? 's' : ''}`;
    }
  };

  const ensureAllIconsLoaded = async () => {
    if (isLoadingIcons) return;
    if (loadedStyle === currentIconStyle && allIconNames.length > 0) return;
    isLoadingIcons = true;
    renderIconGrid(iconSearch.value);
    const names = await fetchAllPhosphorIconsByStyle(currentIconStyle);
    allIconNames = Array.isArray(names) && names.length > 0
      ? names
      : [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
    isLoadingIcons = false;
    loadedStyle = currentIconStyle;
    renderIconGrid(iconSearch.value);
  };

  styleSelect.addEventListener('change', () => {
    currentIconStyle = String(styleSelect.value || 'regular');
    loadedStyle = '';
    ensureAllIconsLoaded();
  });
  iconSearch.addEventListener('input', () => {
    renderIconGrid(iconSearch.value);
  });
  renderIconGrid('');
  ui.root.appendChild(iconMenu);
  instance.data.iconMenu = iconMenu;

  const BOOKMARK_PANEL_EDGE = 12;

  const bookmarkMenu = document.createElement('div');
  bookmarkMenu.style.position = 'absolute';
  bookmarkMenu.style.left = '62px';
  bookmarkMenu.style.display = 'none';
  bookmarkMenu.style.flexDirection = 'column';
  bookmarkMenu.style.alignItems = 'stretch';
  bookmarkMenu.style.gap = '8px';
  bookmarkMenu.style.padding = '10px';
  bookmarkMenu.style.background = '#ffffff';
  bookmarkMenu.style.border = '1px solid #e2e8f0';
  bookmarkMenu.style.borderRadius = '12px';
  bookmarkMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  bookmarkMenu.style.zIndex = '25';
  bookmarkMenu.style.width = '198px';
  bookmarkMenu.style.boxSizing = 'border-box';
  bookmarkMenu.style.overflow = 'hidden';

  const bookmarkSearch = document.createElement('input');
  bookmarkSearch.type = 'text';
  bookmarkSearch.placeholder = 'Search bookmark...';
  bookmarkSearch.autocomplete = 'off';
  bookmarkSearch.spellcheck = false;
  bookmarkSearch.style.height = '32px';
  bookmarkSearch.style.border = '1px solid #cbd5e1';
  bookmarkSearch.style.borderRadius = '8px';
  bookmarkSearch.style.padding = '0 10px';
  bookmarkSearch.style.fontSize = '12px';
  bookmarkSearch.style.outline = 'none';
  bookmarkSearch.style.color = '#0f172a';
  bookmarkSearch.style.background = '#ffffff';
  bookmarkSearch.style.boxSizing = 'border-box';
  bookmarkSearch.style.width = '100%';
  bookmarkMenu.appendChild(bookmarkSearch);

  const bookmarkScroll = document.createElement('div');
  bookmarkScroll.style.flex = '1';
  bookmarkScroll.style.minHeight = '0';
  bookmarkScroll.style.overflowY = 'auto';
  bookmarkScroll.style.overflowX = 'hidden';
  bookmarkScroll.style.display = 'flex';
  bookmarkScroll.style.flexDirection = 'column';
  bookmarkScroll.style.gap = '12px';
  bookmarkScroll.style.paddingRight = '4px';
  bookmarkMenu.appendChild(bookmarkScroll);

  const syncBookmarkMenuPosition = () => {
    const topBarH = ui.topBar ? ui.topBar.offsetHeight : 52;
    bookmarkMenu.style.top = `${topBarH + BOOKMARK_PANEL_EDGE}px`;
    bookmarkMenu.style.bottom = `${BOOKMARK_PANEL_EDGE}px`;
    bookmarkMenu.style.left = '62px';
  };

  const getBookmarkSearchHaystack = (item) => {
    const contributor = String(item && item.contributor != null ? item.contributor : '').trim().toLowerCase();
    const url = String(item && item.image_url ? item.image_url : '').trim();
    let fileName = '';
    try {
      const u = new URL(url, 'https://placeholder.local');
      const parts = u.pathname.split('/').filter(Boolean);
      fileName = decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();
    } catch (e) {
      fileName = '';
    }
    return `${contributor} ${fileName} ${url.toLowerCase()}`.trim();
  };

  const renderBookmarksPanel = () => {
    bookmarkScroll.innerHTML = '';
    const list = Array.isArray(instance.data.bookmarksList) ? instance.data.bookmarksList : [];
    const q = String(bookmarkSearch.value || '').trim().toLowerCase();
    const filtered = q
      ? list.filter((item) => getBookmarkSearchHaystack(item).includes(q))
      : list;
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'Aucun bookmark';
      empty.style.fontSize = '12px';
      empty.style.color = '#64748b';
      empty.style.padding = '8px 4px';
      empty.style.textAlign = 'center';
      bookmarkScroll.appendChild(empty);
      return;
    }
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No bookmark found.';
      empty.style.fontSize = '12px';
      empty.style.color = '#64748b';
      empty.style.padding = '8px 4px';
      empty.style.textAlign = 'center';
      bookmarkScroll.appendChild(empty);
      return;
    }
    filtered.forEach((item) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.style.display = 'flex';
      row.style.flexDirection = 'column';
      row.style.alignItems = 'stretch';
      row.style.width = '100%';
      row.style.flexShrink = '0';
      row.style.padding = '0';
      row.style.border = '1px solid #e2e8f0';
      row.style.borderRadius = '10px';
      row.style.background = '#ffffff';
      row.style.cursor = 'pointer';
      row.style.boxSizing = 'border-box';
      row.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.alt = item.contributor || '';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.flexShrink = '0';
      img.style.objectFit = 'cover';
      img.style.background = '#f1f5f9';
      img.src = item.image_url;

      const footer = document.createElement('div');
      footer.textContent = item.contributor || '—';
      footer.style.flexShrink = '0';
      footer.style.width = '100%';
      footer.style.boxSizing = 'border-box';
      footer.style.borderTop = '1px solid #e2e8f0';
      footer.style.background = '#f8fafc';
      footer.style.padding = '8px 10px';
      footer.style.fontSize = '11px';
      footer.style.fontWeight = '500';
      footer.style.color = '#334155';
      footer.style.textAlign = 'center';
      footer.style.lineHeight = '1.35';
      footer.style.overflow = 'hidden';
      footer.style.textOverflow = 'ellipsis';
      footer.style.display = '-webkit-box';
      footer.style.webkitLineClamp = '2';
      footer.style.webkitBoxOrient = 'vertical';

      row.appendChild(img);
      row.appendChild(footer);
      row.addEventListener('click', async () => {
        bookmarkMenu.style.display = 'none';
        const imageId = await addRasterImageFromUrl(instance, fabricLib, item.image_url, {});
        if (typeof imageId === 'string' && imageId.length > 0) {
          instance.publishState('contribution_id', imageId);
          instance.triggerEvent('contribution_added');
        }
      });
      row.addEventListener('mouseenter', () => {
        row.style.background = '#f1f5f9';
        footer.style.background = '#eef2f6';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '#ffffff';
        footer.style.background = '#f8fafc';
      });
      bookmarkScroll.appendChild(row);
    });
  };

  bookmarkSearch.addEventListener('input', () => {
    renderBookmarksPanel();
  });

  instance.data.refreshBookmarksPanel = renderBookmarksPanel;
  ui.root.appendChild(bookmarkMenu);
  instance.data.bookmarkMenu = bookmarkMenu;

  const tableMenu = document.createElement('div');
  const TABLE_PANEL_EDGE = BOOKMARK_PANEL_EDGE;
  tableMenu.style.position = 'absolute';
  tableMenu.style.left = '62px';
  tableMenu.style.display = 'none';
  tableMenu.style.flexDirection = 'column';
  tableMenu.style.alignItems = 'stretch';
  tableMenu.style.gap = '8px';
  tableMenu.style.padding = '10px';
  tableMenu.style.background = '#ffffff';
  tableMenu.style.border = '1px solid #e2e8f0';
  tableMenu.style.borderRadius = '12px';
  tableMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  tableMenu.style.zIndex = '25';
  tableMenu.style.width = '198px';
  tableMenu.style.boxSizing = 'border-box';
  tableMenu.style.overflow = 'hidden';

  const tableSizeLabel = document.createElement('div');
  tableSizeLabel.style.fontSize = '11px';
  tableSizeLabel.style.color = '#64748b';
  tableSizeLabel.style.padding = '6px 0';
  tableSizeLabel.style.textAlign = 'left';
  tableSizeLabel.textContent = '—';
  tableMenu.appendChild(tableSizeLabel);

  const tableGridScroller = document.createElement('div');
  tableGridScroller.style.flex = '1';
  tableGridScroller.style.minHeight = '0';
  tableGridScroller.style.overflowY = 'hidden';
  tableGridScroller.style.overflowX = 'hidden';
  tableGridScroller.style.display = 'flex';
  tableGridScroller.style.flexDirection = 'column';
  tableGridScroller.style.paddingRight = '4px';
  tableMenu.appendChild(tableGridScroller);

  const tablePickerGrid = document.createElement('div');
  const GRID_COLS = 10;
  const GRID_ROWS = 15;
  const CELL_GAP_PX = 4;
  const DEFAULT_BG = '#ffffff';
  const DEFAULT_BORDER = '#cbd5e1';
  const ACTIVE_BG = '#eef2ff';
  const ACTIVE_BORDER = '#93c5fd';
  const CELL_SIZE_PX = 14;
  const cellEls = [];
  tablePickerGrid.style.display = 'grid';
  tablePickerGrid.style.gap = `${CELL_GAP_PX}px`;
  tablePickerGrid.style.justifyContent = 'space-between';
  tablePickerGrid.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${CELL_SIZE_PX}px)`;
  tablePickerGrid.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${CELL_SIZE_PX}px)`;
  tableGridScroller.appendChild(tablePickerGrid);

  // Fit: la hauteur du volet doit dépendre du contenu, pas l'inverse.
  // On fixe la hauteur du scroller pour éviter d'étirer le menu avec un "bottom".
  const tableGridHeightPx = GRID_ROWS * CELL_SIZE_PX + (GRID_ROWS - 1) * CELL_GAP_PX;
  tableGridScroller.style.height = `${tableGridHeightPx}px`;

  const setAllCellsHoverState = (hoveredIndex) => {
    const hasHover = Number.isFinite(Number(hoveredIndex));
    const idxN = hasHover ? Number(hoveredIndex) : null;
    const hoveredCol = hasHover ? (idxN % GRID_COLS) : null; // 0-based
    const hoveredRow = hasHover ? Math.floor(idxN / GRID_COLS) : null; // 0-based
    cellEls.forEach((el) => {
      const idx = Number(el.dataset.tableIndex || 0);
      const col = idx % GRID_COLS; // 0-based
      const row = Math.floor(idx / GRID_COLS); // 0-based
      const active = hasHover && col <= hoveredCol && row <= hoveredRow;
      el.style.background = active ? ACTIVE_BG : DEFAULT_BG;
      el.style.borderColor = active ? ACTIVE_BORDER : DEFAULT_BORDER;
    });
  };

  // Taille des carrés fixe : pas de recalcul nécessaire.

  const syncTableMenuPosition = () => {
    const topBarH = ui.topBar ? ui.topBar.offsetHeight : 52;
    tableMenu.style.top = `${topBarH + TABLE_PANEL_EDGE}px`;
    tableMenu.style.bottom = 'auto';
    tableMenu.style.left = '62px';
  };

  for (let r = 1; r <= GRID_ROWS; r++) {
    for (let c = 1; c <= GRID_COLS; c++) {
      const cell = document.createElement('div');
      const index = (r - 1) * GRID_COLS + (c - 1);
      cell.dataset.tableIndex = String(index);
      cell.style.width = `${CELL_SIZE_PX}px`;
      cell.style.height = `${CELL_SIZE_PX}px`;
      cell.style.border = '1px solid transparent';
      cell.style.borderColor = DEFAULT_BORDER;
      cell.style.borderRadius = '3px';
      cell.style.background = DEFAULT_BG;
      cell.style.cursor = 'pointer';
      cell.style.boxSizing = 'border-box';
      cell.addEventListener('mouseenter', () => {
        tableSizeLabel.textContent = `${c} x ${r}`;
        setAllCellsHoverState(index);
      });
      cell.addEventListener('click', () => {
        tableMenu.style.display = 'none';
        addTableGrid(c, r);
      });
      tablePickerGrid.appendChild(cell);
      cellEls.push(cell);
    }
  }

  tablePickerGrid.addEventListener('mouseleave', () => setAllCellsHoverState(null));

  ui.root.appendChild(tableMenu);
  instance.data.tableMenu = tableMenu;

  const closeFloatingMenus = () => {
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    tableMenu.style.display = 'none';
  };

  ui.shapeBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    shapeMenu.style.display = shapeMenu.style.display === 'none' ? 'flex' : 'none';
  });
  ui.iconBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    shapeMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    const willOpen = iconMenu.style.display === 'none';
    iconMenu.style.display = willOpen ? 'flex' : 'none';
    if (willOpen) {
      ensureAllIconsLoaded();
      iconSearch.focus();
    }
  });

  ui.tableBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    const willOpen = tableMenu.style.display === 'none';
    tableMenu.style.display = willOpen ? 'flex' : 'none';
    if (willOpen) {
      syncTableMenuPosition();
      setAllCellsHoverState(null);
    } else {
      setAllCellsHoverState(null);
    }
  });

  ui.penBtn.addEventListener('click', (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    exitPanMode();
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    const nextMode = instance.data.toolMode === 'draw' ? 'select' : 'draw';
    // Héritage « même catégorie » : reprendre le style de la spline sélectionnée
    // (path nu, ni polygone arrondi ni icône) avant de passer en mode dessin.
    if (nextMode === 'draw') {
      const active = fabricCanvas.getActiveObject();
      if (active && String(active.type || '').toLowerCase() === 'path'
          && !active.shapeKind && !active.iconKind) {
        const style = getObjectStyle(active);
        if (style.stroke && style.stroke !== 'transparent') {
          instance.data.penColor = style.stroke;
        }
        if (Number.isFinite(style.strokeWidth) && style.strokeWidth > 0) {
          instance.data.penWidth = style.strokeWidth;
        }
      }
    }
    setToolMode(nextMode);
  });
  ui.panBtn.addEventListener('click', (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    const nextMode = instance.data.toolMode === 'pan' ? 'select' : 'pan';
    setToolMode(nextMode);
  });

  const imageFileInput = document.createElement('input');
  imageFileInput.type = 'file';
  imageFileInput.accept = 'image/*';
  imageFileInput.setAttribute('aria-hidden', 'true');
  imageFileInput.tabIndex = -1;
  imageFileInput.style.position = 'absolute';
  imageFileInput.style.width = '0';
  imageFileInput.style.height = '0';
  imageFileInput.style.opacity = '0';
  imageFileInput.style.pointerEvents = 'none';
  ui.root.appendChild(imageFileInput);

  imageFileInput.addEventListener('change', async () => {
    const file = imageFileInput.files && imageFileInput.files[0];
    imageFileInput.value = '';
    try {
      await insertImageFileOnCanvas(instance, fabricLib, context, file, { logTag: '[FabricView image picker]' });
    } finally {
      syncToolButtonHighlightToMode();
    }
  });

  ui.imageBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    imageFileInput.click();
  });

  ui.bookmarkBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    const willOpen = bookmarkMenu.style.display === 'none';
    if (willOpen) {
      syncBookmarkMenuPosition();
      renderBookmarksPanel();
      bookmarkMenu.style.display = 'flex';
      bookmarkSearch.focus();
    } else {
      bookmarkMenu.style.display = 'none';
    }
  });

  if (ui.alignToolbar) {
    ui.alignToolbar.querySelectorAll('button[data-align-mode]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const mode = btn.getAttribute('data-align-mode');
        if (!mode) return;
        alignSelectionToDocument(instance, fabricCanvas, mode);
      });
    });
  }

  return { shapeMenu, iconMenu, bookmarkMenu, tableMenu, closeFloatingMenus, renderBookmarksPanel };
}
