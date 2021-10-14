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
// - Create food class and add it to every non-solid square on the board (except pac-man starting point)
// - Create a magic food class and set it on the boardz

// * 2. PLAYER INSTANCE AND OPPONENTS
// Pac-man:
// - Create pac-man instance of a player class that will contain functions responsible for movements (could be invoked directly on the object e.g. pacman.move())
// - Designate a starting point and set pac-man on the chosen square
// Ghosts:
// - Create ghost instance of an opponent class & functions responsible for ghost actions 
// - Designate ghosts starting positions and set ghosts on chosen squares

// * 3. GAME MECHANICS
// Game start:
// - Add event listeners to the buttons
// - Start the timer when game begins && invoke main function

// Ghosts:
// - Write a function that randomizes ghost moves
// - Ghosts move 1 node per second, invoke findPath function after each move to find the shortest path to the player //! (A*)
// - Ghost will follow pac-man 
// - If ghost hits pac-man game is over

// Pac-man:
// - Write pac-man functions -> move-top;right;down;left() - pacman moves forward unless the user changes direction by pressing arrow or there is a collision on the way
// - Every time pac-man moves check if the current square contains food class or a magic food class, if so -> score points & remove existing class
// - If pac-man eats magic fruit ghosts become vulnerable (could change appearance -> start flashing// special sound effects) and run away, ghost speed is increased & timer starts (15sec)//! (A*) -> closest corner
//   => 
// - If pac-man hits a ghost -> ghost temporarily disappears & pacman scores points, when timer is down the rules go back to normal. 

// Display Results
// - If board is clear of coins -> pac-man wins, display result and score, move to another platform
// - If ghost hits pac-man or time runs out-> game is over, display result and score, ask user if they want to play again
