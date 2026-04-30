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

## 5) Documentation technique + Reprise Chatgpt

# 🎯 Quiz Web à Tiroirs – V1

## 🧠 Concept

Application web de quiz avec un système **à tiroirs** :

* Chaque question principale débloque des sous-questions si la réponse est correcte.
* Une mauvaise réponse fait passer directement à la question principale suivante.
* Le score est cumulatif.

---

## ⚙️ Fonctionnement

### Structure des questions

Chaque bloc contient 4 niveaux :

1. Question principale (numérotée)
2. Question a)
3. Question i.
4. Question -

### Logique

* Bonne réponse → question suivante du bloc
* Mauvaise réponse → bloc suivant
* Bouton **Annuler** :

  * revient à la question précédente
  * retire les points gagnés

---

## 🧮 Scoring

* Points attribués entre 1 et 5 selon la difficulté
* Score maximum : **343 points**
* Score moyen théorique : ~150 points

---

## 🖥️ Stack technique

### Frontend

* HTML / CSS / JavaScript
* Hébergé sur **GitHub Pages**
* Mobile-first

### Backend

* **Google Apps Script** (Web App)
* **Google Sheets** (base de données)
* **MailApp** (envoi d’emails)

---

## 🔌 API

### Base URL

```txt
https://script.google.com/macros/s/XXXXX/exec
```

---

### 📥 GET leaderboard

```txt
?action=leaderboard
```

Retour :

```json
{
  "ok": true,
  "entries": [
    { "name": "Jules", "score": 120 }
  ]
}
```

---

### 📤 POST submitScore

⚠️ IMPORTANT :
Utiliser `Content-Type: text/plain` (sinon problème CORS / preflight)

```js
fetch(API_BASE, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({
    action: "submitScore",
    name: "Jules",
    score: 120,
    startedAt: "...",
    finishedAt: "...",
    details: {}
  })
})
```

---

## ⚠️ Contraintes techniques importantes

* Apps Script **ne gère pas les requêtes OPTIONS**

* Donc :

  * ❌ PAS de `application/json`
  * ✅ utiliser `text/plain`

* Vérification prénom :

  * unicité côté backend
  * insensible à la casse et aux espaces

* Classement recalculé à chaque soumission

* Email envoyé automatiquement à chaque fin de quiz

---

## 🗃️ Structure Google Sheet

Colonnes :

1. timestamp
2. name
3. normalized_name
4. score
5. startedAt
6. finishedAt
7. details (JSON)

---

## 🧪 Debug / Tests

### Tester l’API manuellement

Dans la console navigateur :

```js
fetch("API_BASE", {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({
    action: "submitScore",
    name: "TEST",
    score: 10,
    startedAt: "x",
    finishedAt: "y",
    details: {}
  })
})
.then(r => r.text())
.then(console.log);
```

---

## 🔄 Reset du classement

* Supprimer toutes les lignes (sauf header) dans Google Sheet

---

## 📬 Envoi manuel du classement

Fonction Apps Script :

```js
function sendLeaderboardEmailManually() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet_(ss);
  const leaderboard = getLeaderboard_(sheet);

  const subject = "Quiz – classement mis à jour";
  const bodyTxt = buildLeaderboardEmail_(leaderboard.entries);

  MailApp.sendEmail(EMAIL_TO, subject, bodyTxt);
}
```

---

## 🚀 Idées pour V2

* Mode multi-joueurs en live
* Timer par question
* QCM automatique (au lieu validation manuelle)
* Interface admin
* Historique des parties
* Classements par session
* Export CSV
* UI type Kahoot

---

## 🧩 Résumé

Projet simple mais complet :

* logique conditionnelle (à tiroirs)
* backend serverless
* stockage cloud
* leaderboard partagé
* notifications email

---

## 🧠 Prompt de reprise (pour ChatGPT futur)

```txt
J’ai un quiz web avec cette architecture :
- frontend GitHub Pages
- backend Google Apps Script
- stockage Google Sheets
- système de questions à tiroirs

Voici les détails : [coller README]

Je veux faire une V2 avec : [objectif]
```

---
