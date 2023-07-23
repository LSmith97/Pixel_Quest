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

        this.abilities = [
            {name: 'Slash',
            target: encounter,
            damage: 5,
            cost: 5},

            {name: 'Fireball',
            target: encounter,
            damage: 10,
            cost: -5},

            {name: 'Spirit Bomb',
            target: encounter,
            damage: 15,
            cost: -10},
        ];
    }

    fight(evt){
        let idx = evt.target.id;
        let target = this.abilities[idx]['target'];
        let damage = this.abilities[idx]['damage'];
        let cost = this.abilities[idx]['cost'];

        target.hp -= damage;
        this.mana += cost;

        if(encounter.hp > 0){
            encounter.fight();
        } else {
            message = `You defeated the ${target.name}!`
            inCombat = false;
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
        this.maxHP = 15;
        this.hp = 15;

        this.xp = 25;
        this.gold = 25;

        this.abilities = [
            {name: 'Gobsmack',
            damage: 5},

            {name: 'Poison Arrow',
            damage: 10},
        ];
    }
}

  /*----- state variables -----*/

let player;
let encounter;
let message;
let inCombat;


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

// buttons
const abilityBtns =  document.querySelectorAll('.ability-button');
const encounterBtn = document.querySelector("#encounter-button");

  /*----- event listeners -----*/

function findEncounter() {
    console.log('Finding Encounter');
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
    typeEl.textContent = `Type: ${encounter.type}`
    if (encounter.type !== 'enemy') {
        //only display encounter type
    }
}

