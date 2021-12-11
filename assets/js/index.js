let MESSAGE_TIME_OUT;

const sections = [...document.querySelectorAll('section')]
const messageBox = sections.filter(section => section.id === 'messageBox')[0]
const messageClose = document.getElementById('messageClose')

sections.forEach(section => {
    if (section.id === 'messageBox') return
    if (section.id === 'mainMenu') return
    section.style.display = 'none';
})

messageClose.addEventListener('click', closeMessage)

function messageHandler(message, type) {
    messageBox.classList.add(type)
    messageBox.style.transform = 'translateY(0px)';
    messageBox.firstElementChild.textContent = message
    MESSAGE_TIME_OUT = setTimeout(() => {
        clearStyles(type)
    }, 10000);
}

function closeMessage() {
    window.clearTimeout(MESSAGE_TIME_OUT);
    const type = messageBox.classList[0]
    clearStyles(type)
}

function clearStyles(type) {
    messageBox.style.removeProperty('transform')
    setTimeout(() => {
        messageBox.classList.remove(type)
        messageBox.firstElementChild.textContent = ''
    }, 500);
}