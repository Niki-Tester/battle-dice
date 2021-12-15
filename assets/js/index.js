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
            checkUserData(e)
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
    messageBox.classList.add(type);
    messageBox.style.transform = 'translateY(0px)';
    messageBox.firstElementChild.textContent = message;
    MESSAGE_TIME_OUT = setTimeout(() => {
        clearStyles(type);
    }, 10000);
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
        'Are you sure you want to clear your local storage, you will lose all game progress.'
    if (confirm(message)) {
        localStorage.clear();
    }
}

function checkUserData(e) {
    if (localStorage.length === 0) {
        getPlayerImages()
        windowHandler(e, 'userData')
    } else windowHandler(e, 'gameWindow')
}

function images(type, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const responseText = xhttp.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html')
            const files = doc.getElementById('files');
            const list = [...files.children].filter(item => item.firstElementChild.textContent != '..')
            if (callback) callback(list);
        }
    };
    xhttp.open("GET", `assets/img/${type}`, true);
    xhttp.send();
}

function getPlayerImages() {
    images('players', result => {
        const charSelection = document.getElementById('characterSelection');
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const imageElem = document.createElement('img');
            const src = `assets/img/players/${element.firstElementChild.children[0].textContent}`
            imageElem.src = src;
            imageElem.classList.add('character');
            const charName = element.firstElementChild.children[0].textContent.replace('.webp', '');
            imageElem.id = charName
            charSelection.append(imageElem);
        }

        const characters = document.querySelectorAll('.character');

        characters.forEach(character => {
            character.addEventListener('click', e => {
                characters.forEach(character => {
                    character.classList.remove('selected')
                })
                e.currentTarget.classList.add('selected')
            });
        })
    });
}