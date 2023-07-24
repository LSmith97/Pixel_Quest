  /*----- constants -----*/

class Hero {
    constructor() {
        this.level = 1;
        this.xp = 0;

        this.atk = 5;
        this.def = 5
        this.maxHP = 20;
        this.hp = 20;
        this.maxMana = 10;
        this.mana = 10;

        this.gold = 0;
        this.score = 0;
    }

    abilities = [
        {name: 'Slash',
        target: 'enemy',
        damage: 5,
        cost: 0},

        {name: 'Fireball',
        target: 'enemy',
        damage: 10,
        cost: 5},

        {name: 'Spirit Bomb',
        target: 'enemy',
        damage: 15,
        cost: 10},
    ];

    fight(evt){ // Lowers enemy stats and player mana depending on ability used
        let idx = evt.target.id;
        let damage = player.abilities[idx]['damage'];
        let cost = player.abilities[idx]['cost'];
        let target;

        if (cost > player.mana) {
            message = "You don't have enough mana to use that!"
            render();
            return;
        }
        // If the target property of the ability is 'enemy' set the target to be the current encounter object
        // If the target property of the ability is 'self' set the target to be the player object
        if (player.abilities[idx]['target'] === 'enemy'){
            target = encounter;
        } else if (player.abilities[idx]['target'] === 'self'){
            target = player;
        }

        target.hp -= damage;
        player.mana -= cost;

        if(encounter.hp > 0){
            // If the enemy isn't defeated, they fight back
            encounter.fight();
        } else {
            // If the enemy is defeated:
            // Display victory message
            message = `You defeated the ${encounter.name}!`;
            // Increase player gold and xp
            player.gold += encounter.gold;
            player.xp += encounter.xp;
            // check for level up
            levelUp();
            // Set inCombat to false
            inCombat = false;
            //Render
            render();
        }
    }
}

class Enemy {
    constructor() {
        this.type = 'enemy';
        this.name = 'Goblin';

        this.atk = 5;
        this.def = 5
        this.maxHP = 20;
        this.hp = 20;

        this.xp = 25;
        this.gold = 25;

        this.abilities = [
            {name: 'Gobsmack',
            damage: 5},

            {name: 'Poison Arrow',
            damage: 10},
        ];
    }

    fight() {
        //TODO
        console.log("The enemy fights back");

        render();
    }
}

 // Define a table of encounters
 const encounterTable = [
    {type: "Bag o' Gold", 
    message: "You found a bag of gold on the side of the road. Gold +5!",
    effect: function(){
        player.gold += 5;
        },
    },

    {type: "Inn",
    message: "You find a place to rest and recover. HP and Mana refreshed!",
    effect: function(){
        player.hp = player.maxHP;
        player.mana = player.maxMana;
        },
    },

    {type: "Pitfall", 
    message: "You fell into a trap! You took 5 damage!",
    effect: function(){
        player.hp -= 5;
        },
    },

    {type: "enemy"},
]

  /*----- state variables -----*/

let player; 
let encounter;
let message; // The message that displays onscreen to the player
let inCombat; // Boolean, changes displayed elements based on whether the player is in a fight currently


  /*----- cached elements  -----*/

// field elements
const scoreEl = document.querySelector('#score h3');
const messageEl = document.querySelector('#message h3');
const encounterImgEl = document.querySelector('#encounter-container');
const heroImgEl = document.querySelector('#hero-container');

// player stat elements
const hpEl = document.querySelector('#hp');
const manaEl = document.querySelector('#mana');
const atkEl = document.querySelector('#attack');
const defEl = document.querySelector('#defense');
const goldEl = document.querySelector('#gold');

// XP bar element
const xpEl = document.querySelector('#xp-bar p')

// encounter stat elements
const typeEl = document.querySelector('#type');
const enemyHpEl = document.querySelector('#enemy-hp');
const enemyAtkEl = document.querySelector('#enemy-atk');
const enemyDefEl = document.querySelector('#enemy-def')

// button elements
const abilityBtns =  document.querySelectorAll('.ability-button');
const encounterBtn = document.querySelector("#encounter-button");

  /*----- event listeners -----*/

function findEncounter() {
   

    // Choose a random encounter from the encounter table
    encounter = encounterTable[Math.floor(Math.random() * encounterTable.length)];

    // If that encounter is an enemy, create a new Enemy instance and enter combat
    if(encounter.type === 'enemy'){
        inCombat = true;
        encounter = new Enemy;
        message = `You're stopped by a ${encounter.name}!`;
    } else {
        // Otherwise, 
        message = encounter.message;
        encounter.effect();
    }
    //Render
    render();
}

  /*----- functions -----*/

init();

function init() {
    // Create a new Hero
    player = new Hero();

    // Initialize the game state
    message = "You begin your adventure!";
    inCombat = false;
    encounter = {type: 'none'};

    // add event listeners to buttons
    abilityBtns.forEach(function(element){
        element.addEventListener('click', player.fight);
    });

    encounterBtn.addEventListener('click', findEncounter);

    // Render state to the page
    render();
}

function render(){ // Renders HTML elements
    renderStats();
    renderField();
    renderXP();
    renderActions();
    renderEncounter();
}

function renderStats() { // Renders the player's stats
    hpEl.textContent = `Health: ${player.hp}/${player.maxHP}`;
    manaEl.textContent = `Mana: ${player.mana}/${player.maxMana}`;
    atkEl.textContent = `Attack: ${player.atk}`;
    defEl.textContent = `Defense: ${player.def}`;
    goldEl.textContent = `Gold: ${player.gold}`;
}

function renderField() { // Renders the field, including score and message
    //render message and score
    messageEl.textContent = message;
    scoreEl.textContent = `Score: ${player.score}`;

    // If there is no current encounter, hide the encounter image
    if(encounter.type === 'none'){
        encounterImgEl.classList.add('hidden');
    } else {
        encounterImgEl.classList.remove('hidden');
    }
}

function renderXP() { // Renders the XP bar
    xpEl.textContent = `Current Level: ${player.level} - Current XP: ${player.xp} - To Next Level: ${player.level * 50}`;
}

function renderActions() { // Renders the action buttons
    if (!inCombat) {
        // when not in combat, show the find encounter button and hide the ability buttons 
        abilityBtns.forEach(function(element){
            element.classList.add('hidden');
        });
        encounterBtn.classList.remove('hidden');
    } else {
        // when in combat, hide the find encounter button and show the ability buttons 
        abilityBtns.forEach(function(element){
            element.classList.remove('hidden');
        });
        encounterBtn.classList.add('hidden');
    }
}

function renderEncounter() { // Renders enemy stats
    // If the encounter isn't an enemy, hide the other stats. Otherwise, display all stats
    if (encounter.type !== 'enemy'){
        typeEl.textContent = `${encounter.type}`;
        enemyHpEl.textContent = '';
        enemyAtkEl.textContent = '';
        enemyDefEl.textContent = '';
    } else {
        typeEl.textContent = `Name: ${encounter.name}`;
        enemyHpEl.textContent = `Health: ${encounter.hp}/${encounter.maxHP}`;
        enemyAtkEl.textContent = `Attack: ${encounter.atk}`;
        enemyDefEl.textContent = `Defense: ${encounter.def}`
    }
}

function levelUp(){ // If the player has enough XP to level up, increase their stats and reset xp to 0
    //TODO
}