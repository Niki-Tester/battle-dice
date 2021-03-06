import playerImages from '../data/playerImages.js';
import opponentImages from '../data/opponentImages.js';
import Character from '../js/Character.js';
import audioFiles from '../data/audioFiles.js';
import sfxFiles from '../data/sfxFiles.js';

// Global variables
let g_MessageTimeOut;

// Executes when DOM has completely loaded.
window.addEventListener('DOMContentLoaded', () => {
	hideSections();
	addButtonListeners();
	addFormListener();
	addMessageCloseListener();
	settingsController();
	audioController();
	setHighScore();
});

/** Hide all sections except for the main menu and message box on load. */
const hideSections = () => {
	const sections = [...document.querySelectorAll('section')];

	sections.forEach(section => {
		if (section.id === 'messageBox' || section.id === 'mainMenu') return;
		section.style.display = 'none';
	});
};

/** Adds click event listeners to all buttons. */
const addButtonListeners = () => {
	const buttons = [...document.querySelectorAll('button')];
	buttons.forEach(button => button.addEventListener('click', buttonHandler));
};

/** Add event listener to form input, and prevent default action. */
const addFormListener = () => {
	const form = document.getElementById('userForm');
	form.addEventListener('submit', e => {
		e.preventDefault();
		document.getElementById('startGame').click();
	});
};

/** Add event listener to message close icon. */
const addMessageCloseListener = () => {
	const messageClose = document.getElementById('messageClose');
	messageClose.addEventListener('click', closeMessage);
};

/** Button Handler is called when a button is clicked. */
const buttonHandler = e => {
	const sections = [...document.querySelectorAll('section')];

	if (e.currentTarget.classList.contains('menuButton')) {
		e.currentTarget.parentElement.style.display = 'none';
		sections.filter(section => section.id === 'mainMenu')[0].style.display = 'flex';
		pauseMusic();
		return;
	}

	switch (e.currentTarget.id) {
		case 'playButton':
			checkUserData(e, sections);
			musicSelector();
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
			pauseMusic();
			break;

		case 'resetButton':
			clearStorage();
			break;

		case 'playerRollButton':
			startRound();
			break;

		case 'menuMusicMute':
			musicToggle();
			break;

		case 'settingsMusicMute':
			musicToggle();
			break;

		case 'settingsSfxMute':
			sfxToggle();
			break;

		default:
			messageHandler(`${e.currentTarget.id} button not handled`, 'error');
	}
};

/**
 *  Displays a message to user
 * @param {String} message	Message to display to user
 * @param {String} type 	Sets the background colour of the message, options are 'success', 'warn', 'error'
 */
const messageHandler = (message, type) => {
	const messageBox = document.getElementById('messageBox');
	window.clearTimeout(g_MessageTimeOut);
	messageBox.classList = type;
	messageBox.style.transform = 'translateY(0px)';
	messageBox.firstElementChild.textContent = message;
	g_MessageTimeOut = setTimeout(() => {
		clearStyles(type);
	}, 7000);
};

/** Clears timeout of current message. */
const closeMessage = () => {
	const messageBox = document.getElementById('messageBox');
	window.clearTimeout(g_MessageTimeOut);
	const type = messageBox.classList[0];
	clearStyles(type);
};

/** Clears message background style. */
const clearStyles = type => {
	const messageBox = document.getElementById('messageBox');
	messageBox.style.removeProperty('transform');
	setTimeout(() => {
		messageBox.classList.remove(type);
		messageBox.firstElementChild.textContent = '';
	}, 500);
};

/** Gets the html section ID from the button ID and displays that section, while hiding the current section. */
const windowHandler = (e, sectionID, sections) => {
	if (e.target.id === 'gameMenuButton' || e.target.parentElement.id === 'menuButtons') {
		e.currentTarget.parentElement.parentElement.style.display = 'none';
	} else {
		e.currentTarget.parentElement.style.display = 'none';
	}
	sections.filter(section => section.id === sectionID)[0].style.display = 'flex';
};

/** Checks if local storage contains player data. */
const checkUserData = (e, sections) => {
	if (!localStorageKeys().includes('player')) {
		getPlayerImages();
		windowHandler(e, 'userData', sections);
	} else startGame(e, null, null, sections);
};

/** Gets player images from imported playerImages.js passing each image object to createImgElement function. */
const getPlayerImages = () => {
	const charSelection = document.getElementById('characterSelection');
	charSelection.innerHTML = '';

	for (let i = 0; i < playerImages.length; i++) {
		createImgElement(playerImages[i]);
	}
	addCharEventListeners();
};

/** Adds click event listeners to each character image. */
const addCharEventListeners = () => {
	const characters = document.querySelectorAll('.character');

	characters.forEach(character => {
		character.addEventListener('click', characterSelection);
	});
};

/** Adds "selected" class to image on click, and removes from previously clicked image. */
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

/** Crates player image element and appends to "characterSelection" html element. */
const createImgElement = image => {
	const charSelection = document.getElementById('characterSelection');
	const imageElem = document.createElement('img');
	const src = `assets/img/players/${image.fileName}`;

	imageElem.src = src;
	imageElem.classList.add('character');
	imageElem.id = image.fileName.replace('.webp', '');
	charSelection.append(imageElem);
};

/** Validates user input, ensuring username is no longer than 12 characters, and contains valid characters. */
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

/** startGame is called when user clicks "start" button on "characterSelection" html section. */
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

/** Save player data to local storage as JSON.*/
const savePlayerData = player => {
	localStorage.setItem('player', JSON.stringify(player));
};

/**
 * Gets player data from local storage, parsing from JSON notation to JS object
 * @returns Player data as object
 */
const getPlayerStats = () => JSON.parse(localStorage.getItem('player'));

/** Creates player object from Character.js class, using local storage data if found. */
const loadPlayerData = () => {
	if (localStorageKeys().includes('player')) {
		const { name, charIMG, hp, level, dmgMultiplier } = JSON.parse(
			localStorage.getItem('player')
		);
		return new Character(name, charIMG, hp, level, dmgMultiplier);
	} else return null;
};

/** Saves opponent data to local storage. */
const saveOpponentData = opponent => {
	localStorage.setItem('opponent', JSON.stringify(opponent));
};

/** Loads opponent data from local storage, if found. */
const loadOpponentData = () => {
	if (localStorageKeys().includes('opponent')) {
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

/** Gets players data from local storage, and updates players HTML elements. */
const setPlayerElements = () => {
	const { name, hp, charIMG } = JSON.parse(localStorage.getItem('player'));
	document.getElementById('playerName').textContent = name;
	document.getElementById('playerHealth').textContent = hp;
	document.getElementById('playerImg').src = charIMG;
};

/**
 * Creates opponent from loadOpponentData(), creating Character from Character.js with data
 * stored in local storage.
 */
const createOpponent = opponent => {
	const name = opponent.name;
	const charIMG = `assets/img/bosses/${opponent.fileName}`;
	const currentOpponent = new Character(name, charIMG);
	localStorage.setItem('opponent', JSON.stringify(currentOpponent));
	setOpponentElements();
};

/** Gets opponent data from local storage, and updated opponent HTML elements. */
const setOpponentElements = () => {
	const { name, hp, charIMG } = JSON.parse(localStorage.getItem('opponent'));
	document.getElementById('opponentName').textContent = name;
	document.getElementById('opponentHealth').textContent = hp;
	document.getElementById('opponentImg').src = charIMG;
};

/** Called when user clicks "Roll" button on "gameWindow" section. */
const startRound = () => {
	document.getElementById('playerRollButton').disabled = true;
	document.getElementById('gameMenuButton').disabled = true;
	document.getElementById('playerRoll').innerHTML = '';
	document.getElementById('opponentRoll').innerHTML = '';
	createDice('player');
};

/**
 * Creates dice element
 * @param {String} diceId - "player" or "opponent"
 */
const createDice = diceId => {
	const diceArea = document.getElementById('diceArea');
	const dice = document.createElement('div');

	for (let i = 1; i <= 6; i++) {
		const diceFace = document.createElement('div');
		diceFace.classList.add(`dice-face`);
		diceFace.classList.add(`dice-face-${i}`);
		dice.append(diceFace);
	}

	dice.id = `${diceId}Dice`;
	diceArea.append(dice);
	rollDice(dice);
};

/**
 * Handles dice roll animation, and generates dice roll from RNG.
 * @param {HTMLElement} dice
 */
const rollDice = dice => {
	const playerRollElement = document.getElementById('playerRoll');
	const opponentRollElement = document.getElementById('opponentRoll');
	const sfx = document.getElementById('sfx');
	sfx.src = sfxFiles[Math.floor(Math.random() * sfxFiles.length)].path;

	const diceScale = 2;
	const rollModifier = 8;
	const diceRoll = Math.floor(Math.random() * 6) + 1;
	setTimeout(() => {
		sfx.play();
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
			document.getElementById('gameMenuButton').disabled = false;
			compareRolls();
		}
	}, 4000);
};

/** Gets players/opponents roll from local storage, and compares the rolled dice values. */
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

/**
 * Checks if either player/opponent HP is less than or equal to 0.
 * Game / Round ends if true, Game continues if false.
 * @param {Object.<string, *>} player
 * @param {Object.<string, *>} opponent
 */
const checkGameEnd = (player, opponent) => {
	if (player.hp <= 0) {
		const { level } = getPlayerStats();
		saveHighScore(level);
		setHighScore();
		localStorage.removeItem('player');
		localStorage.removeItem('opponent');
		endScreen();
	}
	if (opponent.hp <= 0) {
		localStorage.removeItem('opponent');
		player.level++;
		player.hp = 10;
		localStorage.setItem('player', JSON.stringify(player));
		nextRound();
		setPlayerElements();
	}
};

/** Displays resultsScreen when player loses. */
const endScreen = () => {
	const resultScreen = document.getElementById('resultScreen');
	const div = document.createElement('div');
	const h2 = document.createElement('h2');
	const menuButton = document.createElement('button');
	const music = document.getElementById('music');

	resultScreen.style.display = 'flex';
	resultScreen.style.backgroundColor = '#661d00';

	music.src = 'assets/audio/deathTheme.mp3';
	music.play();
	music.loop = false;
	menuButton.id = 'gameMenuButton';
	menuButton.innerHTML = 'Menu';
	h2.textContent = 'You Lose!';
	div.append(h2);
	resultScreen.append(div);
	resultScreen.append(menuButton);

	menuButton.addEventListener('click', () => {
		document.getElementById('mainMenu').style.removeProperty('display');
		document.getElementById('resultScreen').style.removeProperty('display');
		document.getElementById('gameWindow').style.display = 'none';

		resultScreen.innerHTML = '';
		pauseMusic();
		music.src = '';
	});

	clearGameElements();
};

/** Displays resultsScreen when player wins. */
const nextRound = () => {
	const music = document.getElementById('music');
	const resultScreen = document.getElementById('resultScreen');
	const div = document.createElement('div');
	const h2 = document.createElement('h2');
	const menuButton = document.createElement('button');
	const nextRoundButton = document.createElement('button');
	const { level } = getPlayerStats();

	resultScreen.style.backgroundColor = '#146600';

	resultScreen.style.display = 'flex';
	saveHighScore(level);
	setHighScore();

	h2.textContent = 'You Win!';

	menuButton.id = 'gameMenuButton';
	menuButton.innerHTML = 'Menu';

	if (JSON.parse(localStorage.getItem('player')).level >= 4) {
		nextRoundButton.innerHTML = 'Endless Mode';
		music.src = 'assets/audio/victoryTheme.mp3';
		music.play();
		music.loop = false;
	} else {
		nextRoundButton.innerHTML = 'Next Round';
		music.src = 'assets/audio/victoryFanfare.mp3';
		music.play();
		music.loop = false;
	}

	div.append(h2);
	resultScreen.append(div);
	resultScreen.append(menuButton);
	resultScreen.append(nextRoundButton);

	menuButton.addEventListener('click', () => {
		document.getElementById('mainMenu').style.removeProperty('display');
		document.getElementById('resultScreen').style.removeProperty('display');
		document.getElementById('gameWindow').style.display = 'none';
		resultScreen.innerHTML = '';
		pauseMusic();
	});

	nextRoundButton.addEventListener('click', () => {
		loadOpponentData();
		loadPlayerData();
		setTimeout(() => {
			resultScreen.style.removeProperty('display');
			resultScreen.innerHTML = '';
			musicSelector();
		}, 200);
	});
	clearGameElements();
};

/** Clears player/opponent previous roll images. */
const clearGameElements = () => {
	document.getElementById('opponentRoll').innerHTML = '';
	document.getElementById('playerRoll').innerHTML = '';
};

/** Gets user settings from local storage, and update HTML elements to match the values stored. */
const settingsController = () => {
	const musicSlider = document.getElementById('musicSlider');
	const sfxSlider = document.getElementById('sfxSlider');

	if (!localStorageKeys().includes('settings')) {
		const settings = {
			musicMute: true,
			musicVolume: 20,
			sfxMute: true,
			sfxVolume: 50,
		};

		saveSettings(settings);
	}

	musicSlider.addEventListener('input', e => {
		const settings = getSettings();
		settings.musicVolume = Number(e.target.value);
		saveSettings(settings);
		updateSettingsUI();
		setMusicVolume();
	});

	sfxSlider.addEventListener('input', e => {
		const settings = getSettings();
		settings.sfxVolume = Number(e.target.value);
		saveSettings(settings);
		updateSettingsUI();
		setSfxVolume();
	});

	checkUserOS();

	updateSettingsUI();
	setMusicVolume();
	setSfxVolume();
};

/**
 * Gets user settings from local storage, parsed from JSON to JS Object.
 * @returns Settings as object.
 */
const getSettings = () => JSON.parse(localStorage.getItem('settings'));

const saveSettings = settings => {
	localStorage.setItem('settings', JSON.stringify(settings));
};

/** Checks users device type. */
const checkUserOS = () => {
	const iOSDevices = ['iPad', 'iPhone', 'iPod'];
	// navigator.platform is depreciated, but safari does not currently support the current alternative
	if (iOSDevices.includes(navigator.platform)) {
		document.getElementById('musicSlider').disabled = true;
		document.getElementById('sfxSlider').disabled = true;
	}
};

/** Updates settings UI Elements on change */
const updateSettingsUI = () => {
	const musicSliderLabel = document.getElementById('musicSliderLabel');
	const musicSlider = document.getElementById('musicSlider');
	const menuMusicMute = document.getElementById('menuMusicMute');
	const settingsMusicMute = document.getElementById('settingsMusicMute');

	const sfxSliderLabel = document.getElementById('sfxSliderLabel');
	const sfxSlider = document.getElementById('sfxSlider');
	const settingsSfxMute = document.getElementById('settingsSfxMute');

	const { musicVolume, sfxVolume, musicMute, sfxMute } = getSettings();

	musicSlider.value = musicVolume;
	musicSliderLabel.firstElementChild.innerHTML = `${musicVolume} &percnt;`;

	musicMute
		? (menuMusicMute.innerHTML = '<i class="fas fa-volume-mute"></i>')
		: (menuMusicMute.innerHTML = '<i class="fas fa-volume-up"></i>');
	musicMute
		? (settingsMusicMute.innerHTML = '<i class="fas fa-volume-mute"></i>')
		: (settingsMusicMute.innerHTML = '<i class="fas fa-volume-up"></i>');

	sfxSlider.value = sfxVolume;
	sfxSliderLabel.firstElementChild.innerHTML = `${sfxVolume} &percnt;`;

	sfxMute
		? (settingsSfxMute.innerHTML = '<i class="fas fa-volume-mute"></i>')
		: (settingsSfxMute.innerHTML = '<i class="fas fa-volume-up"></i>');
};

/** Sets Music/SFX volume based on user settings stored in local storage. */
const audioController = () => {
	const music = document.getElementById('music');
	const musicSlider = document.getElementById('musicSlider');

	const sfx = document.getElementById('sfx');
	const sfxSlider = document.getElementById('sfxSlider');

	const { musicMute, sfxMute } = getSettings();

	music.muted = musicMute;
	musicSlider.addEventListener('change', musicVolumeCheck);

	sfx.muted = sfxMute;
	sfxSlider.addEventListener('change', sfxVolumeCheck);
};

/**
 * Plays short music clip while adjusting music volume range HTML element.
 * @returns null
 */
const musicVolumeCheck = () => {
	const music = document.getElementById('music');
	if (!music.paused) return;
	music.src = 'assets/audio/victoryFanfare.mp3';
	music.play();
};

/** Sets music volume based on value stored in local storage. */
const setMusicVolume = () => {
	const music = document.getElementById('music');
	music.volume = getSettings().musicVolume / 100;
};

/** Plays short SFX clip while adjusting SFX volume range HTML element. */
const sfxVolumeCheck = () => {
	const sfx = document.getElementById('sfx');
	sfx.src = 'assets/audio/diceRoll_3.mp3';
	sfx.play();
};

/** Sets SFX volume based on value stored in local storage. */
const setSfxVolume = () => {
	const sfx = document.getElementById('sfx');
	sfx.volume = getSettings().sfxVolume / 100;
};

/**
 * Music track is selected based on players level, and if player level is higher than
 * imported audioFiles lenth, music track is chosen at random.
 */
const musicSelector = () => {
	const music = document.getElementById('music');
	const playerStats = getPlayerStats();

	if (!playerStats) {
		music.src = audioFiles[0].path;
	} else {
		music.src = audioFiles[playerStats.level % audioFiles.length].path;
	}
	music.load();
	music.loop = true;
	music.play();
};

/** Reduces Music volume and then pauses. */
const pauseMusic = () => {
	const music = document.getElementById('music');
	music.volume -= 0.1;
	setTimeout(() => {
		if (music.volume <= 0.1) {
			music.volume = 0;
			music.pause();
			const { musicVolume } = getSettings();
			music.volume = musicVolume / 100;
			return;
		}
		pauseMusic();
	}, 15);
};

/** Updates music mute setting in local storage, and calls updateSettingsUI */
const musicToggle = () => {
	const music = document.getElementById('music');
	const settings = getSettings();
	settings.musicMute = !settings.musicMute;
	music.muted = settings.musicMute;
	saveSettings(settings);
	updateSettingsUI();
};

/** Updates SFX mute setting in local storage, and calls updateSettingsUI */
const sfxToggle = () => {
	const sfx = document.getElementById('sfx');
	const settings = getSettings();
	settings.sfxMute = !settings.sfxMute;
	sfx.muted = settings.sfxMute;
	saveSettings(settings);
	updateSettingsUI();
};

/** Gets users high score from local storage, if exist, else high score is 0. */
const getHighScore = () => {
	if (!localStorageKeys().includes('highScore')) saveHighScore(0);
	return localStorage.getItem('highScore');
};

/** Saves users high score to local storage. */
const saveHighScore = score => {
	localStorage.setItem('highScore', score);
};

/** Sets high score HTML element to high score value in local storage. */
const setHighScore = () => {
	const hightScore = document.getElementById('highScore');
	hightScore.firstElementChild.innerHTML = getHighScore();
};

/** Clears Player/Opponent data from local storage, while retaining user settings. */
const clearStorage = () => {
	const message =
		'Are you sure you want to clear your local storage, you will lose all game progress.';
	if (confirm(message)) {
		const settings = getSettings();
		localStorage.clear();
		saveSettings(settings);
		messageHandler('Game data cleared.', 'success');
	} else {
		messageHandler('Game data not cleared.', 'warn');
	}
};

/** @returns Array of keys stored in local storage. */
const localStorageKeys = () => {
	const keys = [];
	for (const key in localStorage) {
		keys.push(key);
	}
	return keys;
};

/** Prevents user from adjusting local storage values in DevTools. */
window.addEventListener('storage', e => {
	if (!e.key) return;
	localStorage.setItem(e.key, e.oldValue);
});
