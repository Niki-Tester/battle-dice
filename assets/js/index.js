import opponentImages from '../data/opponentImages.js'
import playerImages from '../data/playerImages.js'
import Character from '../js/Character.js'
let MESSAGE_TIME_OUT;
const sections = [...document.querySelectorAll('section')];
const messageBox = sections.filter(section => section.id === 'messageBox')[0];
const messageClose = document.getElementById('messageClose');
const buttons = [...document.querySelectorAll('button')];

buttons.forEach(button => button.addEventListener('click', buttonHandler));
messageClose.addEventListener('click', closeMessage);

sections.forEach(section => {
    if (section.id === 'messageBox' || section.id === 'mainMenu') return;
    section.style.display = 'none';
});

function buttonHandler(e) {
    if (e.currentTarget.classList.contains('menuButton')) {
        e.currentTarget.parentElement.style.display = 'none';
        sections.filter(section => section.id === 'mainMenu')[0]
            .style.display = 'flex';
        return;
    }

    switch (e.currentTarget.id) {
        case 'playButton':
            checkUserData(e);
            break;

        case 'startGame':
            validateInput(e);
            break;

        case 'settingsButton':
            windowHandler(e, 'settingsMenu');
            break;

        case 'howToPlayButton':
            windowHandler(e, 'howToPlayMenu');
            break;

        case 'gameMenuButton':
            windowHandler(e, 'mainMenu');
            break;

        case 'resetButton':
            clearStorage();
            break;

        default:
            messageHandler(`${e.currentTarget.id} button not handled`, 'error');
    }
}

function messageHandler(message, type) {
    window.clearTimeout(MESSAGE_TIME_OUT);
    messageBox.classList.add(type);
    messageBox.style.transform = 'translateY(0px)';
    messageBox.firstElementChild.textContent = message;
    MESSAGE_TIME_OUT = setTimeout(() => {
        clearStyles(type);
    }, 7000);
}

function closeMessage() {
    window.clearTimeout(MESSAGE_TIME_OUT);
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

function windowHandler(e, sectionID) {
    if (e.target.id === 'gameMenuButton') {
        e.currentTarget.parentElement.parentElement.style.display = 'none';
    } else {
        e.currentTarget.parentElement.style.display = 'none';
    }
    sections.filter(section => section.id === sectionID)[0]
        .style.display = 'flex';
}

function clearStorage() {
    const message =
        'Are you sure you want to clear your local storage, you will lose all game progress.';
    if (confirm(message)) {
        localStorage.clear();
    }
}

function checkUserData(e) {
    if (localStorage.length === 0) {
        getPlayerImages();
        windowHandler(e, 'userData');
    } else startGame(e);
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

function validateInput(e) {
    const formInput = document.getElementById('username');
    const characters = [...document.querySelectorAll('.character')];
    const selectedCharacter = characters.filter(char => char.classList.contains('selected'))[0];
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

    startGame(e, username, selectedCharacter.id);
    formInput.value = '';
}

function startGame(e, username, character) {
    if (!loadPlayerData()) {
        const charIMG = `assets/img/players/${character}.webp`;
        const player = new Character(username, charIMG);
        savePlayerData(player)
    }
    console.log(loadPlayerData())

    windowHandler(e, 'gameWindow')
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
        const name = localStorage.getItem('name')
        const charIMG = localStorage.getItem('charIMG')
        const level = localStorage.getItem('level')
        const hp = localStorage.getItem('hp')
        const dmgMultiplier = localStorage.getItem('dmgMultiplier')

        return new Character(name, charIMG, level, hp, dmgMultiplier)
    } else return null
}

window.addEventListener('storage', e => {
    localStorage.setItem(e.key, e.oldValue)
})