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
// - Ghosts move 1 node per second, invoke findPath function after each move to find the shortest path to the player //! (A*)
// - Check if pac-man moves in the same collumn/row as a ghost (between solid blocks), if so -> chasing begins //! TBC LATER
// - Ghost will follow pac-man for the next 15 squares moves //! TBC LATER
// - If ghost hits pac-man game is over

// Pac-man:
// - Write pac-man functions -> move-top;right;down;left() - pacman moves forward unless the user changes direction by pressing arrow or there is a collision on the way
// - Every time pac-man moves check if the current square contains a coin class or a magic fruit class, if so -> score points & remove existing class
// - If pac-man eats magic fruit ghosts become vulnerable (could change appearance -> start flashing) and run away, ghost speed is decresed & timer starts //! (A*) REVERSE
//   => 
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
  let gameOver = false
  let movementDirection = 'right'

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

  const levelOne = new Level('Level 1', 20, 20, 'Cat', 21, 23, [138, 372, 225], solidLvl1)



  // ! BUILDING BOARD

  function buildBoard(level) {
    // Crating nodes
    for (let i = 0; i < level.width * level.height; i++) {
      const newNode = new Node
      newNode.cell = document.createElement('div')
      newNode.x = i % level.width
      newNode.y = Math.floor(i / level.width)
      newNode.index = i
      newNode.cell.innerText = `[${newNode.x}, ${newNode.y}] i:${newNode.index}]`
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
          if (level.opponents.indexOf(opponent) === 0) {
            node.cell.classList.add('opponent1')
          } else if (level.opponents.indexOf(opponent) === 1) {
            node.cell.classList.add('opponent2')
          } else {
            node.cell.classList.add('opponent3')
          }
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
      if (!(node.cell.classList.contains('player')) && !(node.cell.classList.contains('solid')) && !(node.cell.classList.contains('opponent1') || node.cell.classList.contains('opponent2') || node.cell.classList.contains('opponent3')) && !(node.cell.classList.contains('magic-food'))) {
        node.cell.classList.add('food')
      }

    })
    // Adjusting main section size
    main.style.width = `${(level.nodes[0].cell.offsetWidth * level.width) + 2 * level.width}px`

  }
  // ! PLAYER CONTROL MECHANICS

  function changePlayerPosition(level) {
    scorePoints(level)
    if (level.nodes[level.player.index].cell.classList.contains('magic-food')) {
      shockMode(level) // Need to add shock mode to chasePlayer, moveRandomly and taargetFourAhead
      // May need to add boolean value to control player vulnerability to ghosts
      // player kills ghosts when mode is on
      // They come back to their original positions and then leave after some time
    }
    level.nodes[level.player.index].cell.classList.remove('food')
    level.nodes[level.player.index].cell.classList.remove('magic-food')
    level.nodes[level.player.index].cell.classList.add('player')
  }

  function removePlayerPosition(level) {
    level.nodes[level.player.index].cell.classList.remove('player')
  }

  function moveRight(level) {
    if (!level.collisions.includes(level.player.index + 1)) {
      movementDirection = 'right'
      removePlayerPosition(level)
      level.player.index++
      level.player.currentPosition.x++
      changePlayerPosition(level)
      ghostFoundPlayer(level)
    } else {
      clearInterval(playerInterval)
    }
  }

  function moveLeft(level) {
    if (!level.collisions.includes(level.player.index - 1)) {
      movementDirection = 'left'
      removePlayerPosition(level)
      level.player.index--
      level.player.currentPosition.x--
      changePlayerPosition(level)
      ghostFoundPlayer(level)
    } else {
      clearInterval(playerInterval)
    }
  }

  function moveUp(level) {
    if (!level.collisions.includes(level.player.index - level.width)) {
      movementDirection = 'up'
      removePlayerPosition(level)
      level.player.index -= level.width
      level.player.currentPosition.y--
      changePlayerPosition(level)
      ghostFoundPlayer(level)
    } else {
      clearInterval(playerInterval)
    }
  }

  function moveDown(level) {
    if (!level.collisions.includes(level.player.index + level.width)) {

      removePlayerPosition(level)
      level.player.index += level.width
      level.player.currentPosition.y++
      changePlayerPosition(level)
      ghostFoundPlayer(level)
    } else {
      clearInterval(playerInterval)
    }
  }

  let playerInterval

  function handleKeyUp(event) {
    const key = event.keyCode
    clearInterval(playerInterval)
    playerInterval = setInterval(function () {
      if (!gameOver) {
        if (key === 39) {
          movementDirection = 'right'
          moveRight(this)
        } else if (key === 37) {
          movementDirection = 'left'
          moveLeft(this)
        } else if (key === 38) {
          movementDirection = 'up'
          moveUp(this)
        } else if (key === 40) {
          movementDirection = 'down'
          moveDown(this)
        }
      }
    }.bind(this), 300)
  }

  // ! OPPONENT CONTROL MECHANICS

  function changeOpponentPosition(level, targetNode, index) {
    let noClass = false
    if (!targetNode.cell.classList.contains('opponent1')) {
      level.nodes[targetNode.index].cell.classList.add('opponent1')
      noClass = true
    }
    if (!targetNode.cell.classList.contains('opponent2')) {
      level.nodes[targetNode.index].cell.classList.add('opponent2')
      noClass = true
    }
    if (!targetNode.cell.classList.contains('opponent3')) {
      level.nodes[targetNode.index].cell.classList.add('opponent3')
      noClass = true
    }
    if (noClass) {
      level.opponents[index].index = targetNode.index
      level.opponents[index].x = targetNode.x
      level.opponents[index].y = targetNode.y
    }
  }

  function removeOpponentPosition(level, targetNode, currentNode) {
    if (!targetNode.cell.classList.contains('opponent1')) {
      level.nodes[currentNode.index].cell.classList.remove('opponent1')
    }
    if (!targetNode.cell.classList.contains('opponent2')) {
      level.nodes[currentNode.index].cell.classList.remove('opponent2')
    }
    if (!targetNode.cell.classList.contains('opponent3')) {
      level.nodes[currentNode.index].cell.classList.remove('opponent3')
    }
  }

  let targetPlayerInterval
  // * Red Ghost Logic
  function chasePlayer(level, index) {
    clearInterval(targetPlayerInterval)
    targetPlayerInterval = setInterval(function () {
      ghostFoundPlayer(level)
      if (!gameOver) {
        const opponentCurrentNode = level.opponents[index]
        const path = findPath(level, opponentCurrentNode, level.nodes[level.player.index])
        const opponentTargetNode = path[0]
        removeOpponentPosition(level, opponentTargetNode, opponentCurrentNode)
        changeOpponentPosition(level, opponentTargetNode, index)
      } else {
        clearInterval(targetPlayerInterval)
      }
    }, 1000)
  }
  // * Pink Ghost Logic

  let targetFourInterval
  function targetFourAhead(level, index) {
    clearInterval(targetFourInterval)
    targetFourInterval = setInterval(function () {
      const opponentCurrentNode = level.opponents[index]
      if (!gameOver) {
        let opponentTargetNode = findTargetFourAhead(level)
        if (opponentTargetNode === undefined) {
          clearInterval(targetFourInterval)
          return
        } else {
          const path = findPath(level, opponentCurrentNode, opponentTargetNode)
          opponentTargetNode = path[0]
          removeOpponentPosition(level, opponentTargetNode, opponentCurrentNode)
          changeOpponentPosition(level, opponentTargetNode, index)
        }
      } else {
        clearInterval(targetFourInterval)
      }
    }, 1000)
  }

  function findTargetFourAhead(level) {
    const x = level.player.currentPosition.x
    const y = level.player.currentPosition.y
    let targetNode
    let selectedNode
    let selectedNodes = new Array
    if (movementDirection === 'right') {
      selectedNode = (level.nodes.find(node => (node.x === x + 4) && (node.y === y)))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.x === x + 3) && ((node.y === y + 1) || (node.y === y - 1))))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.x === x + 2) && ((node.y === y + 2) || (node.y === y - 2))))
      selectedNodes.push(selectedNode)
      //console.log('right')
    }
    if (movementDirection === 'left') {
      selectedNode = (level.nodes.find(node => (node.x === x - 4) && (node.y === y)))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.x === x - 3) && ((node.y === y + 1) || (node.y === y - 1))))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.x === x - 2) && ((node.y === y + 2) || (node.y === y - 2))))
      selectedNodes.push(selectedNode)
      //console.log('left')
    }
    if (movementDirection === 'up') {
      selectedNode = (level.nodes.find(node => (node.y === y - 4) && (node.x === x)))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.y === y - 3) && ((node.x === x + 1) || (node.x === x - 1))))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.y === y - 2) && ((node.x === x + 2) || (node.x === x - 2))))
      selectedNodes.push(selectedNode)
      //console.log('up')
    }
    if (movementDirection === 'down') {
      selectedNode = (level.nodes.find(node => (node.y === y + 4) && (node.x === x)))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.y === y + 3) && ((node.x === x + 1) || (node.x === x - 1))))
      selectedNodes.push(selectedNode)
      selectedNode = (level.nodes.find(node => (node.y === y + 2) && ((node.x === x + 2) || (node.x === x - 2))))
      selectedNodes.push(selectedNode)
      //console.log('down')
    }
    if (selectedNodes.length > 0 && selectedNodes.some(node => node !== undefined)) {
      selectedNodes = selectedNodes.filter(node => !node.cell.classList.contains('solid') && node !== undefined)
      targetNode = selectedNodes[0]
      //console.log(targetNode)
      targetNode.cell.style.backgroundColor = 'pink'
      return targetNode
    } else {
      targetNode = level.nodes[level.player.index]
      targetNode.cell.style.backgroundColor = 'pink'
      return targetNode
    }

  }

  // * Blue ghost logic

  let randomMoveInterval
  const randomPath = new Array


  function moveRandomly(level, index) {
    clearInterval(randomMoveInterval)
    if (randomPath.length === 0) {
      randomPath.push(level.nodes[level.opponents[2].index - 1])
    }
    randomMoveInterval = setInterval(function () {
      const opponentCurrentNode = level.nodes[level.opponents[index].index]
      const opponentPreviousNode = randomPath[randomPath.length - 1]
      let opponentTargetNode
      //randomPath.push(opponentCurrentNode)
      if (!gameOver) {
        let adjacentNodes = findAdjacent(level, opponentCurrentNode)
        adjacentNodes.splice(adjacentNodes.indexOf(opponentPreviousNode), 1)
        adjacentNodes = adjacentNodes.filter(node => !(node.cell.classList.contains('solid')))
        opponentTargetNode = adjacentNodes[Math.floor(Math.random() * (adjacentNodes.length))]
        randomPath.push(opponentCurrentNode)
        randomPath.shift()
        removeOpponentPosition(level, opponentTargetNode, opponentCurrentNode)
        changeOpponentPosition(level, opponentTargetNode, index)
        opponentTargetNode.cell.style.backgroundColor = 'lightblue'
      } else {
        clearInterval(randomMoveInterval)
      }
    }, 1000)
  }

  // ! SHOCK MODE FUNCTIONS

  function shockMode(level) {
    let shockMode = true
    // breaks normal move movements
    runAway(level)
  }

  function runAway(level) {
    clearInterval(randomMoveInterval)
    clearInterval(targetPlayerInterval)
    clearInterval(targetFourInterval)
    targetCorner(level, 0)
    targetCorner(level, 1)
    targetCorner(level, 2)
  }

  let targetCornerInterval
  function targetCorner(level, index) {
    let cornerIndex
    // ghostFoundPlayer(level) //! Player found ghost?
    if (!gameOver) { // Need something to switch this
      const opponentCurrentNode = level.opponents[index]

      if ((level.opponents[index].x > ((level.width / 2) - 1)) && (level.opponents[index].y > ((level.height / 2) - 1))) { //ok
        cornerIndex = level.nodes.length - (level.width + 2)
        level.nodes[cornerIndex].cell.style.backgroundColor = 'lightyellow'
      } else if ((level.opponents[index].x < (level.width / 2)) && (level.opponents[index].y > ((level.height / 2) - 1))) {//ok
        cornerIndex = level.nodes.length - ((2 * level.width) - 1)
        level.nodes[cornerIndex].cell.style.backgroundColor = 'lightgreen'
      } else if ((level.opponents[index].x > ((level.width / 2) - 1)) && (level.opponents[index].y < (level.height / 2))) {
        cornerIndex = ((2 * level.width) - 2)
        level.nodes[cornerIndex].cell.style.backgroundColor = 'red'
      } else if ((level.opponents[index].x < (level.width / 2)) && (level.opponents[index].y < (level.height / 2))) {
        cornerIndex = (level.width + 1)
        level.nodes[cornerIndex].cell.style.backgroundColor = 'blue'
      }
      targetCornerInterval = setInterval(function () {
        if (level.opponents[index].index === cornerIndex) {
          clearInterval(targetCornerInterval)
        } else {
          const path = findPath(level, opponentCurrentNode, level.nodes[cornerIndex])
          const opponentTargetNode = path[0]
          removeOpponentPosition(level, opponentTargetNode, opponentCurrentNode)
          changeOpponentPosition(level, opponentTargetNode, index)
        }
      }, 1000)
    } else {
      clearInterval(targetCornerInterval)
    }
  }



  // ! GAME OVER FUNCTIONS

  function ghostFoundPlayer(level) {
    const adjacentNodes = findAdjacent(level, level.nodes[level.player.index])
    if (adjacentNodes.some(node => (node.cell.classList.contains('opponent2') || node.cell.classList.contains('opponent3') || node.cell.classList.contains('opponent1')))) {
      console.log('game over')
      gameOver = true
    }
  }

  // ! PATH FINDING ALGORITHM (A*)

  // * Algorithm key values

  // F(currentNode) = G(currentNode) + H(currentNode)
  // F = number of nodes between startNode and finalNode (incl. finalNode)
  // G = number of nodes between currentNode and currentNode (incl. currentNode)
  // H = number of nodes between currentNode and finalNode (incl. finalNode; heuristic value)

  // * Calculating F, G, H values:

  function calculateH(node, finalNode) {
    return (Math.abs(node.x - finalNode.x) + Math.abs(node.y - finalNode.y))
  }

  function calculateG(node, startNode) {
    return (Math.abs(node.x - startNode.x) + Math.abs(node.y - startNode.y))
  }

  function calculateF(node) {
    return node.g + node.h
  }

  function findPath(level, startNode, finalNode) {
    // * findPath returns an array of ordered node.cell indices forming the shortest path to the finalNode
    level.nodes.forEach(node => {
      if (node.cell.classList.contains('path')) {
        node.cell.classList.remove('path')
      }
    })

    // * Create open and closed sets of nodes
    const nodesToCheck = new Array // Open a set of nodes to be checked
    const nodesChecked = new Array // Close a set of nodes that have been checked

    // * Begin search from startNode
    let currentNode = startNode // let currentNode = startNode -> First node currently being checked is startNode

    nodesToCheck.push(currentNode) // Push startNode as first node to be checked

    // * Search for the shortest path while there are still nodes to check
    while (nodesToCheck.length > 0) { // While nodesToCheck is not empty:

      // * Check F for all nodes in nodesToCheck and select the node from nodesToCheck with the lowest F value:
      let lowestFIndex = 0
      for (let i = 0; i < nodesToCheck.length - 1; i++) { // This will skip the start Node since (i = 0) < (nodesToCheck.lenght = 1) - 1 => 0 < 0 is false
        if (nodesToCheck[i].F < nodesToCheck[(i + 1)].F) {
          lowestFIndex = i
        }
      }
      currentNode = nodesToCheck[lowestFIndex] // Store node with the lowest F value in variable

      // * Check if currentNode is the finalNode& return the shortest path:
      if (currentNode.index === finalNode.index) { // If true, break the loop and return the path
        const path = new Array // Creates a saved path
        let currentChild = currentNode

        while (currentChild.parent) { // Returns true if parent is a defined object
          path.push(currentChild) // Adds parent object to the path
          level.nodes[currentChild.index].cell.classList.add('path')
          currentChild = currentChild.parent // change hierarchy level
        }
        path.forEach(node => node.cell.classList.add('path'))
        return path.reverse() // return path in reversed order, so it goes from starting node - the last child in hierarchy 
      }

      // * Close search for currentNode & move it from nodesToCheck to nodesChecked
      nodesChecked.push(currentNode)
      nodesToCheck.splice(currentNode, 1)

      // * Find adjacentNodes
      const adjacentNodes = findAdjacent(level, currentNode) // findAdjacent identifies 4 adjacent nodes

      for (let i = 0; i < adjacentNodes.length; i++) {
        const adjacentNode = adjacentNodes[i]

        // * Check if adjacentNode is not a solid cell or it has been already checked
        if (nodesChecked.includes(adjacentNode) || adjacentNode.cell.classList.contains('solid')) {

          continue // Ignore and check next adjacentNode 
        }


        const lowestNodeG = currentNode.G + 1 // LowestNodeG is current.node.G from current path incremented by 1

        // * check G and H of adjacentNode:
        if (!nodesToCheck.includes(adjacentNode)) {
          // AdjacentNode does not exist on the list of nodesToCheck

          nodesToCheck.push(adjacentNode) // Add node to nodesToCheck list
          adjacentNode.G = lowestNodeG + 1 // Add adjacentNode G
          adjacentNode.H = calculateH(adjacentNode, finalNode) // Calculate adjacentNodeH
          adjacentNode.F = calculateF(adjacentNode) // Calculate adjacentNodeF
          adjacentNode.parent = currentNode // Save new path stacking child elements in adjacentNode.parent property

        } else if (lowestNodeG < calculateG(adjacentNode, startNode)) {
          // adjacentNode already exists on nodesToCheck list but this time it has lower G than the previous time it was checked 

          adjacentNode.G = lowestNodeG + 1 // Add adjacentNode G
          adjacentNode.F = calculateF(adjacentNode) // Calculate adjacentNodeF
          adjacentNode.parent = currentNode // Save new path stacking child elements in adjacentNode.parent property
        }
      }
    }
    return 'No result found' // If nodesToCheck is empty - No solution found
  }



  function findAdjacent(level, currentNode) {
    // * findAdjacent returns an array of 4 nodes adjacent 

    const adjacentNodes = new Array
    level.nodes.forEach(node => {
      if ((node.index === currentNode.index + 1) || (node.index === currentNode.index - 1) || (node.index === currentNode.index + level.width) || (node.index === currentNode.index - level.width))
        adjacentNodes.push(node)
    })
    return adjacentNodes
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
    chasePlayer(level, 0)
    targetFourAhead(level, 1)
    moveRandomly(level, 2)

  }

  game(levelOne)


}

window.addEventListener('DOMContentLoaded', init)
