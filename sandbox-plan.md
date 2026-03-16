# Bubble Plugin Local Sandbox

## Objectif
Cet environnement de développement local sous Vite (Vanilla JS) permet de simuler l'API Bubble et de développer des plugins (comme le "Phosphor Icon Picker" ou le "Emoji Picker") de manière isolée, rapide et avec Hot Module Replacement (HMR).

## Lancer le projet en local

1. **Prérequis** : Assure-toi d'avoir [Node.js](https://nodejs.org/) installé sur ton Mac.
2. **Installation** : Si ce n'est pas déjà fait, installe les dépendances du projet en exécutant cette commande dans ton terminal à la racine du projet :
   ```bash
   npm install
   ```
3. **Lancement** : Démarre le serveur de développement Vite :
   ```bash
   npm run dev
   ```
4. Ouvre ton navigateur à l'adresse indiquée (généralement `http://localhost:5173`).

---

## 1. Structure du Projet

L'architecture est pensée pour accueillir plusieurs plugins et plusieurs éléments par plugin. Actuellement, le projet contient le plugin `phosphor-icon-picker` (avec deux éléments) et le plugin `emoji-picker` (avec un élément).

```text
/bubble-sandbox
├── package.json               # Dépendances (Vite, @phosphor-icons/core, etc.)
├── index.html                 # Interface principale (Sidebar L + Canvas + Sidebar R)
├── style.css                  # Layout Flexbox principal et styles UI
├── main.js                    # Moteur de l'émulateur (charge le plugin actif)
├── /lib
│   └── bubble-mock.js         # Définition des objets Bubble simulés (instance, context)
└── /plugins
    ├── /phosphor-icon-picker  # Dossier du plugin "Phosphor Icon Picker"
    │   ├── shared.js          
    │   ├── /icon-picker       # Élément 1 : Le sélecteur d'icônes avec dropdown
    │   └── /icon-viewer       # Élément 2 : Le simple afficheur d'icône
    └── /emoji-picker          # Dossier du plugin "Emoji Picker"
        ├── shared.js          
        └── /picker            # Élément 1 : Le sélecteur d'emojis
            ├── config.json    # Propriétés de l'élément (initial_emoji, return_format...)
            ├── initialize.js  # Script Bubble 'Initialize' (DOM, events emoji-picker)
            ├── update.js      # Script Bubble 'Update' (Réactivité aux propriétés)
            └── preview.js     # Script Bubble 'Preview' (Rendu statique éditeur)
```

---

## 2. Le Moteur (lib/bubble-mock.js & main.js)

* **Le Mock Bubble (`bubble-mock.js`)** simule l'environnement d'exécution de Bubble :
  * **`instance`** : Fournit le conteneur jQuery (`instance.canvas`), un objet pour stocker l'état local (`instance.data`), et les méthodes natives de Bubble (`publishState`, `triggerEvent`).
  * **`context`** : Simule les fonctions globales comme `uploadContent` ou `reportDebugger`.
* **La logique centrale (`main.js`)** :
  * Génère dynamiquement une interface de contrôle (Input Emulator) en lisant le `config.json` de l'élément sélectionné.
  * Importe dynamiquement les fichiers de l'élément (`initialize`, `update`, `preview`).
  * Exécute les scripts dans le conteneur central (`#canvas-container`) pour visualiser le rendu.
  * Traite et affiche le code source "propre" (sans les `import/export` locaux) dans la barre de droite pour faciliter le copier-coller vers l'interface de Bubble.

---

## 3. L'Interface de l'Émulateur

L'interface de la sandbox est divisée en 3 zones distinctes :

### A. Contrôles (Sidebar Gauche)
* **Sélecteurs** : Deux menus déroulants permettent de basculer facilement entre les plugins et leurs éléments respectifs (ex: passage du Picker au Viewer).
* **Input Emulator** : Génère automatiquement des champs (texte, nombre, liste déroulante) basés sur les définitions du `config.json`. **Toute modification dans ces champs déclenche instantanément la fonction `update.js`** du plugin.
* **State Monitor** : Affiche en temps réel les états (States) publiés par le plugin via `instance.publishState()`.
* **Event Log** : Un journal d'activité qui affiche les événements déclenchés via `instance.triggerEvent()`.

### B. Zone de Rendu (Centre)
* Un conteneur `#canvas-container` représentant la cellule Bubble.
* Deux modes de rendu sont disponibles via des boutons radio :
  * **Run Mode** : Simule le comportement "Live". Appelle `initialize.js` une fois, puis `update.js` à chaque changement de propriété.
  * **Editor Mode (Preview)** : Simule le rendu visuel statique de l'élément dans l'éditeur de Bubble en appelant uniquement `preview.js`.

### C. Zone d'Export (Sidebar Droite)
* Affiche des blocs de code pour `shared.js`, `initialize.js`, `update.js`, et `preview.js`.
* Le contenu est récupéré dynamiquement sous forme de texte brut. Les imports locaux Vite sont automatiquement supprimés.
* **Boutons "Copy"** : (Icône Phosphor) Un clic copie instantanément le contenu du bloc dans ton presse-papier, prêt à être collé dans le tableau de bord de développement de plugin Bubble. Les blocs se déroulent au clic s'ils sont trop longs.

---

## 4. Fonctionnalités actuelles des Plugins

### Phosphor Icon Picker
* **Intégration native** : Ajoute automatiquement la librairie d'icônes au DOM.
* **Dropdown dynamique** : Le Picker affiche un menu défilant contenant les +1500 icônes Phosphor récupérées via npm.
* **Barre de recherche** : Intégrée au dropdown, permet de filtrer instantanément les icônes.
* **Propriétés dynamiques** : Taille (px), Couleur, Style (regular, fill, duotone, etc.).
* **Restriction d'icônes** : Le champ `allowed_icons` permet au développeur Bubble d'entrer une liste d'icônes (ex: `house, user, star`) pour restreindre drastiquement le choix proposé à l'utilisateur final.

### Emoji Picker
* **Web Component** : Utilise la librairie robuste `emoji-picker-element` pour offrir une interface native de sélection d'émojis complète (catégories, recherche, skin tones).
* **Styles Cohérents** : L'affichage (bordures, ombres, arrondis) a été aligné avec le style de la bibliothèque pour maintenir une identité visuelle harmonieuse ("funky").
* **État vide** : Affiche un smiley grisé "🙂" lorsqu'aucun emoji initial n'est fourni.
* **Formats de Retour** : Permet à l'utilisateur de choisir le format de la donnée publiée dans Bubble via `return_format` :
  * `emoji` (ex: 🚀)
  * `hexcode` (ex: 1F680)
  * `shortcode` (ex: rocket)

---

## 5. Apprentissages et Astuces (Leçons apprises sur Bubble)

Lors du développement de ces plugins, nous avons documenté plusieurs comportements spécifiques à l'environnement Bubble (qui diffère d'un environnement Vanilla JS classique) :

### A. Dimensions natives (Layout) et propriétés responsives
* Dans le nouveau moteur responsive de Bubble, l'utilisateur définit la largeur et la hauteur dans l'onglet **Layout**.
* Pour récupérer ces valeurs de manière fiable dans `update.js` ou `preview.js`, il faut utiliser l'objet `properties.bubble`.
* **Attention piège :** `properties.bubble.width` et `properties.bubble.height` sont des **fonctions** (méthodes) et non de simples nombres ! Les utiliser directement dans un calcul (ex: `Math.min(properties.bubble.width, ...)`) renvoie `NaN` et fait crasher le rendu.
* La méthode sécurisée pour récupérer la taille :
  ```javascript
  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  ```

### B. Gestion des Dropdowns (Menus déroulants)
* Bubble encapsule les éléments de plugin dans des conteneurs qui ont souvent des règles CSS strictes comme `overflow: hidden` ou `overflow: clip`.
* Si un menu déroulant (`dropdown`) est ajouté comme enfant du conteneur Bubble (`instance.canvas`), il sera systématiquement **coupé (rogné)** s'il dépasse de la taille allouée à l'élément.
* **La solution :** Attacher le dropdown directement à la racine du document (`document.body.appendChild(dropdown);`) et calculer sa position absolue au moment du clic en utilisant `getBoundingClientRect()` sur l'élément déclencheur.
* **Astuce pro :** Ajouter un événement de scroll sur la fenêtre (`window.addEventListener('scroll', ... , true)`) pour fermer automatiquement le menu si l'utilisateur fait défiler la page, évitant ainsi que le menu ne "flotte" au milieu de l'écran.

### C. Rendu CSS des Icônes
* Les icônes basées sur des polices de caractères (comme Phosphor) possèdent un `line-height` naturel qui ajoute de l'espacement invisible au-dessus et en-dessous.
* Dans une boîte Bubble restreinte, ce `line-height` provoque un **rognage vertical** de l'icône, même si la taille de police est égale à la taille de la boîte.
* **La solution :** Toujours forcer un `line-height: '1'` et utiliser Flexbox (`display: flex; align-items: center; justify-content: center;`) sur l'icône pour s'assurer qu'elle rentre parfaitement dans son conteneur sans déborder.
* Les éléments interactifs (inputs de recherche) dans un espace contraint doivent utiliser `box-sizing: border-box` pour éviter que le padding et les bordures ne fassent déborder l'élément de son parent à 100% de largeur.

### D. Gestion de la couleur (champ `color`)
* **Source de vérité :** La couleur affichée (icône principale, grille du dropdown, preview) doit **toujours** être celle demandée par l'utilisateur dans le champ "color" (`properties.color`). Dès que Bubble envoie une valeur (hex, rgb, nom), on l'utilise.
* **Ne pas remettre à zéro :** Quand Bubble renvoie une valeur vide pour `color` après une action (ex. sélection d'icône), il ne faut **pas** repasser à une couleur par défaut. On garde la dernière couleur connue (`instance.data.currentColor`). Sinon l'icône "saute" vers la couleur par défaut (ex. jaune) alors que l'utilisateur avait choisi du noir.
* **Lecture en `update.js` :**
  ```javascript
  let color = properties.color != null ? String(properties.color).trim() : '';
  if (!color) {
    color = instance.data.currentColor || '#000000';
  }
  instance.data.currentColor = color;
  ```
  Puis appliquer `color` à l'icône principale et à toutes les icônes du dropdown.
* **Dropdown :** Au survol des icônes dans le menu, **ne pas** forcer une couleur (ex. noir `#111827`) : garder la couleur choisie par l'utilisateur. Seul le fond (background) peut changer pour le feedback visuel.
* **Preview :** En mode éditeur, `preview.js` doit utiliser `properties.color` de la même façon (si présent et non vide, sinon `#000000`) pour que l’aperçu dans l’éditeur reflète bien la couleur du champ. Utiliser aussi `initial_icon` et `style` en preview pour rester cohérent avec l’élément.
* **Valeur par défaut :** Préférer `#000000` (noir) comme défaut dans le `config.json` et à l’initialisation, pour éviter l’effet "jaune par défaut" si Bubble n’envoie pas la couleur au premier rendu.

### E. Autobinding (champ qui reçoit la valeur)
* Le champ qui reçoit l’autobinding dans Bubble est **une propriété dédiée**, distincte de l’affichage (ex. `initial_icon`). En général on utilise une propriété **`value`** (type text) pour cela.
* Dans l’éditeur de plugin Bubble, il faut **cocher « Accepts autobinding »** pour cette propriété (ex. `value`), pas pour les autres.
* L’API moderne sur les éléments est **`instance.publishAutobinding(value)`** (un seul argument, la valeur), **pas** `instance.publishAutobindingValue(...)`. C’est cette méthode qui est utilisée par les pickers Phosphor / Lucide.
* En `update.js`, on donne toujours la priorité à la valeur liée puis à l’initiale, par exemple pour un picker d’icônes :
  ```javascript
  var autobindingTrimmed =
    properties.autobinding != null ? String(properties.autobinding).trim() : "";
  var initialIconTrimmed =
    properties.initial_icon != null ? String(properties.initial_icon).trim() : "";
  if (!initialIconTrimmed) {
    initialIconTrimmed = "smile";
  }
  var iconName = (autobindingTrimmed || initialIconTrimmed).toLowerCase();

  var previousIcon = instance.data.currentIcon;
  if (!previousIcon || previousIcon !== iconName) {
    instance.data.currentIcon = iconName;
    instance.publishState("selected_icon", iconName);
    if (typeof instance.publishAutobinding === "function") {
      instance.publishAutobinding(iconName);
    }
  }
  ```

### F. Contraintes de syntaxe Bubble pour le JavaScript
* Bubble est **très strict** sur la forme des fonctions collées dans l’éditeur de plugin :
  * Il faut utiliser des fonctions anonymes au format **`function(instance, properties, context) { ... }`** ou `function(instance, context) { ... }` **sans espace** entre `function` et la parenthèse ouvrante.
  * Si tu écris `function (instance, context)` avec un espace, Bubble peut lever une erreur du type « function statement requires a name » ou ignorer silencieusement le code.
* Aucun `export` / `import` n’est autorisé dans le code collé dans Bubble :
  * Pas de `export default function ...` dans l’éditeur Bubble.
  * Localement (dans la sandbox Vite), on peut garder `export default function(instance, ...)` pour que le bundler fonctionne, puis une étape de transformation (`toBubbleCode`) supprime `export`/`import` et normalise les fonctions avant affichage.
* Les helpers (`parseStrokeWidth`, `waitForLucideReady`, etc.) doivent être **définis à l’intérieur** de la fonction principale :
  ```javascript
  function(instance, properties, context) {
    function parseStrokeWidth(v) {
      var n = Number(v);
      return isFinite(n) && n > 0 ? n : 2;
    }
    // ... reste du code ...
  }
  ```
  Cela évite toute déclaration top-level que Bubble pourrait mal interpréter.

### G. Chargement des librairies externes (Phosphor, Lucide, Word Cloud, etc.)
* Dans un plugin Bubble, il n’y a **pas de `shared.js` exécutable** : on utilise plutôt le **Shared header** (ou le header de l’app) pour charger les librairies externes.
* Le pattern retenu est :
  * Côté sandbox locale : un fichier `shared.html` par plugin (ex. `plugins/lucide-icon-picker/shared.html`) qui contient **uniquement** la balise `<script>` à coller dans Bubble :
    ```html
    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>
    ```
  * Dans `index.html` de la sandbox, un petit script lit ces fragments HTML et crée dynamiquement de vrais `<script>` dans le `<head>` pour que le bundle externe soit exécuté en local (Vite).
* Dans Bubble, il suffit ensuite de copier le contenu du bloc `shared.html` et de le coller tel quel dans le **Shared header** du plugin :
  * Par exemple pour Phosphor :
    ```html
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    ```
  * Et pour Lucide :
    ```html
    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>
    ```
* **Très important :** aucun nouveau chargement de script ne doit être refait dans `initialize.js` / `update.js`. Ces fichiers partent du principe que la librairie globale (`window.PhosphorIcons`, `window.lucide`, etc.) est déjà présente grâce au header.

### H. Comportements par défaut des pickers (icônes & recherche)
* Pour les pickers d’icônes (Phosphor / Lucide), on applique des valeurs par défaut robustes côté code :
  * `initial_icon` vide ⇒ on tombe toujours sur une icône sûre (`"smile"`).
  * placeholder de recherche vide ⇒ on tombe sur `"Search..."`.
* Exemple pour le placeholder de recherche dans un picker Lucide :
  ```javascript
  if (instance.data.searchInput) {
    var placeholder =
      properties.search_placeholder !== undefined &&
      properties.search_placeholder !== null &&
      String(properties.search_placeholder).trim() !== ""
        ? String(properties.search_placeholder)
        : "Search...";
    instance.data.searchInput.placeholder = placeholder;
  }
  ```
* Les valeurs de taille, couleur et épaisseur (`stroke_width`) sont toujours validées et normalisées dans `update.js` avant d’être passées à la librairie d’icônes, pour éviter les `NaN` et les styles incohérents.