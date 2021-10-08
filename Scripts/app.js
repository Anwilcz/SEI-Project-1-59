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

  const main = document.querySelector('main')
  const grid = document.querySelector('.grid')


  const collisionsLvl1 = [
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

  class Level {
    constructor(name, width, height, startPOSN, currentPOSN, opponentsPOSN, magicFoodPOSN, cells, collisions, empty) {
      this.name = name
      this.width = width
      this.height = height
      this.startPOSN = startPOSN
      this.currentPOSN = currentPOSN
      this.opponentsPOSN = opponentsPOSN
      this.magicFoodPOSN = magicFoodPOSN
      this.cells = cells
      this.collisions = collisions
      this.empty = empty
    }
  }

  const levelOne = new Level('Level 1', 20, 20, 21, 21, [138, 372, 225], 330, [], collisionsLvl1)


  function buildBoard(level) {
    // Building grid
    for (let i = 0; i < level.width * level.height; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.innerText = i
      level.cells.push(cell)
      grid.appendChild(cell)
    }
    // Building solid cells
    level.cells.forEach(cell => {
      const index = level.cells.indexOf(cell)
      if (((index + 1) % level.width === 0) || (index % level.width === 0) || ((index >= 0) && (index < level.width)) || (index >= (level.height * level.width) - level.width) || level.collisions.includes(index)) {
        cell.classList.add('solid')
        level.collisions.push(level.cells.indexOf(cell))
      }
    })
    // Identyfying empty cells
    level.empty = level.cells.map(cell => level.cells.indexOf(cell)).filter(index => !level.collisions.includes(index))
    // Adjusting width of main section
    main.style.width = `${(level.cells[0].offsetWidth * level.width) + 2 * level.width}px`
    // Adding player instance and opponents
    level.cells[level.startPOSN].classList.add('player')
    level.cells[level.magicFoodPOSN].classList.add('magic-food')
    level.cells.forEach(cell => {
      if (level.opponentsPOSN.includes(level.cells.indexOf(cell))) {
        cell.classList.add('opponent')
      }
    })
    // Filling up empty fields with food
    level.cells.forEach(cell => {
      if (!(cell.classList.contains('player') || cell.classList.contains('magic-food') || cell.classList.contains('solid'))) {
        cell.classList.add('food')
      }
    })
  }

  // Handling key up


  function changePOSN(level) {
    level.cells[level.currentPOSN].classList.remove('food')
    level.cells[level.currentPOSN].classList.add('player')
  }

  function removePOSN(level) {
    console.log(level)
    level.cells[level.currentPOSN].classList.remove('player')
  }

  function moveRight(level) {
    const myInterval = setInterval(function () {
      if (level.empty.includes(level.currentPOSN + 1)) {
        removePOSN(level)
        level.currentPOSN++
        changePOSN(level)
      } else {
        console.log('this should work')
        clearInterval(myInterval)
      }
    }, 200)
  }

  function moveLeft(level) {
    const myInterval = setInterval(function () {
      if (level.empty.includes(level.currentPOSN - 1)) {
        removePOSN(level)
        level.currentPOSN--
        changePOSN(level)
      } else {
        console.log('this should work')
        clearInterval(myInterval)
      }
    }, 200)
  }


  function handleKeyUp(event) {
    
    const key = event.keyCode
    removePOSN(this)
    if (key === 39) {
      moveRight(this)
    } else if (key === 37) {
      moveLeft(this)
    } else if (key === 38 && this.empty.includes(this.currentPOSN - this.width)) {
      console.log('UP')
      this.currentPOSN -= this.width
    } else if (key === 40 && this.empty.includes(this.currentPOSN + this.width)) {
      console.log('DOWN')
      this.currentPOSN += this.width
    } else {
      console.log('INVALID KEY')
    }
    changePOSN(this)
  }






  // Main function

  function game(level) {
    document.addEventListener('keyup', handleKeyUp.bind(level))
    buildBoard(level)
    handleKeyUp(level)

  }

  game(levelOne)










}

window.addEventListener('DOMContentLoaded', init)
