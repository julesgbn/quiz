/*
  Quiz à tiroirs (validation manuelle)
  - GitHub Pages: interface
  - Google Apps Script: stockage scores + leaderboard + email
*/

const API_BASE = "https://script.google.com/macros/s/AKfycbxWjy8oOzEXFLTBjXyHRojUMhqCpV87WatA100GVx0/dev"; // ex: https://script.google.com/macros/s/XXXX/exec

// ---------- Quiz data ----------
/*
  Structure: 30 blocs. Chaque bloc a 4 niveaux:
  0 = principale (numérotée)
  1 = a)
  2 = i.
  3 = -
*/
const BLOCKS = [
  { id: 1, items: [
    { level: 0, label: "1)", points: 1, text: "Comment s’appelle la plus grand Pyramide d’Egypte ?" },
    { level: 1, label: "a)", points: 3, text: "À cinq cents près, en quelle année fut elle construite ?" },
    { level: 2, label: "i.", points: 4, text: "Quelles sont les 6 autres merveilles antiques ?" },
    { level: 3, label: "–", points: 5, text: "Quel pharaon a construit la seconde plus grande pyramide d’Egypte ? (Indice : c’est aussi le nom de la Pyramide)" },
  ]},
  { id: 2, items: [
    { level: 0, label: "2)", points: 2, text: "Comment s’appelle le personnage principal de la série Breaking Bad ?" },
    { level: 1, label: "a)", points: 2, text: "Quel est son surnom dans la série ?" },
    { level: 2, label: "i.", points: 4, text: "Ce surnom est le nom d’un célèbre physicien, à quel siècle a-t-il vécu ?" },
    { level: 3, label: "–", points: 5, text: "Dans quel domaine de la physique a-t-il fait ses principaux travaux ?" },
  ]},
  { id: 3, items: [
    { level: 0, label: "3)", points: 1, text: "Quel est le nom de la célèbre avenue de Marseille qui mène au Vieux Port ?" },
    { level: 1, label: "a)", points: 2, text: "De quelle île grecque provenait les colons qui s’installèrent sur l’actuelle Marseille en -600 av JC ?" },
    { level: 2, label: "i.", points: 3, text: "Quel célèbre peintre aixois peignait la Sainte Victoire ?" },
    { level: 3, label: "–", points: 5, text: "De quel écrivain Cézanne était-il le grand ami ?" },
  ]},
  { id: 4, items: [
    { level: 0, label: "4)", points: 2, text: "Qui a peint les Demoiselles d’Avignon ?" },
    { level: 1, label: "a)", points: 3, text: "En Ile de France, où se trouve la cité Picasso ?" },
    { level: 2, label: "i.", points: 3, text: "Dans quel film français y a-t-il des racketteurs qui viennent de la cité Picasso ?" },
    { level: 3, label: "–", points: 4, text: "Hormis Paris, quelle est la ville la plus peuplée d’Ile de France ?" },
  ]},
  { id: 5, items: [
    { level: 0, label: "5)", points: 2, text: "Quel pays d’Afrique a la plus grande superficie ?" },
    { level: 1, label: "a)", points: 2, text: "En quelle année l’Algérie a obtenu son indépendance ?" },
    { level: 2, label: "i.", points: 3, text: "Combien de CAN a gagné l’Algérie dans son histoire ?" },
    { level: 3, label: "–", points: 4, text: "En quelles années ?" },
  ]},
  { id: 6, items: [
    { level: 0, label: "6)", points: 2, text: "Qui est l’auteur de Germinal ?" },
    { level: 1, label: "a)", points: 3, text: "Citer l’un des deux acteurs principaux du film adapté Germinal." },
    { level: 2, label: "i.", points: 2, text: "Obélix avait toujours été incarné par Depardieu au cinéma jusqu’au dernier film Astérix « L’Empire du milieu ». Qui l’a remplacé pour ce rôle ?" },
    { level: 3, label: "–", points: 3, text: "Citer un film réalisé par Gilles Lellouche." },
  ]},
  { id: 7, items: [
    { level: 0, label: "7)", points: 2, text: "En étant au service de quel pays Christophe Colomb a-t-il entrepris son voyage vers l’Amérique ?" },
    { level: 1, label: "a)", points: 3, text: "De quelle nation était-il originaire ? (Indice : ce n’est plus un pays en tant que tel)" },
    { level: 2, label: "i.", points: 3, text: "Laquelle de ces villes est la plus proche de Gênes à vol d’oiseau : Turin, Florence, Nice, Milan." },
    { level: 3, label: "–", points: 3, text: "On dit aussi qu’il serait originaire de Calvi en Corse : en dehors de Calvi, citer 4 villes corses." },
  ]},
  { id: 8, items: [
    { level: 0, label: "8)", points: 2, text: "Qui est la seule personne à avoir eu deux fois le Prix Nobel de physique ?" },
    { level: 1, label: "a)", points: 2, text: "Le prix Nobel ne récompense pas les mathématiques : quelle distinction est son équivalent pour les mathématiques ?" },
    { level: 2, label: "i.", points: 3, text: "Alfred Nobel est à l’origine du prix Nobel : de quelle nationalité était-il ?" },
    { level: 3, label: "–", points: 4, text: "Pour quelle invention est-il devenu célèbre ?" },
  ]},
  { id: 9, items: [
    { level: 0, label: "9)", points: 1, text: "Lequel de ces trois films a fait le plus d’entrées en France : Intouchables, Astérix mission Cléopatre, Bienvenue chez les Chtis." },
    { level: 1, label: "a)", points: 2, text: "Mais le record d’entrées est détenu par un film américain : lequel ?" },
    { level: 2, label: "i.", points: 3, text: "Qui sont les deux acteurs principaux du film ?" },
    { level: 3, label: "–", points: 4, text: "En quelle année a coulé le Titanic ?" },
  ]},
  { id: 10, items: [
    { level: 0, label: "10)", points: 1, text: "Lors de la 2nde guerre mondiale, qui dirigeait l’Italie ?" },
    { level: 1, label: "a)", points: 2, text: "Qui dirigeait la Grande Bretagne ?" },
    { level: 2, label: "i.", points: 2, text: "Qui dirigeait les Etats-Unis ?" },
    { level: 3, label: "–", points: 3, text: "Qui dirigeait le Japon ?" },
  ]},
  { id: 11, items: [
    { level: 0, label: "11)", points: 2, text: "En tennis, quels sont les quatre pays qui accueillent des tournois du Grand Chelem ?" },
    { level: 1, label: "a)", points: 3, text: "Qui était Roland Garros ?" },
    { level: 2, label: "i.", points: 3, text: "Quel exploit l’a rendu célèbre ?" },
    { level: 3, label: "–", points: 5, text: "Qui est le premier aviateur à traverser l’Atlantique ?" },
  ]},
  { id: 12, items: [
    { level: 0, label: "12)", points: 1, text: "Quel monument funéraire parisien a pris l’habitude d’accueillir de grandes personnalités contemporaines depuis la fin du 18ème siècle ?" },
    { level: 1, label: "a)", points: 2, text: "Dans quel monument sont enterrés la plupart des Rois de France ?" },
    { level: 2, label: "i.", points: 2, text: "Dans quelle ville furent capturés Louis XVI et Marie Antoinette alors qu’ils fuyaient Paris ?" },
    { level: 3, label: "–", points: 5, text: "Selon la légende, qui a prévenu Louis XVI de la prise de la Bastille ?" },
  ]},
  { id: 13, items: [
    { level: 0, label: "13)", points: 1, text: "Quel canal relie la mer Rouge à la mer Méditerranée ?" },
    { level: 1, label: "a)", points: 2, text: "Quel film français parodiant James Bond se déroule en Egypte ? (nom exact)" },
    { level: 2, label: "i.", points: 3, text: "Comment se nomme OSS 117 ? (il utilise son vrai nom dans ce film)" },
    { level: 3, label: "–", points: 5, text: "Comment s’appelle la société pour laquelle il travaille en couverture de sa mission ? (initiales peuvent suffire)" },
  ]},
  { id: 14, items: [
    { level: 0, label: "14)", points: 1, text: "Dans quel pays s’est déroulée la coupe du monde de foot 2018 ?" },
    { level: 1, label: "a)", points: 2, text: "Citer trois villes russes." },
    { level: 2, label: "i.", points: 2, text: "Comment appelle-t-on la révolution qui s’est déroulée en Russie en 1917 ? (plusieurs réponses possibles)" },
    { level: 3, label: "–", points: 2, text: "Qui en fut l’acteur principal ?" },
  ]},
  { id: 15, items: [
    { level: 0, label: "15)", points: 3, text: "À 30 ans près, en quelle année Jeanne d’Arc pris Orléans ?" },
    { level: 1, label: "a)", points: 3, text: "Elle se battait alors pour quel Roi ?" },
    { level: 2, label: "i.", points: 4, text: "Dans quelle ville fut elle brulée ?" },
    { level: 3, label: "–", points: 5, text: "Dans quelle ville était-elle née ?" },
  ]},
  { id: 16, items: [
    { level: 0, label: "16)", points: 1, text: "Est-ce que l’Atlantide existe réellement ?" },
    { level: 1, label: "a)", points: 2, text: "Est-ce que le Loch Ness existe réellement ?" },
    { level: 2, label: "i.", points: 2, text: "Est-ce que le Mont Olympe existe réellement ?" },
    { level: 3, label: "–", points: 2, text: "Est-ce que le château de Camelot existe réellement ?" },
  ]},
  { id: 17, items: [
    { level: 0, label: "17)", points: 2, text: "Dans quelle ville se situent la Mosquée Bleue et la mosquée Sainte-Sophie ?" },
    { level: 1, label: "a)", points: 3, text: "Quels étaient les deux précédents noms de cette ville ?" },
    { level: 2, label: "i.", points: 4, text: "Quel sultan ottoman a pris Constantinople ?" },
    { level: 3, label: "–", points: 5, text: "En quelle année ?" },
  ]},
  { id: 18, items: [
    { level: 0, label: "18)", points: 2, text: "Qui a peint la Nuit Etoilée ?" },
    { level: 1, label: "a)", points: 3, text: "Qui a peint La Naissance de Venus ?" },
    { level: 2, label: "i.", points: 3, text: "Qui a dessiné l’Homme de Vitruve ?" },
    { level: 3, label: "–", points: 3, text: "Qui a peint le Cri ?" },
  ]},
  { id: 19, items: [
    { level: 0, label: "19)", points: 3, text: "Quel est le seul pays avec lequel Haïti dispose d’une frontière ?" },
    { level: 1, label: "a)", points: 5, text: "Quel est le nom de l’île qui partage ces deux pays ?" },
    { level: 2, label: "i.", points: 3, text: "Quelle est la plus grande île des Caraïbes ?" },
    { level: 3, label: "–", points: 4, text: "En quelle année Fidel Castro prit le pouvoir à Cuba ?" },
  ]},
  { id: 20, items: [
    { level: 0, label: "20)", points: 1, text: "Comment s’appelle l’ours, ami de Mowgli, dans le Livre de la Jungle ?" },
    { level: 1, label: "a)", points: 2, text: "Qui est l’inventeur de Pinocchio ?" },
    { level: 2, label: "i.", points: 4, text: "Quel est le nom du personnage incarné par Johnny Depp dans le film Alice au Pays des merveilles de Tim Burton ?" },
    { level: 3, label: "–", points: 3, text: "Comment s’appelle le grand ennemi de Picsou ?" },
  ]},
  { id: 21, items: [
    { level: 0, label: "21)", points: 1, text: "Qui est le seul Président de la Vème République à être décédé durant son mandat ?" },
    { level: 1, label: "a)", points: 3, text: "Hormis Pompidou, quel Président de la Vème fut Premier Ministre avant d’être élu Président ?" },
    { level: 2, label: "i.", points: 3, text: "Citer un Premier Ministre de Chirac." },
    { level: 3, label: "–", points: 5, text: "Quel ancien Premier Ministre se suicida d’une balle dans la tête un mois après la fin de son mandat ?" },
  ]},
  { id: 22, items: [
    { level: 0, label: "22)", points: 2, text: "Quel est le premier pays à avoir envoyé un satellite artificiel dans l’espace ?" },
    { level: 1, label: "a)", points: 3, text: "Comment s’appelait ce satellite ?" },
    { level: 2, label: "i.", points: 3, text: "Ce même pays a envoyé le premier homme dans l’espace : quel était son nom ?" },
    { level: 3, label: "–", points: 3, text: "En quelle année Armstrong mis le pied sur la Lune ?" },
  ]},
  { id: 23, items: [
    { level: 0, label: "23)", points: 2, text: "Laquelle de ces villes américaines a déjà accueilli les Jeux Olympiques d’été ? New York, Seattle, Atlanta, Dallas." },
    { level: 1, label: "a)", points: 4, text: "Lequel de ces chanteurs n’a pas grandi à Atlanta ? Young Thug, Childish Gambino, Quavo, Kendrick Lamar." },
    { level: 2, label: "i.", points: 4, text: "Lequel de ces albums n’est pas de Kendrick Lamar ? The life of Pablo, Damn, To pimp a butterfly, Good kid mad city." },
    { level: 3, label: "–", points: 4, text: "Quel était le nom complet de Pablo Escobar ?" },
  ]},
  { id: 24, items: [
    { level: 0, label: "24)", points: 1, text: "Par quel pays la RDC fut elle colonisée en 1908 ?" },
    { level: 1, label: "a)", points: 2, text: "Qui fut le héros de l’indépendance en 1960 ?" },
    { level: 2, label: "i.", points: 3, text: "Un coup d’état eu lieu en 1965 : qui en fut son auteur ?" },
    { level: 3, label: "–", points: 5, text: "Un autre homme célèbre, français et du 19ème siècle, considéré comme un des pères de l’anarchisme, portait ce prénom : qui était-ce ?" },
  ]},
  { id: 25, items: [
    { level: 0, label: "25)", points: 2, text: "Quel pilote de F1 est/était surnommé le baron rouge ?" },
    { level: 1, label: "a)", points: 2, text: "Dans quel film français a-t-il fait une apparition ?" },
    { level: 2, label: "i.", points: 3, text: "Dans ce film, d’autres stars du sport sont apparues : laquelle représentait le tennis ?" },
    { level: 3, label: "–", points: 3, text: "Qui est la dernière personne française à avoir gagné un GC et dans quel tournoi ?" },
  ]},
  { id: 26, items: [
    { level: 0, label: "26)", points: 2, text: "De quelle région provient le personnage de Dracula ?" },
    { level: 1, label: "a)", points: 3, text: "Dans quel pays cette région se situe-t-elle ?" },
    { level: 2, label: "i.", points: 5, text: "Qui a écrit Dracula ?" },
    { level: 3, label: "–", points: 5, text: "Quel personnage historique a inspiré le personnage de Dracula ?" },
  ]},
  { id: 27, items: [
    { level: 0, label: "27)", points: 1, text: "Dans la mythologie grecque, qui est le dieu des enfers ?" },
    { level: 1, label: "a)", points: 2, text: "Qui est la femme de Zeus ?" },
    { level: 2, label: "i.", points: 2, text: "Aphrodite a trompé son mari avec Arès : qui était ce mari en question ?" },
    { level: 3, label: "–", points: 2, text: "De quoi Hestia était-elle la déesse ?" },
  ]},
  { id: 28, items: [
    { level: 0, label: "28)", points: 3, text: "Qui sont les auteurs des aventures d’Astérix ?" },
    { level: 1, label: "a)", points: 3, text: "César a conquis la Gaule en battant Vercingétorix à Alésia : en quelle année s’est déroulée cette bataille ?" },
    { level: 2, label: "i.", points: 3, text: "Dans quelle région française se trouve Alésia ?" },
    { level: 3, label: "–", points: 3, text: "Dans quel département français se trouve Alésia ?" },
  ]},
  { id: 29, items: [
    { level: 0, label: "29)", points: 3, text: "En 1940 furent découvertes en Dordogne des peintures datant d’il y a plus de 18 000 ans : comment s’appelle ce lieu ?" },
    { level: 1, label: "a)", points: 5, text: "Quel est le numéro de département de la Dordogne ?" },
    { level: 2, label: "i.", points: 4, text: "C’était également le deuxième numéro de maillot de Kobe Bryant : quel était son premier numéro de maillot ?" },
    { level: 3, label: "–", points: 5, text: "Quel est le prénom de sa fille avec qui il est décédé lors d’un accident d’hélicoptère ?" },
  ]},
  { id: 30, items: [
    { level: 0, label: "30)", points: 1, text: "Comment s’appellent les chutes d’eau à la frontière entre les Etats-Unis et le Canada ?" },
    { level: 1, label: "a)", points: 2, text: "Comment s’appelle la principale chaine de montagne se trouvant aux Etats-Unis ?" },
    { level: 2, label: "i.", points: 3, text: "Comment s’appelle le plus grand lac des Etats-Unis ?" },
    { level: 3, label: "–", points: 3, text: "Dans quel état se situe-t-il ?" },
  ]},
];

const TOTAL_BLOCKS = BLOCKS.length;

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);

const screenStart = $("screen-start");
const screenQuiz = $("screen-quiz");
const screenEnd = $("screen-end");

const nameInput = $("nameInput");
const startError = $("startError");

const progressEl = $("progress");
const scoreEl = $("score");

const kickerEl = $("kicker");
const questionTextEl = $("questionText");
const questionPointsEl = $("questionPoints");

const btnStart = $("btnStart");
const btnRight = $("btnRight");
const btnWrong = $("btnWrong");
const btnUndo = $("btnUndo");
const btnQuit = $("btnQuit");

const finalScoreEl = $("finalScore");
const leaderboardStatusEl = $("leaderboardStatus");
const leaderboardEl = $("leaderboard");
const btnRestart = $("btnRestart");

// ---------- State ----------
let playerName = "";
let score = 0;
let blockIndex = 0;  // 0..TOTAL_BLOCKS
let levelIndex = 0;  // 0..3
let startedAt = null;

// history stack for undo: {prevBlockIndex, prevLevelIndex, prevScore, action}
let history = [];

function normalizeName(s){
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function show(screen){
  screenStart.classList.add("hidden");
  screenQuiz.classList.add("hidden");
  screenEnd.classList.add("hidden");
  screen.classList.remove("hidden");
}

function currentItem(){
  if (blockIndex >= TOTAL_BLOCKS) return null;
  const block = BLOCKS[blockIndex];
  return block.items[levelIndex];
}

function levelHuman(label){
  // keep the original label: "1)", "a)", "i.", "–"
  return label;
}

function updateHeader(){
  const blockNo = Math.min(blockIndex + 1, TOTAL_BLOCKS);
  progressEl.textContent = (blockIndex >= TOTAL_BLOCKS)
    ? `Fin`
    : `Bloc ${blockNo}/${TOTAL_BLOCKS} · ${levelHuman(currentItem().label)}`;
  scoreEl.textContent = `Score : ${score}`;
}

function renderQuestion(){
  const item = currentItem();
  if (!item) return;

  const blockNo = blockIndex + 1;
  kickerEl.textContent = `Bloc ${blockNo} · ${levelHuman(item.label)}`;
  questionTextEl.textContent = item.text;
  questionPointsEl.textContent = `${item.points} point${item.points > 1 ? "s" : ""}`;

  btnUndo.disabled = history.length === 0;

  updateHeader();
}

function goNextOnCorrect(){
  const item = currentItem();
  const prev = { prevBlockIndex: blockIndex, prevLevelIndex: levelIndex, prevScore: score, action: "right" };

  score += item.points;

  if (levelIndex < 3){
    levelIndex += 1;
  } else {
    blockIndex += 1;
    levelIndex = 0;
  }

  history.push(prev);

  if (blockIndex >= TOTAL_BLOCKS){
    finishQuiz();
    return;
  }

  renderQuestion();
}

function goNextOnWrong(){
  const prev = { prevBlockIndex: blockIndex, prevLevelIndex: levelIndex, prevScore: score, action: "wrong" };

  // wrong => skip remainder of block
  blockIndex += 1;
  levelIndex = 0;

  history.push(prev);

  if (blockIndex >= TOTAL_BLOCKS){
    finishQuiz();
    return;
  }

  renderQuestion();
}

function undo(){
  const last = history.pop();
  if (!last) return;

  blockIndex = last.prevBlockIndex;
  levelIndex = last.prevLevelIndex;
  score = last.prevScore;

  if (blockIndex >= TOTAL_BLOCKS){
    // if we were on end screen, go back to quiz
    show(screenQuiz);
  }

  renderQuestion();
}

function quit(){
  // simple reset
  if (!confirm("Quitter le quiz ? Ton score ne sera pas enregistré.")) return;
  resetAll();
}

function resetAll(){
  playerName = "";
  score = 0;
  blockIndex = 0;
  levelIndex = 0;
  history = [];
  startedAt = null;

  leaderboardEl.innerHTML = "";
  leaderboardStatusEl.textContent = "";
  startError.textContent = "";
  nameInput.value = "";

  updateHeader();
  show(screenStart);
}

async function apiGet(path){
  const url = `${API_BASE}?path=${encodeURIComponent(path)}`;
  const res = await fetch(url, { method: "GET" });
  const json = await res.json();
  if (!res.ok) {
    const msg = json && json.error ? json.error : "Erreur API";
    throw new Error(msg);
  }
  return json;
}

async function apiPost(path, payload){
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, ...payload })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json && json.error ? json.error : `Erreur API (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return json;
}

function renderLeaderboard(entries){
  leaderboardEl.innerHTML = "";
  for (const e of entries){
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "lbRow";
    const name = document.createElement("span");
    name.className = "lbName";
    name.textContent = e.name;
    const sc = document.createElement("span");
    sc.className = "lbScore";
    sc.textContent = `${e.score}`;
    row.appendChild(name);
    row.appendChild(sc);
    li.appendChild(row);
    leaderboardEl.appendChild(li);
  }
}

async function checkNameAvailable(name){
  const norm = normalizeName(name);
  if (!norm) return { ok: false, msg: "Entre un prénom." };

  // If API not configured, we can't validate duplicates.
  if (!API_BASE || API_BASE.includes("PASTE_YOUR")){
    return { ok: false, msg: "API non configurée. Colle l’URL Apps Script dans app.js (API_BASE)." };
  }

  try{
    const data = await apiGet("leaderboard");
    const names = new Set((data.entries || []).map(e => normalizeName(e.name)));
    if (names.has(norm)){
      return { ok: false, msg: "Prénom déjà utilisé." };
    }
    return { ok: true, msg: "" };
  } catch(e){
    return { ok: false, msg: `Impossible de vérifier le prénom (${e.message}).` };
  }
}

async function start(){
  startError.textContent = "";

  const name = nameInput.value.trim();
  const check = await checkNameAvailable(name);
  if (!check.ok){
    startError.textContent = check.msg;
    return;
  }

  playerName = name.trim();
  startedAt = new Date().toISOString();

  score = 0;
  blockIndex = 0;
  levelIndex = 0;
  history = [];

  show(screenQuiz);
  renderQuestion();
}

async function finishQuiz(){
  finalScoreEl.textContent = `${score}`;
  show(screenEnd);

  leaderboardStatusEl.textContent = "Enregistrement du score…";
  leaderboardEl.innerHTML = "";

  const payload = {
    name: playerName,
    score,
    startedAt,
    finishedAt: new Date().toISOString(),
    // optional: minimal details for auditing/analytics
    details: {
      blocks: TOTAL_BLOCKS,
      actions: history.map(h => h.action), // coarse; you can enrich later
      userAgent: navigator.userAgent
    }
  };

  try{
    const data = await apiPost("submitScore", payload);
    leaderboardStatusEl.textContent = data.message || "Score enregistré.";
    renderLeaderboard(data.entries || []);
  } catch(e){
    if (e.status === 409){
      leaderboardStatusEl.textContent = "Prénom déjà utilisé. Reviens en arrière et choisis-en un autre.";
    } else {
      leaderboardStatusEl.textContent = `Erreur: ${e.message}`;
    }
    // Try at least to show current leaderboard
    try{
      const lb = await apiGet("leaderboard");
      renderLeaderboard(lb.entries || []);
    } catch(_){
      // ignore
    }
  }

  updateHeader();
}

// ---------- Events ----------
btnStart.addEventListener("click", start);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") start();
});

btnRight.addEventListener("click", goNextOnCorrect);
btnWrong.addEventListener("click", goNextOnWrong);
btnUndo.addEventListener("click", undo);
btnQuit.addEventListener("click", quit);

btnRestart.addEventListener("click", resetAll);

// ---------- Init ----------
updateHeader();
show(screenStart);
