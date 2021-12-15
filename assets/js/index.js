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