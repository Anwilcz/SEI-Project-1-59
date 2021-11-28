# Project 1 - Pacman Game 

Group size: ***[Anna Wilczynska](https://anwilcz.github.io)*** 
</br>
Duration: ***1 week***
</br>
</br>
Technologies used: ***JavaScript, HTML, CSS***

## Overview

The project aim was to create an app rendering a grid-based game in the browser, using JavaScript for DOM manipulation. The app handles mechanics such as wins and loses, player and opponents movements, scoring and level change. 

The game is my interpretation of a classic arcade from the 80's - Pacman, where the player aims to pick all the collectables whilst being hunted by ghosts. When the player picks up the special item, the game turns to shock mode - the player becomes invulnerable to opponents and hunts ghosts scoring additional points. Three different algorithms define the opponents' movements. The red opponent always follows the shortest path to the player calculated by the A-star algorithm. Green opponent targets the 4th field ahead of Pacman to approach the player against their movement direction whilst blue ghost's movements are randomized. 
</br>
</br>
</br>
[View deployment in Github pages](https://anwilcz.github.io/SEI-Project-1-59/)
</br>
</br>

## Pseudocode

### Structure
#### Interface:
   - Add a button that will start a game on click
   - Add a button that restarts the game
   - Display remaining time and current score & remaining coins
      
#### Create board:
   - Create grid using flexbox and javascript (n squares appended to main section)
   - Design structure of solid boxes (class with different styling that would be used to determine collisions)
   - Create tunel squares and class and set it on the board
   - Create food class and add it to every non-solid square on the board (except pac-man starting point)
   - Create a magic food class and set it on the boardz

### Player instance and opponents:
#### Pac-man:
   - Create pac-man instance of a player class that will contain functions responsible for movements (could be invoked directly on the object e.g. pacman.move())
   - Designate a starting point and set pac-man on the chosen square
#### Ghosts:
   - Create ghost instance of an opponent class & functions responsible for ghost actions 
   - Designate ghosts starting positions and set ghosts on chosen squares

### Game mechanics
#### Game start:
   - Add event listeners to the buttons
   - Start the timer when game begins && invoke main function

#### Ghosts:
   - Write a function that randomizes ghost moves
   - Ghosts move 1 node per second, invoke findPath function after each move to find the shortest path to the player //! (A*)
   - Ghost will follow pac-man 
   - If ghost hits pac-man game is over

#### Pac-man:
   - Write pac-man functions -> move-top;right;down;left() - pacman moves forward unless the user changes direction by pressing arrow or there is a collision on the way
   - Every time pac-man moves check if the current square contains food class or a magic food class, if so -> score points & remove existing class
   - If pac-man eats magic fruit ghosts become vulnerable (could change appearance -> start flashing// special sound effects) and run away, ghost speed is increased & timer starts (15sec)//! (A*) -> closest corner 
   - If pac-man hits a ghost -> ghost temporarily disappears & pacman scores points, when timer is down the rules go back to normal. 

#### Display Results:
   - If board is clear of coins -> pac-man wins, display result and score, move to another platform
   - If ghost hits pac-man or time runs out-> game is over, display result and score, ask user if they want to play again
