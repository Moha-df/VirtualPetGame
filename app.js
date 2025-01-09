// Status
const States = {
  Normal: 1,
  Happy: 2,
  Sad: 7,
  Angry: 4,
  VeryHappy: 11,
  Lost: 9
};


//////////////////////////////////////// EXP SECTION EXP

let currentExp = 10;
let maxExp = 100;
let level = loadLevel();


function saveExp(currentExp, maxExp) {
  localStorage.setItem('currentExp', currentExp);
  localStorage.setItem('maxExp', maxExp);
  console.log("Expérience sauvegardée !");
}

function loadExp() {
  const currentExp = parseInt(localStorage.getItem('currentExp')) || 0; // Par défaut 0 si rien dans le localStorage
  const maxExp = parseInt(localStorage.getItem('maxExp')) || 100; // Par défaut 100 si rien dans le localStorage
  console.log("Expérience chargée :", { currentExp, maxExp });
  return { currentExp, maxExp };
}


function saveLevel(level) {
  localStorage.setItem('level', level);
  console.log("Level saved:", level);
}

function loadLevel() {
  const savedLevel = localStorage.getItem('level');
  if (savedLevel !== null) {
      return parseInt(savedLevel, 10); // Convertir en nombre
  }
  return 1; // Niveau par défaut si rien n'est sauvegardé
}

function saveState(state) {
  localStorage.setItem('state', state);
  console.log("State saved:", state);
}

function loadState() {
  const savedState = localStorage.getItem('state');
  if (savedState !== null) {
      return parseInt(savedState, 10); // Convertir en entier
  }
  return States.Normal; // Valeur par défaut si aucun état n'est sauvegardé
}


let state = loadState();
const expData = loadExp();
currentExp = expData.currentExp;
maxExp = expData.maxExp
updateExpBar(0); // to initalize the lvl




////////////////////////////////////////















// Sélectionner le canvas et configurer son contexte
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
let scale = 6; // Facteur d'échelle (x2 par exemple)
const backgroundImage = new Image();
backgroundImage.src = 'background2.png';

//toutes les 10 secondes ou apres chaque action le status est changer



// Variables globales
const spriteSheet = new Image();
let spriteData = null; // Contiendra les données du JSON
let currentFrame = 0;  // Frame actuelle
let frameWidth = 0;    // Largeur d'une frame
let frameHeight = 0;   // Hauteur d'une frame
let frameDurations = []; // Durées des frames
let animationStartTime = 0; // Moment du début de l'animation
let currentAnimation = ''; // Animation en cours

// Chargement des données JSON et du sprite
async function loadResources() {
  try {
    // Charger les données JSON
    const response = await fetch('spritePsycoduck/sprite/AnimData.json'); // Chemin à ajuster
    spriteData = await response.json();

    // Configurer l'image du sprite
    spriteSheet.src = 'spritePsycoduck/sprite/Idle-Anim.png'; // Chemin à ajuster pour l'image par défaut
    spriteSheet.onload = () => startAnimation('Idle'); // Lancer l'animation Idle par défaut
  } catch (error) {
    console.error('Erreur lors du chargement des ressources :', error);
  }
}

// Initialiser une animation
function startAnimation(animationName) {
  if (currentAnimation === animationName) {
    // Si l'animation est déjà en cours, ne pas la relancer
    return;
  }

  const animations = spriteData.AnimData.Anims.Anim;

  // Trouver l'animation par son nom
  const animation = animations.find(anim => anim.Name === animationName);
  if (!animation) {
    console.error(`Animation "${animationName}" introuvable dans les données.`);
    return;
  }

  // Charger l'image correspondante
  const spriteImagePath = animation.Image; // Récupérer le chemin de l'image de l'animation
  spriteSheet.src = spriteImagePath; // Charger l'image
  
  // Réinitialiser les variables d'animation
  currentFrame = 0;
  animationStartTime = performance.now();
  currentAnimation = animationName; // Mettre à jour l'animation en cours

  // Configurer les dimensions des frames et les durées
  frameWidth = parseInt(animation.FrameWidth, 10);
  frameHeight = parseInt(animation.FrameHeight, 10);
  frameDurations = animation.Durations.Duration.map(d => parseInt(d, 10));

  // Démarrer l'animation une fois l'image chargée
  spriteSheet.onload = () => {
    requestAnimationFrame(updateAnimation);
  };
}

function drawFrame(frameIndex) {
  const x = frameIndex * frameWidth; // Chaque frame est alignée horizontalement
  const y = 0; // On reste sur la première ligne de l'image

  const scaledWidth = frameWidth * scale;   // Largeur agrandie
  const scaledHeight = frameHeight * scale; // Hauteur agrandie

  // Calculer la position pour centrer l'image
  const centerX = (canvas.width - scaledWidth) / 2;
  const centerY = (canvas.height - scaledHeight) / 2 +30;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    spriteSheet,
    x, y, frameWidth, frameHeight, // Source : dimensions originales
    centerX, centerY, scaledWidth, scaledHeight // Destination : centrée
  );
}

// Mettre à jour l'animation
function updateAnimation(currentTime) {
  const elapsedTime = currentTime - animationStartTime;

  // Calculer la frame actuelle en fonction des durées
  let timeSum = 0;
  for (let i = 0; i < frameDurations.length; i++) {
    timeSum += frameDurations[i] * (1000 / 60); // Convertir en millisecondes
    if (elapsedTime < timeSum) {
      currentFrame = i;
      break;
    }
  }

  // Dessiner la frame actuelle
  drawFrame(currentFrame);


  // Boucler l'animation
  if (elapsedTime >= timeSum) {
    animationStartTime = currentTime; // Réinitialiser le temps
    currentFrame = 0; // Recommencer à la première frame
  }


  // Demander le prochain frame
  requestAnimationFrame(updateAnimation);
}

// Fonction pour lancer une animation
function playAnimation(animationName) {
  startAnimation(animationName); // Lancer l'animation en passant son nom
}

// Charger les ressources et démarrer
loadResources();



backgroundImage.onload = function() {
    // Dessiner l'image en entier pour remplir le canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};
  




const canvasPP = document.getElementById('pp');
const ctxPP = canvasPP.getContext('2d');
const imgPP = new Image();

// Fonction pour afficher un portrait donné par son numéro
function displayPortrait(num) {
  const cols = 5;  // 5 colonnes
  const rows = 8;  // 8 lignes
  const imgPPWidth = imgPP.width;  // Largeur totale de l'image
  const imgPPHeight = imgPP.height;  // Hauteur totale de l'image
  const portraitWidth = imgPPWidth / cols;  // Largeur de chaque portrait
  const portraitHeight = imgPPHeight / rows;  // Hauteur de chaque portrait

  const col = (num - 1) % cols;  // Colonne de l'image (0-4)
  const row = Math.floor((num - 1) / cols);  // Ligne de l'image (0-7)
  
  // Dessiner la portion de l'image correspondant au portrait
  ctxPP.clearRect(0, 0, canvasPP.width, canvasPP.height);  // Effacer le canvas
  ctxPP.drawImage(
    imgPP, 
    col * portraitWidth, row * portraitHeight, // Position de la section
    portraitWidth, portraitHeight, // Dimensions de la section
    0, 0, canvasPP.width, canvasPP.height // Affichage sur le canvas
  );
}

// Charger l'image de manière synchrone
imgPP.src = 'spritePsycoduck/pp/pp.png';  // Remplace par le chemin vers ton image

imgPP.onload = function() {
    // Une fois l'image chargée, exécuter ce code
    displayPortrait(1);  // Afficher le portrait numéro 1
} 












function updateExpBar(exp) {
  currentExp += exp; // Ajoute l'expérience gagnée
  if (currentExp >= maxExp) {
      levelUp();
  }
  const progressPercent = (currentExp / maxExp) * 100; // Calcule le pourcentage
  const progressBar = document.querySelector('#exp .progress');
  progressBar.style.width = progressPercent + '%'; // Modifie la largeur

  document.getElementById('lvl').textContent = `Lvl: ${level}`;

}

function levelUp() {
  currentExp = currentExp - maxExp; // Réinitialise l'expérience pour le nouveau niveau
  maxExp += 50; // Augmente la limite d'expérience pour le prochain niveau
  level += 1;
  document.getElementById('lvl').textContent = `Lvl: ${level}`; // Augmente le niveau
}

////////////////////////////////////





document.getElementById('FeedButton').addEventListener('click', () => {
  state = States.VeryHappy;
  displayPortrait(state);
});

document.getElementById('PunchButton').addEventListener('click', () => {
  state = States.Angry;
  displayPortrait(state);
  currentExp = 0;
  updateExpBar(0);
});

document.getElementById('PetButton').addEventListener('click', () => {
  if(state != States.VeryHappy){
    state = States.Happy;
    displayPortrait(state);
  }
  updateExpBar(5);
});











/////////////////////////////////////

let previousExp = null;
let previousMaxExp = null;
let previousLvl = null;
let prevousSaveState = null;

function repeatEverySecond() {

  displayPortrait(state);

  //exp save
  if (currentExp !== previousExp || maxExp !== previousMaxExp) {
    saveExp(currentExp, maxExp);
    previousExp = currentExp;
    previousMaxExp = maxExp;
  }
  if (level !== previousLvl) {
    saveLevel(level);
    previousLvl = level;
  }
  if (state !== prevousSaveState) {
    saveState(state);
    prevousSaveState = state;
  }



}


setInterval(repeatEverySecond, 1000);