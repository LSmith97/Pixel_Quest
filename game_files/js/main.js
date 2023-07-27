/*----- constants -----*/

class Hero {
  constructor() {
    this.level = 1;
    this.xp = 0;

    this.atk = 5;
    this.def = 5;
    this.maxHP = 25;
    this.hp = this.maxHP;
    this.maxMana = 10;
    this.mana = this.maxMana;

    this.gold = 0;
    this.score = 0;
    this.potions = 1;
  }

  abilities = [
    { name: "Slash", target: "enemy", damage: 5, cost: 0 },

    { name: "Fireball", target: "enemy", damage: 10, cost: 5 },

    { name: "Spirit Bomb", target: "enemy", damage: 15, cost: 10 },
  ];

  fight(evt) {
    // Lowers enemy stats and player mana depending on ability used
    let idx = evt.target.id;
    let damage = player.abilities[idx]["damage"];
    let cost = player.abilities[idx]["cost"];
    let name = player.abilities[idx]["name"];

    // Play click sound
    clickAudio.play();
    // If the mana cost is greater than current mana, display a message and return
    if (cost > player.mana) {
      message = "You don't have enough mana to use that!";
      render();
      return;
    }

    if (player.abilities[idx]["target"] === "enemy") {
      // If the target property of the ability is 'enemy' decrease encounter hp
      damage = damage + player.atk - encounter.def;
      if (damage < 1) damage = 1;
      encounter.hp -= damage;
    } else if (player.abilities[idx]["target"] === "self") {
      // If the target property of the ability is 'self' increase player hp
      player.hp += damage;
    }
    // Decrease mana by the ability cost
    player.mana -= cost;
    // Change message
    message = `You used ${name}. ${encounter.name} took ${damage} damage!`;
    // Play attack animation
    renderAttack(heroImgEl);
    if (encounter.hp > 0) {
      // If the enemy isn't defeated, they fight back
      encounter.fight();
    } else {
      // If the enemy is defeated:
      // Display victory message
      message += ` You defeated the ${encounter.name}!`;
      // Increase player gold, xp, and score
      player.gold += encounter.gold;
      player.xp += encounter.xp;
      player.score++;
      // check for level up
      levelUp();
      // Set inCombat to false
      inCombat = false;
      //Render
      render();
    }
  }

  usePotion() {
    // Handles when the player clicks the use potion button
    // Play click sound
    clickAudio.play();
    // If the player has no potions, display a message and return
    if (player.potions <= 0) {
      message = "You don't have any potions.";
      render();
      return;
    }
    // If the player already has full HP, display a message
    if (player.hp === player.maxHP) {
      message = "Your HP is already full.";
      render();
      return;
    }
    // Increment the player's HP, up to the maximum
    player.hp += 10;
    if (player.hp > player.maxHP) player.hp = player.maxHP;
    // Decrement the number of potions
    player.potions--;
    // Display a message
    message = `You used a Potion! Your Hp is increased by 10!`;
    render();
  }
}

class Enemy {
  constructor() {
    let randomRoll = player.level + Math.floor(Math.random() * 5);
    let listIdx;
    switch (true) {
      case randomRoll <= 5:
        listIdx = 0;
        break;
      case randomRoll > 5 && randomRoll <= 8:
        listIdx = 1;
        break;
      case randomRoll > 8:
        listIdx = 2;
        break;
    }
    this.type = "enemy";
    this.name = Enemy.enemyList[listIdx][0];

    this.atk = Enemy.enemyList[listIdx][1];
    this.def = Enemy.enemyList[listIdx][2];
    this.maxHP = Enemy.enemyList[listIdx][3];
    this.hp = this.maxHP;

    this.xp = Enemy.enemyList[listIdx][4];
    this.gold = Enemy.enemyList[listIdx][5];

    this.img = Enemy.enemyList[listIdx][6];

    this.abilities = Enemy.enemyList[listIdx][7];
  }
  static enemyList = [
    [
      "Goblin",
      5,
      5,
      15,
      25,
      25,
      "game_files/images/goblin.png",
      [
        { name: "Gobsmack", damage: 5 },

        { name: "Poison Arrow", damage: 10 },
      ],
    ],
    [
      "Skeleton",
      7,
      7,
      25,
      50,
      50,
      "game_files/images/skeleton.png",
      [
        { name: "Shamble Strike", damage: 10 },

        { name: "Bone Breaker", damage: 15 },
      ],
    ],
    [
      "Lich",
      15,
      15,
      40,
      100,
      100,
      "game_files/images/lich.png",
      [
        { name: "Spooky Blast", damage: 15 },

        { name: "Evil Beam", damage: 25 },
      ],
    ],
  ];

  fight() {
    // Uses a random ability and decreases player hp accordingly
    // Play attack animation
    renderAttack(encounterImgEl);
    // Chose a random ability to fight with
    let idx = Math.floor(Math.random() * encounter.abilities.length);
    let damage =
      encounter.abilities[idx]["damage"] - player.def + encounter.atk;
    if (damage < 1) damage = 1;
    let name = encounter.abilities[idx]["name"];
    //Lower HP and display a message based on the attack used
    player.hp -= damage;
    message += ` ${encounter.name} used ${name}. You took ${damage} damage!`;
    // Check for a game over
    gameOver();
    // Render
    render();
  }
}

class Encounter {
  constructor() {
    // Generate a random number 0-100
    const encounterRoll = Math.floor(Math.random() * 100);
    // Create the encounter based on the number rolled
    switch (true) {
      case encounterRoll < 50:
        this.type = "enemy";
        break;
      case encounterRoll >= 50 && encounterRoll < 65:
        this.type = "Inn";
        this.message =
          "You find a place to rest and recover. Your mana was refreshed";
        this.img = "game_files/images/inn.png";
        this.effect = function () {
          player.mana = player.maxMana;
        };
        break;
      case encounterRoll >= 65 && encounterRoll < 75:
        this.type = "Pitfall";
        this.message = "You fell into a trap! You took 5 damage!";
        this.img = "game_files/images/pitfall.png";
        this.effect = function () {
          player.hp -= 5;
        };
        break;
      case encounterRoll >= 75 && encounterRoll < 95:
        this.type = "Teasure";
        this.message = "You found a chest with some treasure in it. Gold +5!";
        this.img = "game_files/images/chest.png";
        this.effect = function () {
          player.gold += 5;
        };
        break;
      case encounterRoll > 95:
        this.type = "Rare Weapon";
        this.message =
          "You found a rare and powerful weapon in a chest. Your attack was increased";
        this.img = "game_files/images/chest.png";
        this.effect = function () {
          player.atk += 2;
        };
        break;
    }
  }
}

const XP_PER_LEVEL = 50;
const MAX_STAT_PER_LEVEL = 3;

const gameOverAudio = new Audio(
  "game_files/audio/mixkit-arcade-retro-game-over-213.wav"
);
const clickAudio = new Audio(
  "game_files/audio/mixkit-interface-device-click-2577.wav"
);
const levelUpAudio = new Audio(
  "game_files/audio/mixkit-game-flute-bonus-2313.wav"
);

/*----- state variables -----*/

let player; // The player object
let encounter; // The current encounter object

let message; // The message that displays onscreen to the player

let inCombat; // Boolean, changes displayed elements based on whether the player is in a fight currently
let isGameOver; // Boolean, changes displayed elements if the player loses

/*----- cached elements  -----*/

// field elements
const scoreEl = document.querySelector("#score h3");
const messageEl = document.querySelector("#message h3");
const encounterImgEl = document.querySelector("#encounter-container");
const heroImgEl = document.querySelector("#hero-container");

// player stat elements
const hpEl = document.querySelector("#hp");
const manaEl = document.querySelector("#mana");
const atkEl = document.querySelector("#attack");
const defEl = document.querySelector("#defense");
const goldEl = document.querySelector("#gold");

// XP bar elements
const xpValueEl = document.querySelector("#xp-bar .value");
const xpTextEl = document.querySelector("#xp-bar-text");

// encounter stat elements
const typeEl = document.querySelector("#type");
const enemyHpEl = document.querySelector("#enemy-hp");
const enemyAtkEl = document.querySelector("#enemy-atk");
const enemyDefEl = document.querySelector("#enemy-def");

// button elements
const abilityBtns = document.querySelectorAll(".ability-button");
const encounterBtn = document.querySelector("#encounter-button");
const resetBtn = document.querySelector("#reset-button");
const purchaseBtn = document.querySelector(".purchase-button");
const restBtn = document.querySelector(".rest-button");
const potionBtn = document.querySelector("#potion-button");

/*----- event listeners -----*/

function findEncounter() {
  // Gets a new encounter instance
  // play click sound
  clickAudio.play();
  // Create a new encounter instance
  encounter = new Encounter();
  // If that encounter is an enemy, create a new Enemy instance and enter combat
  if (encounter.type === "enemy") {
    inCombat = true;
    encounter = new Enemy();
    message = `You're stopped by a ${encounter.name}!`;
  } else {
    // Otherwise, display a message and do an effect based on the current encounter
    message = encounter.message;
    encounter.effect();
    // Check for a game over (some events reduce player HP)
    gameOver();
  }
  //Render
  render();
}

function rest() {
  // play click sound
  clickAudio.play();
  // Display a message if player doesn't have enough gold
  if (player.gold < 25) {
    message = "You Don't have enough gold to rest here";
    render();
    return;
  }
  message = "You rest at the Inn. Your HP is refreshed!";
  player.hp = player.maxHP;
  player.gold -= 25;
  render();
}

function buy() {
  // play click sound
  clickAudio.play();
  // Display a message if player doesn't have enough gold
  if (player.gold < 50) {
    message = "You Don't have enough gold to buy that";
    render();
    return;
  }
  player.gold -= 50;
  player.potions++;
  message = `You bought a potion! You now have ${player.potions}`;
  render();
}

/*----- functions -----*/

init();

function init() {
  //Initializes the starting game state
  // Create a new Hero
  player = new Hero();

  // Initialize the game state
  message = "You begin your adventure!";
  inCombat = false;
  isGameOver = false;
  encounter = { type: "none" };
  clickAudio.playbackRate = 2;

  // add event listeners to buttons
  abilityBtns.forEach(function (element) {
    element.addEventListener("click", player.fight);
  });

  encounterBtn.addEventListener("click", findEncounter);

  resetBtn.addEventListener(`click`, init);

  restBtn.addEventListener("click", rest);

  purchaseBtn.addEventListener("click", buy);

  potionBtn.addEventListener("click", player.usePotion);

  // Render state to the page
  render();
}

// Render Functions:
function render() {
  // Renders HTML elements
  renderStats();
  renderField();
  renderXP();
  renderActions();
  renderEncounter();
}

function renderStats() {
  // Renders the player's stats
  hpEl.textContent = `Health: ${player.hp}/${player.maxHP}`;
  manaEl.textContent = `Mana: ${player.mana}/${player.maxMana}`;
  atkEl.textContent = `Attack: ${player.atk}`;
  defEl.textContent = `Defense: ${player.def}`;
  goldEl.textContent = `Gold: ${player.gold}`;
}

function renderField() {
  // Renders the field, including score and message
  //render message and score
  messageEl.textContent = message;
  scoreEl.textContent = `Score: ${player.score}`;

  // If there is no current encounter, hide the encounter image
  if (encounter.type === "none") {
    encounterImgEl.classList.add("hidden");
  } else {
    encounterImgEl.classList.remove("hidden");
  }
  // Render Encounter image
  encounterImgEl.innerHTML = `<img src="${encounter.img}">`;
  // Render Hero image
  heroImgEl.innerHTML = `<img src="game_files/images/character.png" alt="player">`;
  if (isGameOver) {
    heroImgEl.classList.add("defeat");
  } else {
    heroImgEl.classList.remove("defeat");
  }
}

function renderXP() {
  // Renders the XP bar
  // Set the text bar's content
  xpTextEl.textContent = `Current Level: ${player.level} - Current XP: ${
    player.xp
  } - To Next Level: ${player.level * XP_PER_LEVEL}`;

  // Make the value bar's size a % of the main bar's size based on current and max xp values
  xpValueEl.style.width = `${
    (player.xp / (player.level * XP_PER_LEVEL)) * 100
  }%`;
}

function renderActions() {
  // Renders the action buttons
  if (!isGameOver) {
    //If the game isn't over, hide the reset button
    resetBtn.classList.add("hidden");
    // Display the potion button
    potionBtn.textContent = `Use a Potion: +10 hp. You have: ${player.potions}`;
    potionBtn.classList.remove("hidden");
    if (!inCombat) {
      // when not in combat, show the find encounter button and hide the ability buttons
      abilityBtns.forEach(function (element) {
        element.classList.add("hidden");
      });
      encounterBtn.classList.remove("hidden");
    } else {
      // when in combat, hide the find encounter button and show the ability buttons
      abilityBtns.forEach(function (element) {
        element.classList.remove("hidden");
        // Display the corresponding ability's text
        let idx = element.id;
        element.textContent = `${player.abilities[idx].name}: ${player.abilities[idx].damage} damage, ${player.abilities[idx].cost} mana`;
      });
      encounterBtn.classList.add("hidden");
    }
  } else {
    // When the game is over, show the reset button and hide all other buttons
    abilityBtns.forEach(function (element) {
      element.classList.add("hidden");
    });
    encounterBtn.classList.add("hidden");
    potionBtn.classList.add("hidden");
    resetBtn.classList.remove("hidden");
  }
}

function renderEncounter() {
  // Renders enemy stats
  // If the encounter isn't an enemy, hide the other stats. Otherwise, display all stats
  if (encounter.type !== "enemy") {
    typeEl.textContent = `${encounter.type}`;
    enemyHpEl.classList.add("hidden");
    enemyAtkEl.classList.add("hidden");
    enemyDefEl.classList.add("hidden");
    typeEl.textContent = "";
    enemyHpEl.textContent = "";
    enemyAtkEl.textContent = "";
    enemyDefEl.textContent = "";
  } else {
    // unhide stats
    enemyHpEl.classList.remove("hidden");
    enemyAtkEl.classList.remove("hidden");
    enemyDefEl.classList.remove("hidden");
    // Update contents
    typeEl.textContent = `Name: ${encounter.name}`;
    enemyHpEl.textContent = `Health: ${encounter.hp}/${encounter.maxHP}`;
    enemyAtkEl.textContent = `Attack: ${encounter.atk}`;
    enemyDefEl.textContent = `Defense: ${encounter.def}`;
  }
  // If the encounter is an Inn, show the purchase buttons. Otherwise, hide them.
  if (encounter.type === "Inn") {
    purchaseBtn.classList.remove("hidden");
    restBtn.classList.remove("hidden");
  } else {
    purchaseBtn.classList.add("hidden");
    restBtn.classList.add("hidden");
  }
}

function renderAttack(element) {
  // Handles attack animations
  // Stop any ongoing animations
  element.classList.remove("attack");
  // Play attack animation
  element.classList.add("attack");
  // After a delay, remove the animation
  setTimeout(function () {
    element.classList.remove("attack");
  }, 1100);
}

// Game state functions:
function levelUp() {
  // If the player has enough XP to level up, increase their stats and reset xp to 0
  if (player.xp >= player.level * XP_PER_LEVEL) {
    // play level up sound
    levelUpAudio.play();
    //reset xp and increase level
    player.xp = 0;
    player.level++;
    // Add a level up message
    message += " You leveled Up!";
    // Increase player's stats and refresh hp/mana
    player.maxHP += 5;
    player.maxMana += 5;
    player.hp = player.maxHP;
    player.mana = player.maxMana;
    player.atk += Math.floor(Math.random() * MAX_STAT_PER_LEVEL) + 1;
    player.def += Math.floor(Math.random() * MAX_STAT_PER_LEVEL) + 1;
  }
}

function gameOver() {
  // Determines if the player has been defeated
  if (player.hp <= 0) {
    message += " You died!";
    isGameOver = true;
    gameOverAudio.play();
  }
}
