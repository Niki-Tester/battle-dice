// Character class used for both opponent, and player characters
class Character {
	constructor(name, charIMG, hp = 10, level = 0, roll = null) {
		this.name = name;
		this.charIMG = charIMG;
		this.hp = hp;
		this.level = level;
		this.roll = roll;
	}
}

export default Character;
