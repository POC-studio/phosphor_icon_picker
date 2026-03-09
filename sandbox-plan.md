# Plan d'Action : Bubble Plugin Local Sandbox

## Objectif
Créer un environnement de développement local sous Vite (Vanilla JS) pour simuler l'API Bubble. L'objectif est de visualiser en temps réel le rendu d'un plugin (initialement un "Phosphor Icon Picker"), de gérer facilement plusieurs plugins/éléments à l'avenir, et de faciliter l'export du code vers Bubble.

## 1. Structure du Projet
La structure est pensée pour accueillir plusieurs plugins et potentiellement plusieurs éléments par plugin.

```text
/bubble-sandbox
├── index.html                 # Interface principale (Sidebar L + Canvas + Sidebar R)
├── style.css                  # Layout Flexbox principal
├── main.js                    # Moteur de l'émulateur (charge le plugin actif)
├── /lib
│   └── bubble-mock.js         # Définition des objets Bubble (instance, context)
└── /plugins
    └── /phosphor-icon-picker  # Dossier du premier plugin
        ├── config.json        # Définition de l'élément (events: ["icon_selected"], props: {})
        ├── shared.js          # Code partagé / fonctions utilitaires
        ├── initialize.js      # Script Bubble 'Initialize'
        ├── update.js          # Script Bubble 'Update'
        └── preview.js         # Script Bubble 'Preview' (rendu éditeur)
```

## 2. Le Moteur (lib/bubble-mock.js & main.js)
Le fichier `lib/bubble-mock.js` simule l'environnement d'exécution de Bubble :

* **L'objet `instance`** :
  * `canvas` : Le conteneur DOM jQuery pointant vers la zone de rendu.
  * `data` : Objet vide pour stocker l'état interne de l'élément au fil du temps.
  * `publishState(name, value)` : Met à jour un state et l'envoie vers l'interface (Sidebar Gauche).
  * `triggerEvent(name, callback)` : Log l'événement (ex: `icon_selected`) dans l'Event Log de l'interface.
* **L'objet `context`** :
  * Inclut jQuery (chargé via CDN dans `index.html`).
* **La logique `main.js`** :
  * Importe dynamiquement les fichiers du plugin sélectionné (`shared`, `initialize`, `update`, `preview`).
  * Exécute les scripts dans le conteneur central pour visualiser le rendu.

## 3. L'Interface de Contrôle (Sidebar Gauche)
Une zone d'outils dynamique pour interagir avec le plugin :

* **Sélecteur de Plugin** : Un menu déroulant (Select) en haut pour basculer facilement entre les différents dossiers dans `/plugins`.
* **Input Emulator** : (Géré par `config.json`). Pour l'instant vide pour le Phosphor Picker, mais prêt à générer des inputs pour tester les propriétés d'autres plugins futurs.
* **State Monitor** : Affiche en temps réel les états (States) publiés par le plugin.
* **Event Log** : Un journal d'activité crucial pour vérifier que `triggerEvent('icon_selected')` est bien appelé quand on clique sur une icône.

## 4. Zone de Rendu (Centre)
* Un conteneur `#canvas-container` représentant la cellule Bubble.
* Application de styles neutres pour isoler le plugin.
* C'est ici que le code de `preview.js` (ou `initialize`/`update`) vient injecter son DOM (le color picker / la grille d'icônes).

## 5. Zone de Code / Export (Sidebar Droite)
* Interface affichant plusieurs blocs de texte en lecture seule (`<pre><code>`).
* Un bloc pour chaque fichier clé du plugin actif : `shared.js`, `initialize.js`, `update.js`, et `preview.js`.
* Le contenu est récupéré dynamiquement sous forme de texte brut (raw) pour refléter exactement ce qui est dans les fichiers locaux.
* **Boutons "Copy"** : Un bouton au-dessus de chaque bloc pour copier le contenu directement dans le presse-papier, prêt à être collé dans l'éditeur de plugin Bubble.

## Instructions d'implémentation
1. Initialiser un projet Vite avec Vanilla JS.
2. Créer l'arborescence et les fichiers décrits dans ce plan.
3. Mettre en place le layout CSS (3 colonnes : Contrôles, Canvas, Code).
4. Développer `bubble-mock.js` avec le support de jQuery pour l'objet `instance`.
5. Dans `main.js`, utiliser l'import brut (`?raw` avec Vite) pour afficher le code source dans la sidebar droite.
6. Assurer que les clics sur les boutons 'Copy' utilisent l'API `navigator.clipboard`.
7. Créer le plugin de base 'phosphor-icon-picker' avec un `config.json` simple définissant l'événement `icon_selected`.