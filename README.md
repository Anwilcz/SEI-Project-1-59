# Project 1: Pacman: Grid-based game with JavaScript

Group size: solo project - ***[Anna Wilczynska](https://github.com/anwilcz)*** 
</br>
Duration: ***7 days***
</br>
Technologies used: ***JavaScript, HTML, CSS***
</br>
</br>
![Main image](https://res.cloudinary.com/dulbdr0in/image/upload/v1642026319/ReadMe%20Images/SEI_ReadMes/Pacman/pacman-main_pr8ffm.png)
</br>
### [✨ View deployment ✨](https://anwilcz.github.io/SEI-Project-1-59/)
</br>

## Brief

The project aim was to create an app rendering a grid-based game in the browser, using JavaScript for DOM manipulation. 

## Contents

- [Overview](#overview)
 - [Concept](#concept)
 - [Game mechanics](#game-mechanics)
- [Technologies used](#technologies-used)
  - [Languages](#languages)
- [Planning](#planning)
  - [Approach and planning](#approach-and-planning)
  - [Pseudocode](#pseudocode)
- [Project development](#project-development)
  - [Creating classes](#creating-classes)
  - [Building the board](#building-the-board)
  - [Player mechanics](#player-mechanics)
  - [Opponents' mechanics](#opponents-mechanics)
  - [Scoring](#scoring)
  - [Wins and losses](#wins-and-losses)
  - [Shock mode](#shock-mode)
  - [Timers](#timers)
  - [Level transition](#level-transition)
- [Deployment](#deployment)
- [Installation](#installation)
- [Wins and challenges](#wins-and-challenges)
- [Key learning](#key-learning)
- [Future upgrades](#future-upgrades)
- [Copyright and licensing](#copyright-and-licensing)

## Overview
First project built during the Software Engineering Immersive course at the General Assembly.

### Concept
Interpretation of Pacman, the classic 80's arcade game where the player navigates Pacman through a maze of collectables whilst being hunted by ghosts. When the player picks up the special item, the game turns to shock mode - the player becomes invulnerable to opponents and hunts ghosts scoring additional points. 

### Game mechanics
The app handles win and losses mechanics, opponents' movements based on player tracking, scoring and level transition. Three different algorithms define the opponents' movements. The red opponent always follows the shortest path to the player calculated by the A-star algorithm. Green opponent targets the 4th field ahead of Pacman to approach the player against their movement direction whilst blue ghost's movements are randomized.

## Technologies used

### Languages
- **JavaScript** - DOM manipulation
- **HTML** - structure
- **CSS** - styling

## Planning

### Approach and planning
Planning before the development stage involved the analysis of the classic arcade game mechanics. Please, find below the pseudocode identifying the general structure of the project and the main steps essential for the development process.

### Pseudocode
- **Structure**
    - Interface:
         - Add a button that starts a game on click.
         - Add a button that restarts the game.
         - Display remaining time and current score & remaining collectables.
    - Player instance and opponents:
         - Create a ‘Player’ and ‘Opponent’ class to save information about a player and opponent’s current nodes and coordinates.
    - Building levels:
         - Create a ‘Level’ class that will preserve information about the current level, including the size of the grid, nodes, collisions, player, opponents initial position and collectables. 
    - Building grid:
         - Create a ‘Node’ class with the following attributes: cell - newly created DOM element that will represent a cell in the browser, x and y coordinates; Collection of nodes should be saved in ‘Level’ class.
         - Create a two dimensional grid using JavaScript - (n) child elements appended to the HTML DOM parent element; container width should be defined by JavaScript function to disable unwanted wrap and depend on the grid width of the level).
         - Design a structure of nodes (array of indices/coordinates that could be used to determine collisions); iterate through the collection of Nodes and add a CSS class to selected elements.
         - Create a CSS class for collectables and add it to every cell which the player can access and is not the player/ opponent's initial position; This could require two steps to add special collectables.
- **Game mechanics**
    - Start:
         - Add event listeners to the buttons; Start the timer when the game begins && invoke the main function.
    - Player movements:
         - Write a function that handles player movement and responds to KeyUp events.
    - Ghosts:
         - Write a function that changes opponent position- adds and removes ‘opponent’ CSS class from the class list of the current node DOM element.
         - Write a function that randomizes ghost moves.
         - Write a function that tracks player position; Ghosts move 1 node per second, invoke ‘find path’ function after each move to find the shortest path to the player; based on (A*) algorithm.
         - Write a function that targets 4 nodes ahead of the player position to allow opponents to approach from a different direction.
         - Write a function that handles losses in case a ghost reaches the player. 

    - Player:
         - Write a function that handles player moves depending on the four directions (up, down, left and right); adds and removes ‘player’ CSS class from the class list of the current node DOM element and checks for the collisions and opponents within the target node.
         - Player keeps moving forward unless the keyUp event key changes or there is a collision on the way. Every time the player moves: check if the current square contains food class or a magic food class, if so - score points & remove existing class.
         - If the player collects magic fruit ghosts become vulnerable and run away to the closest corner, ghost speed is increased & timer starts (10 sec). During shock mode the player can score additional points for catching a ghost and cannot be killed. Caught ghost temporarily disappears until the shock mode timer is down. 
    - Display Results:
         - If the board is clear of collectables, the player wins - display result and score, move to another level.
         - If the ghost catches the player or time runs out, the game is over, displays the result and score, and asks the user if they want to play again.

## Project development

### Creating classes
Classes were essential to structure different game objects such as Player, Opponent, Node and Level to store and preserve information about the gameplay within their instances. 
</br></br>
Level class owns attributes defining the size of the board, maze design, opponents, player and remaining time of the gameplay.</br>

```
class Level {
      constructor(number, width, height, playerName, playerIndex, magicPosition, opponentsIndices, collisions, time) {
           this.number = number
           this.width = width // Number of cells in a row
           this.height = height // Number of cells in a column
           this.nodes = new Array // Array of Node instances
           this.player = new Player(playerIndex, this) // Instance of Player class
           this.player.name = playerName
           this.opponentsIndices = opponentsIndices // Array of opponents initial cell indices
           this.opponents = new Array // Array of Opponent class instances
           opponentsIndices.forEach(index => { // Sets initial cell index for each opponent
             this.opponents.push(new Opponent(index, this))
           })
           this.magicPosition = magicPosition // Array of magic foods cell indices
           this.collisions = collisions // Array of collision cells indices
           this.time = time // Stores remaining time of the gameplay
      }
 }

```

Node class owns attributes defining DOM representation of the instance and position on the grid.</br>

```
class Node {
      constructor(cell, x, y) {
           this.cell = cell // DOM object representation of the Node
           this.index = index // number of the order the cell was appended to the DOM parent
           this.x = x // x, y coordinates of two dimensional grid
           this.y = y
      }
 }

```

Player and Opponent classes do not have attributes defining their DOM representations - the images are rendered in the browser by adding a dedicated CSS class to the grid cell.
</br>

```
class Player {
      constructor(index, level) {
           this.index = index
           this.startPosition = {
             x: index % level.width, // calculates x and y coordinates based on a cell index and grid dimensions stored in Level class instance
             y: Math.floor(index / level.width)
           }
           this.currentPosition = this.startPosition
   }
```

CSS representations</br>

```
.player {
       background-image: url('../Assets/cat.gif'); // Displays the image in the cell background
       background-size: 28px; // Background size adjusted to cell dimensions
       background-repeat: no-repeat;
       box-shadow: none !important;
}
```

### Building the board
The function buildBoard reuses all the information stored in Level class instances and builds DOM representation of the grid displayed in the browser.</br>

```
function buildBoard(level) {
      // Crating nodes
      for (let i = 0; i < level.width * level.height; i++) { // Number of nodes depends on level dimensions
            const newNode = new Node // Creating a node
            newNode.cell = document.createElement('div') // Creating DOM representation of a cell 
            newNode.x = i % level.width 
            newNode.y = Math.floor(i / level.width)
            newNode.index = i
            level.nodes.push(newNode)
      }
      // Adding magic food
      level.magicPosition.forEach(index => {
            foodCount.innerText = Number(foodCount.innerText) + 1
            level.nodes[index].cell.classList.add('magic-food')
      })
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
            level.opponents[0].color = 'red'
            level.opponents[1].color = 'green'
            level.opponents[2].color = 'blue'
            level.nodes[level.opponents[0].index].cell.classList.add('red-opponent')
            level.nodes[level.opponents[1].index].cell.classList.add('green-opponent')
            level.nodes[level.opponents[2].index].cell.classList.add('blue-opponent')
            // Add collisions
            if (level.collisions.includes(node.index) || (node.x === 0) || (node.x === level.width - 1) || (node.y === 0) || (node.y === level.height - 1)) {
                  node.cell.classList.add('solid')
                  if (!(level.collisions.includes(node.index))) {
                        level.collisions.push(node.index)
                  }
            }
            // Add food
            if (!(node.cell.classList.contains('player')) && !(node.cell.classList.contains('solid')) && !(node.cell.classList.contains('magic-food'))) {
                  node.cell.classList.add('food')
                  // Count food
                  foodCount.innerText = Number(foodCount.innerText) + 1
            }
      })
      // Adjusting main section size
      main.style.width = `${(level.nodes[0].cell.offsetWidth * level.width) + 2 * level.width}px`

}
```

The width of the ‘main’, a container of the grid, is modified in JavaScript to disable unwanted grid wrap and depends on the level width.

### Player mechanics
KeyUp events provide the information of the pressed key and define the movement direction based on its code. When the movement direction is set and there is no collision on the way, the player's current cell index and coordinates will be changed to the ones owned by the target Node and change player position removePlaterPosition functions will be invoked to render the change in the browser.</br>

```
level.nodes[level.player.index].cell.classList.add('player')
level.nodes[level.player.index].cell.classList.remove('player')
```

### Opponents’ mechanics
Opponents’ movement logic is based on three different algorithms.</br>

![Opponents algorithms](https://res.cloudinary.com/dulbdr0in/image/upload/v1642026313/ReadMe%20Images/SEI_ReadMes/Pacman/pacman_opponents_movements_ivcnu7.png)</br>

Red ghost always targets the current Node of the player and its movement path is defined by the A star algorithm. To see the pseudocode and learn more about the A star algorithm, click [here](https://en.wikipedia.org/wiki/A*_search_algorithm). </br>
</br>
Green ghost path is also based on the A star algorithm but in this case, the target Node is set 4 cells ahead of the Player’s current Node. This change allows the second ghost to approach the player from the opposite direction and prevents opponents’ stacking in a ‘snake’ formation.</br>
</br>
The third ghost moves randomly. The only constraint here is that it always goes forward and cannot step on the previous Node that was targeted.

### Scoring
Every time changePlayerPosition function is invoked, it checks if target Node’s cell class list contains ‘food’, ‘magic-food’. If the condition is filled, the Player scores points.

### Wins and losses
Players win the game if ‘food’, ‘magic-food’ classes are removed from all the cells on the level grid. The game is lost in case the opponent's current Node is directly next to the Player's current Node. This condition is checked in the changeOpponentPosition function. If the situation occurs in the Shock Mode, the condition is not met and the Player scores points for catching a ghost. If the remaining time value is equal to 0, the game is lost.</br>
</br>
gameOver is a boolean variable that determines if the gameplay is over.

### Shock mode
The game turns to shock mode when the Player steps on the Node whose cell’s class list contains ‘magic-food’. When this occurs, the game mechanics are reversed for 10s and each of the opponents targets Node in the corner of the grid. The path to the closest corner is defined by the Astar algorithm and depends on the quarter of the grid where the opponent is when shock mode is triggered. When the shock mode timer is down the ghosts go back to hunting the player following their initial logic.</br>
</br>
shockMode is a boolean variable that determines if the Shock Mode is on.

### Timers
Intervals and timeout methods are implemented in the code to smooth and synchronise player and opponent movements, terminate shock mode and end the game if the remaining time is equal to 0.

### Level transition
levelCompleted is a boolean variable that determines if the level was completed successfully. When the variable is set to true, a popup screen is triggered and the player is allowed to change levels. When accepted, all the cells are removed from the DOM parent container and the function buildBoard is invoked again, taking a different instance of Level class as a parameter.


## Deployment
The game was deployed with GitHub Pages directly from the GitHub repository and published as a website.</br>
[[View deployment]](https://anwilcz.github.io/SEI-Project-1-59/)

## Installation
The game can be run in the browser and does not require the installation of any dependencies.
To run the game, navigate to the project root directory and open the `index.html` file.

## Wins and challenges

### Wins
- Satisfying design and game functionality achieved in a relatively short time
- Implementation of the A Star - pathfinding algorithm
- Functional user interface that allows the player to restart the game and track current score
- Transitions between multiple levels 
- Introducing fully working shock mode to reverse hunting mechanics.

### Challenges
- Differentiating opponents movements based on player tracking and randomisation
- Reversing game mechanics and implementing ‘shock mode’ 
- Working with time intervals and timeout methods to smooth and synchronise player and opponent movements and terminate shock mode.

## Key learning
- Getting confidence in JavaScript programming language and DOM modifications.
- Learning how to use JavaScript to build interaction between the application and the user.
- Exploring advantages of JavaScript, CSS and HTML usage in web development.
- Learning the importance of planning for further development processes.

## Future upgrades
- Finding an algorithm for maze generation to automate level creation.
- Differentiate levels difficulty adding more opponents and game mechanics.
- Preserving player score to be displayed at the end of the game
- Responsive design: Grid cells should scale uniformly depending on the window inner width to prevent content scrolling on small screens.

## Copyright and licensing
This project was built for educational purposes only.
