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