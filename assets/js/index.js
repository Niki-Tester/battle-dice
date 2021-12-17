import opponentImages from '../data/opponentImages.js'
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

console.log(opponentImages)

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

function getImages(type, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const responseText = xhttp.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html');
            const files = doc.getElementById('files');
            const imageURL = [...files.children]
                .filter(item => item.firstElementChild.textContent != '..');
            if (callback) callback(imageURL);
        }
    };

    xhttp.open("GET", `assets/img/${type}`, true);
    xhttp.send();
}

function getPlayerImages() {
    const charSelection = document.getElementById('characterSelection');
    charSelection.innerHTML = '';

    getImages('players', result => {
        for (let i = 0; i < result.length; i++) {
            createImgElement(result[i]);
        }
        addCharEventListeners();
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

function addCharEventListeners() {
    const characters = document.querySelectorAll('.character');

    characters.forEach(character => {
        character.addEventListener('click', characterSelection);
    });
}

function createImgElement(image) {
    const charSelection = document.getElementById('characterSelection');
    const imageElem = document.createElement('img');
    const src = `assets/img/players/${image.firstElementChild.children[0].textContent}`;

    imageElem.src = src;
    imageElem.classList.add('character');
    imageElem.id = image.firstElementChild.children[0].textContent.replace('.webp', '');
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

    saveUserData(username, selectedCharacter.id);
    startGame(e);
    formInput.value = '';
}

function saveUserData(username, character) {
    localStorage.setItem('username', username);
    localStorage.setItem('character', character);
}

function startGame(e) {
    const playerImageElement = document.getElementById('playerImg');
    playerImageElement.src = 'assets/img/players/ratling.webp';
    const playerNameElement = document.getElementById('playerName');
    const playerName = localStorage.getItem('username');
    playerNameElement.innerHTML = `<span>Name: </span> ${playerName}`;
    windowHandler(e, 'gameWindow');
}