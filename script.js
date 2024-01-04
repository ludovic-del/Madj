// Dimensions du plateau de jeu

const boardSize = 8;
const cellSize = 70;
const borderWidth = 35;
var blackScore = 0;
var whiteScore = 0;
var currentPlayer = "white";
var cach = [];
var white_scores = [];
var black_scores = [];
var passage = 0;
var id = 4;
var visited = [];
var colDict = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
};

// Initialisation du stage Konva
const stage = new Konva.Stage({
  container: "Game-container",
  width: boardSize * cellSize + 2 * borderWidth,
  height: boardSize * cellSize + 2 * borderWidth,
});

// Création de la couche pour le cadre du plateau de jeu
const borderLayer = new Konva.Layer();
stage.add(borderLayer);

// Création du cadre autour du plateau
const border = new Konva.Rect({
  x: borderWidth / 2,
  y: borderWidth / 2,
  width: stage.width() - borderWidth,
  height: stage.height() - borderWidth,
  stroke: "#03071e",
  strokeWidth: borderWidth,
});
borderLayer.add(border);

// Création de la couche pour le plateau de jeu
const boardLayer = new Konva.Layer();
stage.add(boardLayer);

// Fonction pour créer le plateau de jeu
function createBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Création de la cellule
      const cell = new Konva.Rect({
        x: col * cellSize + borderWidth,
        y: row * cellSize + borderWidth,
        width: cellSize,
        height: cellSize,
        fill: "#386641", // Couleur verte pour toutes les cellules
        stroke: "white", // Bordure blanche autour de chaque cellule
        strokeWidth: 1, // Épaisseur de la bordure
      });

      // Ajout d'un écouteur d'événements pour détecter les clics sur les cellules
      cell.on("click", () => {
        // Fonction à appeler lorsqu'une cellule est cliquée
        handleCellClick(row, col);
      });

      // Ajout de la cellule à la couche
      boardLayer.add(cell);

      // Ajout des numéros de ligne et de colonne
      if (col === 0) {
        // Numéros de ligne sur la première colonne
        const rowNum = new Konva.Text({
          x: 10,
          y: row * cellSize + borderWidth + cellSize / 2 - 10,
          text: `${row + 1}`,
          fontSize: 18,
          fill: "white",
        });
        boardLayer.add(rowNum);
      }

      if (col === 7) {
        // Numéros de ligne sur la première colonne
        const rowNum = new Konva.Text({
          x: cellSize * boardSize + cellSize - 20,
          y: row * cellSize + borderWidth + cellSize / 2 - 10,
          text: `${row + 1}`,
          fontSize: 18,
          fill: "white",
        });
        boardLayer.add(rowNum);
      }

      if (row === 0) {
        // Lettres de colonne sur la première ligne
        const colLetter = new Konva.Text({
          x: col * cellSize + borderWidth + cellSize / 2 - 5,
          y: 10,
          text: String.fromCharCode(65 + col),
          fontSize: 18,
          fill: "white",
        });
        boardLayer.add(colLetter);
      }

      if (row === 7) {
        // Lettres de colonne sur la première ligne
        const colLetter = new Konva.Text({
          x: col * cellSize + borderWidth + cellSize / 2 - 5,
          y: row * cellSize + borderWidth + cellSize + 9,
          text: String.fromCharCode(65 + col),
          fontSize: 18,
          fill: "white",
        });
        boardLayer.add(colLetter);
      }

      // Ajout des pions par défaut dans les 4 cases centrales
      if (
        (row === 3 && col === 3) ||
        (row === 3 && col === 4) ||
        (row === 4 && col === 3) ||
        (row === 4 && col === 4)
      ) {
        const playerColor = (row + col) % 2 === 0 ? "black" : "white";
        const x = col * cellSize + borderWidth + cellSize / 2;
        const y = row * cellSize + borderWidth + cellSize / 2;

        const circle = new Konva.Circle({
          x: x,
          y: y,
          radius: cellSize / 2 - 5,
          fill: playerColor,
        });

        // Ajout du cercle à la couche
        boardLayer.add(circle);
      }
    }
  }

  // Mise à jour des couches pour afficher les cellules et les numéros
  boardLayer.draw();
  borderLayer.draw();
}

//mettre à jour le score sur la diagonale gauche
function update_left_diag(pion, score, visiteTable = []) {
  row = pion.x;
  col = pion.y;

  if (pion.l_d != score) {
    pion.l_d = score;
  }

  // Vérifier si la case a déjà été visitée dans cette itération
  if (visiteTable.some((value) => value.row === row && value.col === col)) {
    return 0;
  }

  // Ajouter la position actuelle aux positions visitées
  visiteTable.push({ row, col });

  if (0 <= pion.x - 1 && pion.x - 1 < 8 && 0 <= pion.y - 1 && pion.y - 1 < 8) {
    if (
      cach[pion.x - 1][pion.y - 1] &&
      cach[pion.x - 1][pion.y - 1].color == pion.color
    ) {
      update_left_diag(
        cach[pion.x - 1][pion.y - 1],
        score,
        visiteTable.slice()
      );
    }
  }

  if (0 <= pion.x + 1 && pion.x + 1 < 8 && 0 <= pion.y + 1 && pion.y + 1 < 8) {
    if (
      cach[pion.x + 1][pion.y + 1] &&
      cach[pion.x + 1][pion.y + 1].color == pion.color
    ) {
      update_left_diag(
        cach[pion.x + 1][pion.y + 1],
        score,
        visiteTable.slice()
      );
    }
  }
}

//mettre à jour le score sur la diagonale droite
function update_right_diag(pion, score, visiteTable = []) {
  row = pion.x;
  col = pion.y;

  if (pion.r_d != score) {
    pion.r_d = score;
  }

  // Vérifier si la case a déjà été visitée dans cette itération
  if (visiteTable.some((value) => value.row === row && value.col === col)) {
    return 0;
  }

  visiteTable.push({ row, col });

  if (0 <= pion.x - 1 && pion.x - 1 < 8 && 0 <= pion.y + 1 && pion.y + 1 < 8) {
    if (
      cach[pion.x - 1][pion.y + 1] &&
      cach[pion.x - 1][pion.y + 1].color == pion.color
    ) {
      update_right_diag(
        cach[pion.x - 1][pion.y + 1],
        score,
        visiteTable.slice()
      );
    }
  }

  if (0 <= pion.x + 1 && pion.x + 1 < 8 && 0 <= pion.y - 1 && pion.y - 1 < 8) {
    if (
      cach[pion.x + 1][pion.y - 1] &&
      cach[pion.x + 1][pion.y - 1].color == pion.color
    ) {
      update_right_diag(
        cach[pion.x + 1][pion.y - 1],
        score,
        visiteTable.slice()
      );
    }
  }
}

//mettre à jour le score sur la ligne
function update_line(pion, score, visiteTable = []) {
  row = pion.x;
  col = pion.y;

  if (pion.l != score) {
    pion.l = score;
  }

  // Vérifier si la case a déjà été visitée dans cette itération
  if (visiteTable.some((value) => value.row === row && value.col === col)) {
    return 0;
  }

  visiteTable.push({ row, col });

  if (0 <= pion.x && pion.x < 8 && 0 <= pion.y - 1 && pion.y - 1 < 8) {
    if (
      cach[pion.x][pion.y - 1] &&
      cach[pion.x][pion.y - 1].color == pion.color
    ) {
      update_line(cach[pion.x][pion.y - 1], score, visiteTable.slice());
    }
  }

  if (0 <= pion.x && pion.x < 8 && (0 <= pion.y + 1 && pion.y + 1) < 8) {
    if (
      cach[pion.x][pion.y + 1] &&
      cach[pion.x][pion.y + 1].color == pion.color
    ) {
      update_line(cach[pion.x][pion.y + 1], score, visiteTable.slice());
    }
  }
}

//mettre à jour le score sur la colonne
function update_column(pion, score, visiteTable = []) {
  row = pion.x;
  col = pion.y;

  if (pion.c != score) {
    pion.c = score;
  }

  // Vérifier si la case a déjà été visitée dans cette itération
  if (visiteTable.some((value) => value.row === row && value.col === col)) {
    return 0;
  }

  visiteTable.push({ row, col });

  if (0 <= pion.x - 1 && pion.x - 1 < 8 && 0 <= pion.y && pion.y < 8) {
    if (
      cach[pion.x - 1][pion.y] &&
      cach[pion.x - 1][pion.y].color == pion.color
    ) {
      update_column(cach[pion.x - 1][pion.y], score, visiteTable.slice());
    }
  }

  if (0 <= pion.x + 1 && pion.x + 1 < 8 && 0 <= pion.y && pion.y < 8) {
    if (
      cach[pion.x + 1][pion.y] &&
      cach[pion.x + 1][pion.y].color == pion.color
    ) {
      update_column(cach[pion.x + 1][pion.y], score, visiteTable.slice());
    }
  }
}

function handleCellClick(row, col) {
  const isCellEmpty = isCellEmptyAt(row, col);

  if (!isCellEmpty) {
    // Vérifier si au moins une cellule voisine contient un pion
    const hasNeighbor = hasAdjacentPion(row, col);

    if (hasNeighbor) {
      // Récupérer la position de la cellule
      const x = col * cellSize + borderWidth + cellSize / 2;
      const y = row * cellSize + borderWidth + cellSize / 2;

      // Créer un cercle (pion)
      const circle = new Konva.Circle({
        x: x,
        y: y,
        radius: cellSize / 2 - 5, // Ajuster le rayon pour s'assurer qu'il s'ajuste à la taille de la cellule
        fill: currentPlayer,
      });

      // Ajouter le cercle à la couche
      boardLayer.add(circle);

      pion = {
        id: 0,
        color: "",
        x: 0,
        y: 0,
        l: 1,
        c: 1,
        r_d: 1,
        l_d: 1,
      };

      pion.id = id + 1;
      pion.color = currentPlayer;
      pion.x = row;
      pion.y = col;

      addToCach(row, col, pion);

      id = id + 1;

      score = scoreCalcul(row, col, currentPlayer, visited);

      // Changement de joueur actif
      gameHistory(currentPlayer, row, col);
      console.log(currentPlayer + " a joué à : " + row + "," + col);
      currentPlayer = currentPlayer === "black" ? "white" : "black";

      // Mise à jour du panneau de score
      updateScorePanel();

      // Rafraîchir la couche pour afficher le nouveau cercle
      boardLayer.draw();
    } else {
      alert("Le nouveau pion doit être adjacent à un pion existant.");
    }
  } else {
    alert("La cellule est déjà occupée.");
  }
}

// Fonction pour vérifier si au moins une cellule voisine contient un pion
function hasAdjacentPion(row, col) {
  const directions = [
    [-1, 0],
    [1, 0], // Haut, bas
    [0, -1],
    [0, 1], // Gauche, droite
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // Diagonales
  ];

  for (let i = 0; i < directions.length; i++) {
    const new_row = row + directions[i][0];
    const new_col = col + directions[i][1];

    if (isCellEmptyAt(new_row, new_col)) {
      return true; // Au moins une cellule voisine contient un pion
    }
  }

  return false; // Aucune cellule voisine ne contient de pion
}

function getPionColorAt(row, col) {
  // Vérifier si la position a une couleur dans le cache
  if (cach[row][col]["black"]) {
    return "black";
  } else if (cach[row][col]["white"]) {
    return "white";
  } else {
    // Si la position n'a pas de couleur dans le cache, la case est vide
    return "vide";
  }
}

function addToCach(row, col, pion) {
  cach[row][col] = pion;
}

//calcul de score
function scoreCalcul(row, col, color) {
  // Vérifier si la case est vide
  if (!isCellEmptyAt(row, col)) {
    return 0;
  }

  // Tableau des directions possibles
  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 1],
  ];

  // Calculer le score pour chaque direction possible
  for (let i = 0; i < directions.length; i++) {
    const new_row = row + directions[i][0];
    const new_col = col + directions[i][1];

    // console.log(`Direction ${i}, new_row: ${new_row}, new_col: ${new_col}, color: ${cach[new_row][new_col].color}`);

    //verifier si la case est vide
    if (isCellEmptyAt(new_row, new_col)) {
      // Vérifier si la nouvelle position est valide
      if (0 <= new_row && new_row < 8 && 0 <= new_col && new_col < 8) {
        //condition pour déterminier le score sur la diagonale gauche
        if (
          (directions[i][0] == -1 && directions[i][1] == -1) ||
          (directions[i][0] == 1 && directions[i][1] == 1)
        ) {
          if (
            isCellEmptyAt(row - 1, col - 1) &&
            isCellEmptyAt(row + 1, col + 1)
          ) {
            cach[row][col].l_d =
              cach[row - 1][col - 1].l_d + cach[row + 1][col + 1].l_d + 1;
          } else {
            if (cach[new_row][new_col].color == color) {
              cach[row][col].l_d = cach[new_row][new_col].l_d + 1;
            }
          }
        }

        //condition pour déterminier le score sur la diagonale droite
        if (
          (directions[i][0] == -1 && directions[i][1] == 1) ||
          (directions[i][0] == 1 && directions[i][1] == -1)
        ) {
          if (
            isCellEmptyAt(row - 1, col + 1) &&
            isCellEmptyAt(row + 1, col - 1)
          ) {
            cach[row][col].r_d =
              cach[row - 1][col + 1].r_d + cach[row + 1][col - 1].r_d + 1;
          } else {
            if (cach[new_row][new_col].color == color) {
              cach[row][col].r_d = cach[new_row][new_col].r_d + 1;
            }
          }
        }

        //condition pour déterminier le score sur la ligne
        if (
          (directions[i][0] == 0 && directions[i][1] == -1) ||
          (directions[i][0] == 0 && directions[i][1] == 1)
        ) {
          if (isCellEmptyAt(row, col - 1) && isCellEmptyAt(row, col + 1)) {
            cach[row][col].l = cach[row][col - 1].l + cach[row][col + 1].l + 1;
          } else {
            if (cach[new_row][new_col].color == color) {
              cach[row][col].l = cach[new_row][new_col].l + 1;
            }
          }
        }

        //condition pour déterminier le score sur la colonne
        if (
          (directions[i][0] == -1 && directions[i][1] == 0) ||
          (directions[i][0] == 1 && directions[i][1] == 0)
        ) {
          if (isCellEmptyAt(row - 1, col) && isCellEmptyAt(row + 1, col)) {
            cach[row][col].c = cach[row + 1][col].c + cach[row - 1][col].c + 1;
          } else {
            if (cach[new_row][new_col].color == color) {
              cach[row][col].c = cach[new_row][new_col].c + 1;
            }
          }
        }
      }
    }
  }

  score = Math.max(
    cach[row][col].l,
    cach[row][col].c,
    cach[row][col].l_d,
    cach[row][col].r_d
  );

  // console.log(color,"("+row,col+") :",score);

  if (cach[row][col].l == score) {
    update_line(cach[row][col], score);
  }
  if (cach[row][col].c == score) {
    update_column(cach[row][col], score);
  }
  if (cach[row][col].r_d == score) {
    update_right_diag(cach[row][col], score);
  }
  if (cach[row][col].l_d == score) {
    update_left_diag(cach[row][col], score);
  }

  console.log(cach);

  if (cach[row][col].color == "white") {
    white_scores[cach[row][col].id] = score;
    max = Math.max(...white_scores.filter(Number.isFinite));
    console.log(`Score ${color} :`, max);
  }
  if (cach[row][col].color == "black") {
    black_scores[cach[row][col].id] = score;
    max = Math.max(...black_scores.filter(Number.isFinite));
    console.log(`Score ${color} :`, max);
  }

  return 0;
}

// Intitialiser le cach
function cachInitialisation() {
  // Initialisation du tableau tridimensionnel avec des valeurs par défaut (par exemple, 0)
  for (let i = 0; i < 8; i++) {
    cach[i] = [];
    for (let j = 0; j < 8; j++) {
      cach[i][j] = {};
    }
  }

  // Affectation des valeurs spécifiées
  cach[3][3] = {
    id: 4,
    color: "black",
    x: 3,
    y: 3,
    l: 1,
    c: 1,
    r_d: 1,
    l_d: 2,
  };
  cach[4][4] = {
    id: 3,
    color: "black",
    x: 4,
    y: 4,
    l: 1,
    c: 1,
    r_d: 1,
    l_d: 2,
  };
  cach[3][4] = {
    id: 2,
    color: "white",
    x: 3,
    y: 4,
    l: 1,
    c: 1,
    r_d: 2,
    l_d: 1,
  };
  cach[4][3] = {
    id: 1,
    color: "white",
    x: 4,
    y: 3,
    l: 1,
    c: 1,
    r_d: 2,
    l_d: 1,
  };

  black_scores[cach[3][3].id] = cach[3][3].l_d;
  black_scores[cach[4][4].id] = cach[4][4].l_d;
  white_scores[cach[3][4].id] = cach[3][4].r_d;
  white_scores[cach[4][3].id] = cach[4][3].r_d;
}

// Fonction pour vérifier si la cellule est vide
function isCellEmptyAt(row, col) {
  const objects = boardLayer.getChildren();

  // Recherche d'un cercle aux coordonnées spécifiques
  const existingCircle = objects.find((obj) => {
    return (
      obj.getClassName() === "Circle" &&
      obj.x() === col * cellSize + borderWidth + cellSize / 2 &&
      obj.y() === row * cellSize + borderWidth + cellSize / 2
    );
  });

  // Si existingCircle est défini, la cellule est occupée
  return existingCircle;
}

// Fonction pour mettre à jour les scores
function updateScores(score) {
  // Implémentez ici la logique pour mettre à jour les scores en fonction du plateau de jeu
  // Cela dépend de la logique spécifique d'Othello.
  // Ici, nous incrémentons simplement le score pour le joueur actif à chaque clic.
  if (currentPlayer === "black") {
    blackScore == score;
  } else {
    whiteScore == score;
  }
}

// Fonction pour mettre à jour le panneau de score
function updateScorePanel() {
  // Mettre à jour les textes des cartes de score
  document.getElementById("Black-score").textContent = `NOIR : ${blackScore}`;
  document.getElementById("White-score").textContent = `BLANC : ${whiteScore}`;

  // Mettre en surbrillance la carte de score du joueur actif
  document
    .getElementById("Black-score")
    .classList.toggle("active", currentPlayer === "black");
  document
    .getElementById("White-score")
    .classList.toggle("active", currentPlayer === "white");
}

// Fonction pour trouver la cellule en fonction de la position x et y
function findCellByPosition(x, y) {
  const cells = boardLayer.getChildren();
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.x() === x && cell.y() === y) {
      return cell;
    }
  }
  return null;
}

var counter = 1;

//historique de la partie
function gameHistory(player, row, col) {
  // Créer un nouvel élément li
  var newListItem = document.createElement("li");

  // Ajouter des classes à l'élément li
  newListItem.classList.add("list-group-item");

  // Définir le contenu de l'élément li avec le texte souhaité
  newListItem.textContent = `${counter}. ${player} a joué à ${row + 1},${
    colDict[col]
  }`;

  // Ajouter le nouvel élément li à la liste existante
  document.getElementById("listhistory").appendChild(newListItem);
  // Faire défiler vers le bas automatiquement lorsque la liste est mise à jour
  listhistory.scrollTop = listhistory.scrollHeight;

  // Incrémenter le compteur
  counter++;
}

//nouveau game
function newgame() {
  window.location.reload();
}

//end game
function endgame(id) {
  if (id == 64) {
    max_noir = Math.max(...black_scores.filter(Number.isFinite));
    max_blanc = Math.max(...white_scores.filter(Number.isFinite));
    if (max_blanc > max_noir) {
      alert("Partie terminée, le joueur blanc l'emporte");
    } else {
      if (max_blanc < max_noir) {
        alert("Partie terminée, le joueur noir l'emporte");
      } else {
        alert("Partie terminée, match nul");
      }
    }
  }
}

// // script.js
// document.addEventListener("DOMContentLoaded", function () {
//   var modal = document.getElementById("myModal");
//   var btnBlack = document.getElementById("btnBlack");
//   var btnWhite = document.getElementById("btnWhite");

//   // Afficher le modal au chargement de la page
//   modal.style.display = "block";

//   // Gestion du clic sur le bouton Joueur Noir
//   btnBlack.addEventListener("click", function () {
//     modal.style.display = "none";
//     // Logique pour commencer avec le joueur noir
//     startGame("noir");
//   });

//   // Gestion du clic sur le bouton Joueur Blanc
//   btnWhite.addEventListener("click", function () {
//     modal.style.display = "none";
//     // Logique pour commencer avec le joueur blanc
//     startGame("blanc");
//   });

//   // Fonction de logique pour commencer le jeu
//   function startGame(startingPlayer) {
//     console.log("Le joueur qui commence est : " + startingPlayer);

//     // Utiliser un lancer de pièce pour choisir le joueur qui commence
//     var randomChoice = Math.random(); // Génère un nombre aléatoire entre 0 et 1

//     if (randomChoice < 0.5) {
//       console.log("Le joueur noir commence !");
//       // Ajoutez ici le code pour initialiser votre jeu avec le joueur noir qui commence
//     } else {
//       console.log("Le joueur blanc commence !");
//       // Ajoutez ici le code pour initialiser votre jeu avec le joueur blanc qui commence
//     }
//   }
// });

// Appel de la fonction pour créer le plateau de jeu
createBoard();

// Initialiser le panneau de score
updateScorePanel();

//initialiser le cach
cachInitialisation();
