import playerImages from '../data/playerImages.js';
import opponentImages from '../data/opponentImages.js';
import Character from '../js/Character.js';

let g_MessageTimeOut;

window.addEventListener('DOMContentLoaded', () => {
	addButtonListeners();
	hideSections();
	addMessageCloseListener();
});

function hideSections() {
	const sections = [...document.querySelectorAll('section')];

	sections.forEach(section => {
		if (section.id === 'messageBox' || section.id === 'mainMenu') return;
		section.style.display = 'none';
	});
}

function addButtonListeners() {
	const buttons = [...document.querySelectorAll('button')];
	buttons.forEach(button => button.addEventListener('click', buttonHandler));
}

function addMessageCloseListener() {
	const messageClose = document.getElementById('messageClose');
	messageClose.addEventListener('click', closeMessage);
}

function buttonHandler(e) {
	const sections = [...document.querySelectorAll('section')];

	if (e.currentTarget.classList.contains('menuButton')) {
		e.currentTarget.parentElement.style.display = 'none';
		sections.filter(section => section.id === 'mainMenu')[0].style.display = 'flex';
		return;
	}

	switch (e.currentTarget.id) {
		case 'playButton':
			checkUserData(e, sections);
			break;

		case 'startGame':
			validateInput(e, sections);
			break;

		case 'settingsButton':
			windowHandler(e, 'settingsMenu', sections);
			break;

		case 'howToPlayButton':
			windowHandler(e, 'howToPlayMenu', sections);
			break;

		case 'gameMenuButton':
			windowHandler(e, 'mainMenu', sections);
			break;

		case 'resetButton':
			clearStorage();
			break;

		case 'playerRollButton':
			startRound();
			break;

		default:
			messageHandler(`${e.currentTarget.id} button not handled`, 'error');
	}
}

function messageHandler(message, type) {
	window.clearTimeout(g_MessageTimeOut);
	messageBox.classList.add(type);
	messageBox.style.transform = 'translateY(0px)';
	messageBox.firstElementChild.textContent = message;
	g_MessageTimeOut = setTimeout(() => {
		clearStyles(type);
	}, 7000);
}

function closeMessage() {
	window.clearTimeout(g_MessageTimeOut);
	const type = messageBox.classList[0];
	clearStyles(type);
}

function clearStyles(type) {
	messageBox.style.removeProperty('transform');
	setTimeout(() => {
		messageBox.classList.remove(type);
		messageBox.firstElementChild.textContent = '';
	}, 500);
}

function windowHandler(e, sectionID, sections) {
	if (e.target.id === 'gameMenuButton') {
		e.currentTarget.parentElement.parentElement.style.display = 'none';
	} else {
		e.currentTarget.parentElement.style.display = 'none';
	}
	sections.filter(section => section.id === sectionID)[0].style.display = 'flex';
}

function clearStorage() {
	const message =
		'Are you sure you want to clear your local storage, you will lose all game progress.';
	if (confirm(message)) {
		localStorage.clear();
		messageHandler('Game data cleared.', 'success');
	} else {
		messageHandler('Game data not cleared.', 'warn');
	}
}

function checkUserData(e, sections) {
	if (localStorage.length === 0) {
		getPlayerImages();
		windowHandler(e, 'userData', sections);
	} else startGame(e, null, null, sections);
}

function getPlayerImages() {
	const charSelection = document.getElementById('characterSelection');
	charSelection.innerHTML = '';

	for (let i = 0; i < playerImages.length; i++) {
		createImgElement(playerImages[i]);
	}
	addCharEventListeners();
}

function addCharEventListeners() {
	const characters = document.querySelectorAll('.character');

	characters.forEach(character => {
		character.addEventListener('click', characterSelection);
	});
}

function characterSelection() {
	const characters = document.querySelectorAll('.character');

	if (this.classList.contains('selected')) {
		this.classList.remove('selected');
		return;
	}

	characters.forEach(character => {
		character.classList.remove('selected');
	});

	this.classList.add('selected');
}

function createImgElement(image) {
	const charSelection = document.getElementById('characterSelection');
	const imageElem = document.createElement('img');
	const src = `assets/img/players/${image.fileName}`;

	imageElem.src = src;
	imageElem.classList.add('character');
	imageElem.id = image.fileName.replace('.webp', '');
	charSelection.append(imageElem);
}

function validateInput(e, sections) {
	const formInput = document.getElementById('username');
	const characters = [...document.querySelectorAll('.character')];
	const selectedCharacter = characters.filter(char =>
		char.classList.contains('selected')
	)[0];
	const username = formInput.value.trim();
	const myRegex = /^[A-Za-z ]+$/g;

	if (username.length === 0) {
		messageHandler('Please enter your name!', 'warn');
		formInput.value = username;
		return;
	}

	if (username.length > 12) {
		messageHandler('Your name is too long, Maximum of 12 Characters!', 'warn');
		formInput.value = username;
		return;
	}

	if (username.length < 3) {
		messageHandler('Your name is too short, Minimum of 3 Characters!', 'warn');
		formInput.value = username;
		return;
	}

	if (!username.match(myRegex)) {
		messageHandler('Your name must only contain upper or lower case letters!', 'warn');
		formInput.value = username;
		return;
	}

	if (!selectedCharacter) {
		messageHandler('Please select your character!', 'warn');
		return;
	}

	startGame(e, username, selectedCharacter.id, sections);
	formInput.value = '';
}

function startGame(e, username, character, sections) {
	let playerData = loadPlayerData();
	if (!playerData) {
		const charIMG = `assets/img/players/${character}.webp`;
		const player = new Character(username, charIMG);
		savePlayerData(player);
		playerData = loadPlayerData();
	}

	loadOpponentData();
	setPlayerElements(playerData);

	windowHandler(e, 'gameWindow', sections);
}

function savePlayerData(player) {
	localStorage.setItem('name', player.name);
	localStorage.setItem('charIMG', player.charIMG);
	localStorage.setItem('level', player.level);
	localStorage.setItem('hp', player.hp);
	localStorage.setItem('dmgMultiplier', player.dmgMultiplier);
}

function loadPlayerData() {
	if (localStorage.length != 0) {
		const name = localStorage.getItem('name');
		const charIMG = localStorage.getItem('charIMG');
		const hp = localStorage.getItem('hp');
		const level = localStorage.getItem('level');
		const dmgMultiplier = localStorage.getItem('dmgMultiplier');

		return new Character(name, charIMG, hp, level, dmgMultiplier);
	} else return null;
}

function loadOpponentData() {
	const playerLevel = localStorage.getItem('level') || 0;

	if (playerLevel > opponentImages.length) {
		const randomOpponent = Math.floor(Math.random() * opponentImages.length);
		createOpponent(opponentImages[randomOpponent]);
	} else {
		createOpponent(opponentImages[playerLevel]);
	}
}

function setPlayerElements(data) {
	document.getElementById('playerName').textContent = data.name;
	document.getElementById('playerRoll').textContent = data.roll;
	document.getElementById('playerHealth').textContent = data.hp;
	document.getElementById('playerImg').src = data.charIMG;
}

function createOpponent(opponent) {
	const oppName = opponent.name;
	const charIMG = `assets/img/bosses/${opponent.fileName}`;
	const boss = new Character(oppName, charIMG);
	setBossElements(boss);
}

function setBossElements(data) {
	document.getElementById('opponentName').textContent = data.name;
	document.getElementById('opponentRoll').textContent = data.roll;
	document.getElementById('opponentHealth').textContent = data.hp;
	document.getElementById('opponentImg').src = data.charIMG;
}

async function startRound() {
	document.getElementById('playerRollButton').disabled = true;
	document.getElementById('playerRoll').innerHTML = '';
	document.getElementById('opponentRoll').innerHTML = '';
	playerRollButton;
	createDice('player');
}

function createDice(diceId) {
	const diceArea = document.getElementById('diceArea');
	const dice = document.createElement('div');

	for (let i = 1; i <= 6; i++) {
		const diceFace = document.createElement('div');
		diceFace.classList.add(`dice-face`);
		diceFace.classList.add(`dice-face-${i}`);
		diceFace.innerText = `${i}`;
		dice.append(diceFace);
	}

	dice.id = `${diceId}Dice`;
	diceArea.append(dice);
	rollDice(dice);
}

function rollDice(dice) {
	const playerRollElement = document.getElementById('playerRoll');
	const opponentRollElement = document.getElementById('opponentRoll');
	const diceScale = 2;
	const rollModifier = 8;
	const diceRoll = Math.floor(Math.random() * 6) + 1;
	setTimeout(() => {
		dice.style.transform = `
		rotateX(${Math.floor(Math.random() * 360) * rollModifier}deg) 
		rotateY(${Math.floor(Math.random() * 360) * rollModifier}deg) 
		rotateZ(${Math.floor(Math.random() * 360) * rollModifier}deg) 
		scaleX(${diceScale})
		scaleY(${diceScale})
		scaleZ(${diceScale})
		`;
	}, 500);
	setTimeout(() => {
		switch (diceRoll) {
			case 1:
				dice.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
				break;
			case 2:
				dice.style.transform = `rotateX(180deg) rotateY(270deg) rotateZ(0deg)`;
				break;
			case 3:
				dice.style.transform = `rotateX(90deg) rotateY(0deg) rotateZ(0deg)`;
				break;
			case 4:
				dice.style.transform = `rotateX(270deg) rotateY(0deg) rotateZ(0deg)`;
				break;
			case 5:
				dice.style.transform = `rotateX(0deg) rotateY(270deg) rotateZ(0deg)`;
				break;
			case 6:
				dice.style.transform = `rotateX(180deg) rotateY(0deg) rotateZ(0deg)`;
				break;
		}
		dice.style.transform += ` scaleX(1) scaleY(1) scaleZ(1)`;
	}, 1000);

	setTimeout(() => {
		if (dice.id === 'playerDice') {
			localStorage.setItem('roll', diceRoll);
			const playerRollImage = new Image();
			playerRollImage.src = `assets/img/dice/${diceRoll}_dots_small.webp`;
			playerRollElement.append(playerRollImage);
			dice.remove();
			createDice('opponent');
		}

		if (dice.id === 'opponentDice') {
			const opponentRollImage = new Image();
			opponentRollImage.src = `assets/img/dice/${diceRoll}_dots_small.webp`;
			opponentRollElement.append(opponentRollImage);
			dice.remove();
			document.getElementById('playerRollButton').disabled = false;
			showResult(diceRoll);
		}
	}, 4000);
}

function showResult(opponentRoll) {
	const playerRoll = Number(localStorage.getItem('roll'));
	if (playerRoll > opponentRoll) {
		console.log({ PlayerRolled: playerRoll });
		console.log({ PlayerRolled: opponentRoll });
		console.log('Player Wins');
	} else if (playerRoll < opponentRoll) {
		console.log({ PlayerRolled: playerRoll });
		console.log({ PlayerRolled: opponentRoll });
		console.log('Opponent Wins');
	} else {
		console.log({ PlayerRolled: playerRoll });
		console.log({ PlayerRolled: opponentRoll });
		console.log("It's a Tie!");
	}
}

window.addEventListener('storage', e => {
	localStorage.setItem(e.key, e.oldValue);
});
