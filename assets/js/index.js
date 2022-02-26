import playerImages from '../data/playerImages.js';
import opponentImages from '../data/opponentImages.js';
import Character from '../js/Character.js';

let g_MessageTimeOut;

const music = new Audio('assets/audio/menuTheme.mp3');

window.addEventListener('DOMContentLoaded', () => {
	addButtonListeners();
	hideSections();
	addMessageCloseListener();
	settingsController();

	const form = document.getElementsByTagName('form')[0];
	form.addEventListener('submit', e => {
		e.preventDefault();
		messageHandler(
			'Please use the "Start" button to submit your name & selection.',
			'warn'
		);
	});
});

const hideSections = () => {
	const sections = [...document.querySelectorAll('section')];

	sections.forEach(section => {
		if (section.id === 'messageBox' || section.id === 'mainMenu') return;
		section.style.display = 'none';
	});
};

const addButtonListeners = () => {
	const buttons = [...document.querySelectorAll('button')];
	buttons.forEach(button => button.addEventListener('click', buttonHandler));
};

const addMessageCloseListener = () => {
	const messageClose = document.getElementById('messageClose');
	messageClose.addEventListener('click', closeMessage);
};

const buttonHandler = e => {
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
			clearGameElements();
			break;

		case 'resetButton':
			clearStorage();
			break;

		case 'playerRollButton':
			break;

		case 'soundControl':
			musicToggle();
			break;

		default:
			messageHandler(`${e.currentTarget.id} button not handled`, 'error');
	}
};

const messageHandler = (message, type) => {
	window.clearTimeout(g_MessageTimeOut);
	messageBox.classList.add(type);
	messageBox.style.transform = 'translateY(0px)';
	messageBox.firstElementChild.textContent = message;
	g_MessageTimeOut = setTimeout(() => {
		clearStyles(type);
	}, 7000);
};

const closeMessage = () => {
	window.clearTimeout(g_MessageTimeOut);
	const type = messageBox.classList[0];
	clearStyles(type);
};

const clearStyles = type => {
	messageBox.style.removeProperty('transform');
	setTimeout(() => {
		messageBox.classList.remove(type);
		messageBox.firstElementChild.textContent = '';
	}, 500);
};

const windowHandler = (e, sectionID, sections) => {
	if (e.target.id === 'gameMenuButton') {
		e.currentTarget.parentElement.parentElement.style.display = 'none';
	} else {
		e.currentTarget.parentElement.style.display = 'none';
	}
	sections.filter(section => section.id === sectionID)[0].style.display = 'flex';
};

const clearStorage = () => {
	const message =
		'Are you sure you want to clear your local storage, you will lose all game progress.';
	if (confirm(message)) {
		localStorage.clear();
		messageHandler('Game data cleared.', 'success');
	} else {
		messageHandler('Game data not cleared.', 'warn');
	}
};

const checkUserData = (e, sections) => {
	if (localStorage.length === 0) {
		getPlayerImages();
		windowHandler(e, 'userData', sections);
	} else startGame(e, null, null, sections);
};

const getPlayerImages = () => {
	const charSelection = document.getElementById('characterSelection');
	charSelection.innerHTML = '';

	for (let i = 0; i < playerImages.length; i++) {
		createImgElement(playerImages[i]);
	}
	addCharEventListeners();
};

const addCharEventListeners = () => {
	const characters = document.querySelectorAll('.character');

	characters.forEach(character => {
		character.addEventListener('click', characterSelection);
	});
};

const characterSelection = e => {
	const characters = document.querySelectorAll('.character');
	if (e.target.classList.contains('selected')) {
		e.target.classList.remove('selected');
		return;
	}

	characters.forEach(character => {
		character.classList.remove('selected');
	});

	e.target.classList.add('selected');
};

const createImgElement = image => {
	const charSelection = document.getElementById('characterSelection');
	const imageElem = document.createElement('img');
	const src = `assets/img/players/${image.fileName}`;

	imageElem.src = src;
	imageElem.classList.add('character');
	imageElem.id = image.fileName.replace('.webp', '');
	charSelection.append(imageElem);
};

const validateInput = (e, sections) => {
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
};

const startGame = (e, username, character, sections) => {
	let playerData = loadPlayerData();
	if (!playerData) {
		const charIMG = `assets/img/players/${character}.webp`;
		const player = new Character(username, charIMG);
		savePlayerData(player);
		playerData = loadPlayerData();
	}

	loadOpponentData();
	setPlayerElements();

	windowHandler(e, 'gameWindow', sections);
};

const savePlayerData = player => {
	localStorage.setItem('player', JSON.stringify(player));
};

const loadPlayerData = () => {
	if (!localStorageKeys().includes('player')) {
		const { name, charIMG, hp, level, dmgMultiplier } = JSON.parse(
			localStorage.getItem('player')
		);
		return new Character(name, charIMG, hp, level, dmgMultiplier);
	} else return null;
};

const saveOpponentData = opponent => {
	localStorage.setItem('opponent', JSON.stringify(opponent));
};

const loadOpponentData = () => {
	if (!localStorageKeys().includes('opponent')) {
		setOpponentElements();
		return;
	}
	const playerLevel = JSON.parse(localStorage.getItem('player')).level || 0;

	if (playerLevel >= opponentImages.length) {
		const randomOpponent = Math.floor(Math.random() * opponentImages.length);
		createOpponent(opponentImages[randomOpponent]);
	} else {
		createOpponent(opponentImages[playerLevel]);
	}
};

const setPlayerElements = () => {
	const { name, hp, charIMG } = JSON.parse(localStorage.getItem('player'));
	document.getElementById('playerName').textContent = name;
	document.getElementById('playerHealth').textContent = hp;
	document.getElementById('playerImg').src = charIMG;
};

const createOpponent = opponent => {
	const name = opponent.name;
	const charIMG = `assets/img/bosses/${opponent.fileName}`;
	const currentOpponent = new Character(name, charIMG);
	localStorage.setItem('opponent', JSON.stringify(currentOpponent));
	setOpponentElements();
};

const setOpponentElements = () => {
	const { name, hp, charIMG } = JSON.parse(localStorage.getItem('opponent'));
	document.getElementById('opponentName').textContent = name;
	document.getElementById('opponentHealth').textContent = hp;
	document.getElementById('opponentImg').src = charIMG;
};

const startRound = () => {
	document.getElementById('playerRollButton').disabled = true;
	document.getElementById('playerRoll').innerHTML = '';
	document.getElementById('opponentRoll').innerHTML = '';
	playerRollButton;
	createDice('player');
};

const createDice = diceId => {
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
};

const rollDice = dice => {
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
			const player = JSON.parse(localStorage.getItem('player'));
			player.roll = diceRoll;
			savePlayerData(player);
			const playerRollImage = new Image();
			playerRollImage.src = `assets/img/dice/${diceRoll}_dots_small.webp`;
			playerRollElement.append(playerRollImage);
			dice.remove();
			createDice('opponent');
		}

		if (dice.id === 'opponentDice') {
			const opponent = JSON.parse(localStorage.getItem('opponent'));
			opponent.roll = diceRoll;
			saveOpponentData(opponent);
			const opponentRollImage = new Image();
			opponentRollImage.src = `assets/img/dice/${diceRoll}_dots_small.webp`;
			opponentRollElement.append(opponentRollImage);
			dice.remove();
			document.getElementById('playerRollButton').disabled = false;
			compareRolls();
		}
	}, 4000);
};

const compareRolls = () => {
	const player = JSON.parse(localStorage.getItem('player'));
	const opponent = JSON.parse(localStorage.getItem('opponent'));
	const damage = Math.abs(player.roll - opponent.roll);

	if (player.roll > opponent.roll) opponent.hp -= damage;
	if (player.roll < opponent.roll) player.hp -= damage;

	savePlayerData(player);
	setPlayerElements();
	saveOpponentData(opponent);
	setOpponentElements();
	checkGameEnd(player, opponent);
};

const checkGameEnd = (player, opponent) => {
	if (player.hp <= 0) {
		console.log('YOU LOSE- GAME OVER');
		localStorage.removeItem('player');
		localStorage.removeItem('opponent');
		endScreen();
	}
	if (opponent.hp <= 0) {
		console.log('YOU WIN - NEXT ROUND');
		localStorage.removeItem('opponent');
		console.log(`LEVEL: ${player.level}`);
		player.level++;
		player.hp = 10;
		console.log(`LEVEL: ${player.level}`);
		localStorage.setItem('player', JSON.stringify(player));
		nextRound();
	}
};

const endScreen = () => {
	const resultScreen = document.getElementById('resultScreen');
	resultScreen.style.display = 'flex';
	const div = document.createElement('div');
	const h2 = document.createElement('h2');
	const menuButton = document.createElement('button');
	menuButton.id = gameMenuButton;
	menuButton.innerHTML = 'Menu';
	h2.textContent = 'You Lose!';
	div.append(h2);
	resultScreen.append(div);
	resultScreen.append(menuButton);
	menuButton.addEventListener('click', e => {
		document.getElementById('mainMenu').style.removeProperty('display');
		document.getElementById('resultScreen').style.removeProperty('display');
		document.getElementById('gameWindow').style.display = 'none';
		resultScreen.innerHTML = '';
	});
	clearGameElements();
};

const nextRound = () => {
	const resultScreen = document.getElementById('resultScreen');
	resultScreen.style.display = 'flex';

	const div = document.createElement('div');
	const h2 = document.createElement('h2');
	const menuButton = document.createElement('button');
	const nextRoundButton = document.createElement('button');

	h2.textContent = 'You Win!';

	menuButton.id = gameMenuButton;
	menuButton.innerHTML = 'Menu';

	if (JSON.parse(localStorage.getItem('player')).level >= 4) {
		nextRoundButton.innerHTML = 'Endless Mode';
	} else {
		nextRoundButton.innerHTML = 'Next Round';
	}

	div.append(h2);
	resultScreen.append(div);
	resultScreen.append(menuButton);
	resultScreen.append(nextRoundButton);

	menuButton.addEventListener('click', e => {
		document.getElementById('mainMenu').style.removeProperty('display');
		document.getElementById('resultScreen').style.removeProperty('display');
		document.getElementById('gameWindow').style.display = 'none';
		resultScreen.innerHTML = '';
	});

	nextRoundButton.addEventListener('click', () => {
		loadOpponentData();
		loadPlayerData();
		setTimeout(() => {
			resultScreen.style.removeProperty('display');
			resultScreen.innerHTML = '';
		}, 200);
	});
	clearGameElements();
};

const clearGameElements = () => {
	document.getElementById('opponentRoll').innerHTML = '';
	document.getElementById('playerRoll').innerHTML = '';
};

const musicToggle = () => {
	if (music.paused) {
		music.play();
	} else {
		music.pause();
	}
};

const settingsController = () => {
	const musicSlider = document.getElementById('musicSlider');
	const sfxSlider = document.getElementById('sfxSlider');

	if (!localStorageKeys().includes('settings')) {
		const settings = {
			musicToggle: true,
			musicVolume: 20,
			sxfToggle: true,
			sfxVolume: 50,
		};

		localStorage.setItem('settings', JSON.stringify(settings));
	}

	musicSlider.addEventListener('input', e => {
		const settings = JSON.parse(localStorage.getItem('settings'));
		settings.musicVolume = Number(e.target.value);
		saveSettings(settings);
		updateSettingsUI();
		setMusicVolume();
	});

	sfxSlider.addEventListener('input', e => {
		const settings = JSON.parse(localStorage.getItem('settings'));
		settings.sfxVolume = Number(e.target.value);
		saveSettings(settings);
		updateSettingsUI();
	});

	updateSettingsUI();
	setMusicVolume();
};

const saveSettings = settings => {
	localStorage.setItem('settings', JSON.stringify(settings));
};

const updateSettingsUI = () => {
	const musicSliderLabel = document.getElementById('musicSliderLabel');
	const musicSlider = document.getElementById('musicSlider');

	const sfxSliderLabel = document.getElementById('sfxSliderLabel');
	const sfxSlider = document.getElementById('sfxSlider');

	const { musicVolume, sfxVolume } = JSON.parse(localStorage.getItem('settings'));

	musicSlider.value = musicVolume;
	sfxSlider.value = sfxVolume;

	musicSliderLabel.firstElementChild.innerHTML = `${musicVolume} &percnt;`;
	sfxSliderLabel.firstElementChild.innerHTML = `${sfxVolume} &percnt;`;
};

const localStorageKeys = () => {
	const keys = [];
	for (const key in localStorage) {
		keys.push(key);
	}
	return keys;
};

const setMusicVolume = () => {
	music.volume = JSON.parse(localStorage.getItem('settings')).musicVolume / 100;
};

window.addEventListener('storage', e => {
	if (!e.key) return;
	localStorage.setItem(e.key, e.oldValue);
});

music.addEventListener('ended', () => {
	music.src = 'assets/audio/battleThemeA.mp3';
	music.load();
	setTimeout(() => {
		music.play();
	}, 3000);
});

// TODO: FIX PLAYER HEALTH NOT RESETTING ON START OF NEW ROUND
