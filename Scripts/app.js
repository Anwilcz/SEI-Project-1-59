// ! --------------- GAME CHOICE 1: PAC-MAN --------------- ! //

// * 1. STRUCTURE:
// Interface:
// - Add a button that will start a game on click
// - Add a button that restarts the game
// - Display remaining time and current score & remaining coins

// Create board:
// - Create grid using flexbox and javascript (n squares appended to main section)
// - Design structure of solid boxes (class with different styling that would be used to determine collisions)
// - Create tunel squares and class and set it on the board
// - Create coin class and add it to every non-solid square on the board (except pac-man starting point)
// - Create a magic fruit class and set it on the board

// * 2. PLAYER INSTANCE AND OPPONENTS
// Pac-man:
// - Create pac-man instance of a player class that will contain functions responsible for movements (could be invoked directly on the object e.g. pacman.move())
// - Designate a starting point and set pac-man on the chosen square
// Ghosts:
// - Create ghost instance of an opponent class that will contain functions responsible for ghost actions (could be invoked directly on the object e.g. ghost.move())
// - Designate ghosts starting positions and set ghosts on chosen squares

// * 3. GAME MECHANICS
// Game start:
// - Add event listeners to the buttons
// - Start the timer when game begins && invoke main function

// Ghosts:
// - Write a function that randomizes ghost moves 
// - Check if pac-man moves in the same collumn/row as a ghost (between solid blocks), if so -> chasing begins
// - Ghost will follow pac-man for the next 15 squares moves
// - If ghost hits pac-man game is over

// Pac-man:
// - Write pac-man functions -> move-top;right;down;left() - pacman moves forward unless the user changes direction by pressing arrow or there is a collision on the way
// - Every time pac-man moves check if the current square contains a coin class or a magic fruit class, if so -> score points & remove existing class
// - If pac-man eats magic fruit ghosts become vulnerable (could change appearance -> start flashing) and run away, ghost speed is decresed & timer starts
// - If pac-man hits a ghost -> ghost goes back to its holding pen & score points, when timer is down the rules go back to normal. 

// Display Results
// - If board is clear of coins -> pac-man wins, display result and score, move to another platform
// - If ghost hits pac-man or time runs out-> game is over, display result and score, ask user if they want to play again

// * 4. ANIMATIONS
// - When pac-man moves, finds a coin or hits/ eats a ghost
// - When ghosts move and hit pac-man

function init() {

  // ! GLOBAL VARIABLES

  const grid = document.querySelector('.grid')
  const score = document.querySelector('#current-score')
  const main = document.querySelector('main')

  // ! OBJECTS STRUCTURE

  class Node {
    constructor(cell, x, y) {
      this.cell = cell
      this.x = x
      this.y = y
    }
  }

  class Player {
    constructor(index, level) {
      this.index = index
      this.startPosition = {
        x: index % level.width,
        y: Math.floor(index / level.width)
      }
      this.currentPosition = this.startPosition
    }

  }

  class Opponent {
    constructor(index, level) {
      this.index = index
      this.startPosition = {
        x: index % level.width,
        y: Math.floor(index / level.width)
      }
      this.currentPosition = this.startPosition
    }
  }

  class Level {
    constructor(name, width, height, playerName, playerIndex, magicPosition, opponentsIndices, collisions) {
      this.name = name
      this.width = width
      this.height = height
      this.nodes = new Array
      this.player = new Player(playerIndex, this)
      this.player.name = playerName
      this.opponentsIndices = opponentsIndices
      this.opponents = new Array
      opponentsIndices.forEach(index => {
        this.opponents.push(new Opponent(index, this))
      })
      this.magicPosition = magicPosition
      this.collisions = collisions

    }
  }
  // ! DEFINING LEVELS

  const solidLvl1 = [
    24, 28, 31, 35,
    42, 46, 47, 48, 51, 52, 53, 57,
    62, 63, 64, 67, 68, 71, 72, 75, 76, 77,
    84, 87, 88, 91, 92, 95,
    101, 102, 104, 105, 114, 115, 117, 118,
    127, 132,
    142, 143, 144, 147, 148, 149, 150, 151, 152, 155, 156, 157,
    162, 163, 164, 175, 176, 177,
    182, 183, 184, 185, 186, 187, 188, 191, 192, 193, 194, 195, 196, 197,
    205, 206, 207, 212, 213, 214,
    221, 222, 226, 227, 229, 230, 232, 233, 237, 238,
    241, 242, 243, 244, 249, 250, 255, 256, 257, 258,
    261, 266, 268, 269, 270, 271, 273, 278,
    285, 286, 288, 289, 290, 291, 293, 294,
    302, 303, 304, 305, 308, 309, 310, 311, 314, 315, 316, 317,
    322, 323, 324, 335, 336, 337,
    342, 343, 344, 345, 346, 348, 349, 350, 351, 353, 354, 355, 356, 357,
    365, 366, 373, 374
  ]

  const levelOne = new Level('Level 1', 20, 20, 'Cat', 21, 330, [138, 372, 225], solidLvl1)



  // ! BUILDING BOARD

  function buildBoard(level) {
    // Crating nodes
    for (let i = 0; i < level.width * level.height; i++) {
      const newNode = new Node
      newNode.cell = document.createElement('div')
      newNode.x = i % level.width
      newNode.y = Math.floor(i / level.width)
      newNode.index = i
      newNode.cell.innerText = `[${newNode.x}][${newNode.y} i:${newNode.index}]`
      level.nodes.push(newNode)
    }
    // Building grid
    level.nodes.forEach(node => {
      // Adding cell to grid
      grid.appendChild(node.cell)
      // Add cell styles
      node.cell.classList.add('cell')
      // Add player
      if (node.index === level.player.index) {
        node.cell.classList.add('player')
      }
      // Add opponents
      level.opponents.forEach(opponent => {
        if (node.index === opponent.index) {
          node.cell.classList.add('opponent')
        }
      })
      // Add collisions
      if (level.collisions.includes(node.index) || (node.x === 0) || (node.x === level.width - 1) || (node.y === 0) || (node.y === level.height - 1)) {
        node.cell.classList.add('solid')
        if (!(level.collisions.includes(node.index))) {
          level.collisions.push(node.index)
        }
      }
      // Add magic food
      if (node.index === level.magicPosition) {
        node.cell.classList.add('magic-food')
      }
      // Add food
      if (!(node.cell.classList.contains('player')) && !(node.cell.classList.contains('solid')) && !(node.cell.classList.contains('opponent')) && !(node.cell.classList.contains('magic-food'))) {
        node.cell.classList.add('food')
      }

    })
    // Adjusting main section size
    main.style.width = `${(level.nodes[0].cell.offsetWidth * level.width) + 2 * level.width}px`

  }
  // ! GAME MECHANICS
  function changePOSN(level) {
    scorePoints(level)
    level.nodes[level.player.index].cell.classList.remove('food')
    level.nodes[level.player.index].cell.classList.remove('magic-food')
    level.nodes[level.player.index].cell.classList.add('player')
  }

  function removePOSN(level) {
    level.nodes[level.player.index].cell.classList.remove('player')
  }

  function moveRight(level) {
    if (!level.collisions.includes(level.player.index + 1)) {
      removePOSN(level)
      level.player.index++
      level.player.currentPosition.x++
      changePOSN(level)
    } else {
      clearInterval(myInterval)
    }
  }

  function moveLeft(level) {
    if (!level.collisions.includes(level.player.index - 1)) {
      removePOSN(level)
      level.player.index--
      level.player.currentPosition.x--
      changePOSN(level)
    } else {
      clearInterval(myInterval)
    }
  }

  function moveUp(level) {
    if (!level.collisions.includes(level.player.index - level.width)) {
      removePOSN(level)
      level.player.index -= level.width
      level.player.currentPosition.y--
      changePOSN(level)
    } else {
      clearInterval(myInterval)
    }
  }

  function moveDown(level) {
    if (!level.collisions.includes(level.player.index + level.width)) {
      removePOSN(level)
      level.player.index += level.width
      level.player.currentPosition.y++
      changePOSN(level)
    } else {
      clearInterval(myInterval)
    }
  }

  let myInterval = setInterval(handleKeyUp, 300,)

  function handleKeyUp(event) {
    const key = event.keyCode
    clearInterval(myInterval)
    myInterval = setInterval(function () {
      if (key === 39) {
        moveRight(this)
      } else if (key === 37) {
        moveLeft(this)
      } else if (key === 38) {
        moveUp(this)
      } else if (key === 40) {
        moveDown(this)
      }
    }.bind(this), 300)

  }


  // ! SCORING POINTS

  function scorePoints(level) {
    if (level.nodes[level.player.index].cell.classList.contains('food')) {
      score.innerText = Number(score.innerText) + 100
    } else if (level.nodes[level.player.index].cell.classList.contains('magic-food')) {
      score.innerText = Number(score.innerText) + 1000
    }
  }

  // ! INVOKING FUNCTIONS

  function game(level) {
    document.addEventListener('keyup', handleKeyUp.bind(level))
    buildBoard(level)
    handleKeyUp(level)
  }

  game(levelOne)

}

window.addEventListener('DOMContentLoaded', init)
