const sections = document.querySelectorAll('section');
sections.forEach(section => {
    if (section.id === 'mainMenu') return
    section.style.display = 'none';
})