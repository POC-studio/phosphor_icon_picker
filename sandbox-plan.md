# Bubble Plugin Local Sandbox

## Objectif
Cet environnement de développement local sous Vite (Vanilla JS) permet de simuler l'API Bubble et de développer des plugins (comme le "Phosphor Icon Picker") de manière isolée, rapide et avec Hot Module Replacement (HMR).

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

L'architecture est pensée pour accueillir plusieurs plugins et plusieurs éléments par plugin. Actuellement, le projet contient le plugin `phosphor-icon-picker` qui possède deux éléments (`icon-picker` et `icon-viewer`).

```text
/bubble-sandbox
├── package.json               # Dépendances (Vite, @phosphor-icons/core)
├── index.html                 # Interface principale (Sidebar L + Canvas + Sidebar R)
├── style.css                  # Layout Flexbox principal et styles UI
├── main.js                    # Moteur de l'émulateur (charge le plugin actif)
├── /lib
│   └── bubble-mock.js         # Définition des objets Bubble simulés (instance, context)
└── /plugins
    └── /phosphor-icon-picker  # Dossier du plugin "Phosphor Icon Picker"
        ├── shared.js          # Code partagé / fonctions utilitaires du plugin
        ├── /icon-picker       # Élément 1 : Le sélecteur d'icônes avec dropdown
        │   ├── config.json    # Propriétés de l'élément (couleur, taille, filtre...)
        │   ├── initialize.js  # Script Bubble 'Initialize' (DOM, events)
        │   ├── update.js      # Script Bubble 'Update' (Réactivité aux propriétés)
        │   └── preview.js     # Script Bubble 'Preview' (Rendu statique éditeur)
        └── /icon-viewer       # Élément 2 : Le simple afficheur d'icône
            ├── config.json    
            ├── initialize.js  
            ├── update.js      
            └── preview.js     
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

## 4. Fonctionnalités actuelles du Phosphor Icon Picker
* **Intégration native** : Ajoute automatiquement la librairie d'icônes au DOM.
* **Dropdown dynamique** : Le Picker affiche un menu défilant contenant les +1500 icônes Phosphor récupérées via npm.
* **Barre de recherche** : Intégrée au dropdown, permet de filtrer instantanément les icônes.
* **Propriétés dynamiques** : Taille (px), Couleur, Style (regular, fill, duotone, etc.).
* **Restriction d'icônes** : Le champ `allowed_icons` permet au développeur Bubble d'entrer une liste d'icônes (ex: `house, user, star`) pour restreindre drastiquement le choix proposé à l'utilisateur final.