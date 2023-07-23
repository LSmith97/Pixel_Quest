  /*----- constants -----*/
  class Hero {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.atk = 5;
        this.def = 5
        this.maxHP = 20;
        this.maxMana = 10;
        this.gold = 0;

        this.abilities = [
            {name: 'Slash',
            damage: 5,
            cost: 5},

            {name: 'Fireball',
            damage: 10,
            cost: -5},

            {name: 'Spirit Bomb',
             damage: 15,
            cost: -10},
        ]
    }
  }

  class Enemy {
    constructor() {
        this.name = 'Goblin';
        this.atk = 5;
        this.def = 5
        this.maxHP = 10;

        this.abilities = [
            {name: 'Gobsmack',
            damage: 5},

            {name: 'Poison Arrow',
            damage: 10},

        ]
    }
  }

  /*----- state variables -----*/


  /*----- cached elements  -----*/


  /*----- event listeners -----*/


  /*----- functions -----*/

