class Character {
    constructor(name, charIMG, hp = 50, level = 0, dmgMultiplier = 1, roll = null) {
        this.name = name;
        this.charIMG = charIMG;
        this.hp = hp;
        this.level = level;
        this.dmgMultiplier = dmgMultiplier;
        this.roll = roll;
    }

    levelUp = () => {
        this.level++;
    }

    takeDamage = damage => {
        this.hp -= damage;
    }

    setDmgBonus = mod => {
        this.dmgBonus = mod;
    }
}

export default Character;