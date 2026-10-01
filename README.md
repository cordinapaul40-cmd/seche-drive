# Sèche & Drive

Appli de sèche pour Android : menus calés sur le cycle Leg Day / Haut du corps / Repos, budget de 200 € par mois, liste de courses Leclerc Drive Saint-Paul-lès-Dax, suivi du poids.

C'est une appli web installable (PWA) : un seul fichier `index.html`, plus `sw.js` pour le hors-ligne et les rappels, `manifest.webmanifest` et les icônes. Pas de serveur, pas de compte : les données restent sur le téléphone.

## Mise en ligne (GitHub Pages, gratuit)

1. Mettre le contenu de ce dossier à la racine d'un dépôt GitHub (par exemple `seche-drive`).
2. Sur GitHub : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. L'appli est en ligne sur `https://<pseudo>.github.io/seche-drive/` au bout d'une minute environ.

## Installation sur Android

1. Ouvrir l'adresse dans Chrome.
2. Appuyer sur « Installer » dans l'appli, ou menu ⋮ → « Installer l'application ».
3. Dans l'appli : Profil → Appli → « Activer les rappels ».

## Reprendre les données de la page claude.ai

1. Sur l'ancienne page : Profil → « Copier mes données ».
2. Dans l'appli installée : Profil → Appli → « Reprendre les données de l'ancienne page », coller, puis « Importer ces données ».

## Mettre à jour

Remplacer `index.html` (et `sw.js` si besoin) dans le dépôt. L'appli récupère la nouvelle version à la prochaine ouverture avec internet. Si `sw.js` change, augmenter `V` (`seche-shell-v1` → `v2`) pour vider l'ancien cache.
