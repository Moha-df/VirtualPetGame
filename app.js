// Sélectionner le canvas et configurer son contexte
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
let scale = 6; // Facteur d'échelle (x2 par exemple)
const backgroundImage = new Image();
backgroundImage.src = 'background2.png';

//toutes les 10 secondes ou apres chaque action le status est changer
let status = 1; // 1 = Idle Normal, 2 = .. à définir


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

setTimeout(function() {
    displayPortrait(1);  // Afficher le portrait numéro 3 après 5 secondes
  }, 2000);