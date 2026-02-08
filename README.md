# Quiz à tiroirs (GitHub Pages + Google Apps Script)

Tu as :
- une page web mobile-first (GitHub Pages)
- un backend léger (Google Apps Script) qui :
  - stocke les scores dans un Google Sheet
  - refuse les prénoms déjà utilisés
  - renvoie le classement
  - envoie un email à chaque fin de partie (classement mis à jour)

## 1) Déployer le site (GitHub Pages)

1. Crée un repo GitHub (ex: `quiz-tiroir`)
2. Copie dedans ces fichiers :
   - `index.html`
   - `style.css`
   - `app.js`
3. Active GitHub Pages :
   - Settings -> Pages
   - Source: Deploy from a branch
   - Branch: `main` / root
4. Tu auras une URL du style `https://<user>.github.io/<repo>/`

## 2) Créer le Google Sheet

1. Crée un Google Sheet vide
2. Récupère son ID (dans l’URL entre `/d/` et `/edit`)
3. Dans le Sheet, on créera une feuille `scores` automatiquement au 1er enregistrement.

## 3) Déployer Apps Script

1. Dans le Google Sheet : Extensions -> Apps Script
2. Remplace le contenu par `Code.gs`
3. Mets à jour dans `Code.gs` :
   - `SPREADSHEET_ID = "..."`
   - `EMAIL_TO = "jules.giboin@gmail.com"`
4. Déployer -> Nouveau déploiement -> Application web
   - Exécuter en tant que : Moi
   - Qui a accès : Tout le monde
5. Copie l’URL de l’application web (elle finit par `/exec`)

## 4) Relier le site au backend

Dans `app.js`, remplace :

```js
const API_BASE = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

par ton URL Apps Script (celle en `/exec`).

## Notes
- Le score est validé manuellement (boutons Bonne/Mauvaise réponse).
- `Annuler` revient exactement à l’état précédent et restaure le score.
- Le backend refuse les prénoms déjà utilisés (insensible à la casse, espaces normalisés).
