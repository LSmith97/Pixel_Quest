# Planning

## Game Choice

Pixel Quest: a simple brower RPG a la classic final fantasy games, minus the overworld (so just encounter to encounter)

## Wireframe
Mock Up:
![mockup](../assets/wireframe-mockup.PNG)

Html:
![wireframe](../assets/wireframe-screenshot.PNG)

## Psuedocode

1) Define required constants
    1.a) Define Hero and Enemy class
    1.b) Define a list of possible encounters

2) Define required variables used to track the state of the game

3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant.

4) Upon loading the app should:
  4.a) Create a new Hero, and Initialize the state variables
  4.b) Render those values to the page
  4.c) Wait for the player to click the next encounter button

5) When next encounter is clicked, findEncounter(): randomly picks an encounter from a predetermined list
    4.a) If the encounter is an enemy, initCombat()
    4.b) Otherwise, do some effect (add gold, give xp, or boost player stats) and display a message
    4,c) Render
    4.d) Wait for the player to click the next encounter button

6) when initCombat() starts:
    6.a) Create a new Enemy object 
    6.b) Render the new enemy on the page and some encounter message
    6.c) Wait for the player to click an ability button to fight()
    

7) When the player clicks an ability, fight() to reduce enemy hp
    7.a) The enemy randomly picks an attack to fight() with
    7.b) If the enemy hp reaches 0, increase player XP and gold.
        7.b) wait for the player to click find Encounter
    7.c) if player xp reaches max, levelup() increase player stats, display level up message then render
    7.d) if player hp reaches 0, gameOver() - display game over message and allow player to reset game and init() again
    7.e) render
    

Icebox Features:
- Add sound when abilities are used and background music
- Add multiple different enemies and player classes