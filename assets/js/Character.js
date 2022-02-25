class Character {
    constructor(name, charIMG, hp = 20, level = 0, dmgMultiplier = 1, roll = null) {
        this.name = name;
        this.charIMG = charIMG;
        this.hp = hp;
        this.level = level;
        this.dmgMultiplier = dmgMultiplier;
        this.roll = roll;
    }
}

export default Character;