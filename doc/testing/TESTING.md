
## **During Development Testing**
During the development process, manual testing was carried out in the following ways:-

1. Manually tested each element responsiveness and appearance via a live server extension for VSCode.
    
1. Published the page on GitHub pages and shared with peers for testing and for them to provide feedback. 

### ***Manual Testing:***
* During testing, I used three different browsers to ensure cross-compatibility. The desktop browsers used by myself were:

  1. Chrome
  1. Firefox  
  1. Edge

- Using devtools to simulate different screen sizes/devices down to 280px in width, allowed me to test responsiveness. 
- Additionally I used an iPhone 11 with Safari / Chrome browser, and Samsung Galaxy S21 with the Chrome browser, for further testing.

### ***Testing User Stories from User Experience (UX) Section***

- #### First Time Visitor Goals

- #### Returning Visitor Goals

- #### Frequent User Goals

 
### ***Bugs and Fixes:***

- Expected Outcome - When the user clicks the Play button, they are taken to the character selection section, they should see a text input field, with a group of images depicting the different characters the user can select from.

    - Issue Found:
        - When the user clicks the Play button, the character selection images are duplicated. This occurs anytime after the first time the character selection section is visited.

    - Causes:
        - Each time the Play button is pressed, each character image is appended to the list of the existing images.

    - Solution: 
        - Each time the user clicks the Play button, before the character images are added the inner HTML of the element it is first cleared, this prevents the images from being duplicated each time the user presses the play button.


Commit - [26dc5c07dcc31bd8df5e650a6711d26f5a85ff1c](https://github.com/Niki-Tester/battle-dice/commit/26dc5c07dcc31bd8df5e650a6711d26f5a85ff1c)

---

- Expected Outcome - When the user clicks the Play button, they are taken to the character selection section, they should see a text input field, with a group of images depicting the different characters the user can select from.

    - Issue Found: 
        - When the user clicks the Play button, the character selection images briefly appear, disappear, then reappear. This occurs anytime after the first time the character selection section is visited.

    - Causes:
        - Each time the user clicks the Play button the images in the character selection section are loaded, but if images were previously loaded from a previous visit, the innerHTML still retains the previous values.

    - Solution: 
        - Clear the character selection image section before attempting to load it again. This resolves the character images flickering.


Commit - [61b0a65ec14524e0f8978dd0c1efbb07cb679190](https://github.com/Niki-Tester/battle-dice/commit/61b0a65ec14524e0f8978dd0c1efbb07cb679190)

---

- Expected Outcome - When a user presses either the "Enter" / "Return" key while the text input field is focused, they should be presented with a warning message if they have not already selected a character, or the form should be submitted and proceed to the Game section if they have already selected a character.

    - Issue Found:
        - When the user presses either the "Enter" / "Return" key as described above, they are returned to the Main Menu section.

    - Causes:
        - The default form action refreshes the page, presenting the user with the home page of the application again.

    - Solution: 
        - A temporary fix was put in place, displaying a warning message to the user, that they should click the start button instead of pressing "Enter" / "Return" when completing the input field. This was later addressed with a further fix, where instead of displaying a message to the user, a simulated click is used on the Start Game button.
            - Commit - [53d6fb908e51ff9261b071ef04247b9ec43e76ca](https://github.com/Niki-Tester/battle-dice/commit/53d6fb908e51ff9261b071ef04247b9ec43e76ca)


Commit - [578c9b8095ede3043bef799d946b7d06ece45d67](https://github.com/Niki-Tester/battle-dice/commit/578c9b8095ede3043bef799d946b7d06ece45d67)

---

- Expected Outcome - If a user attempts to change a value of an item in local storage via dev tools, this should be prevented and the value reset to it's original value.

    - Issue Found:
        - When the user clears local storage via dev tools, a key of null, with a value of null is saved, this causes an issue when attempting to determine if there is anything stored in local storage.

    - Causes:
        - When the "Clear All" button in dev tools is clicked, the storage event listener detects a change has taken place, but because the event listener is triggered after local storage has already been cleared, and not just changed to a different value a key and value of null is stored.

    - Solution: 
        - Check if the event triggered by the storage event listener has a key, and if the key is falsy return before saving the key/value pair to local storage.


Commit - [892b226e7f553e08e9146a2e044524ca83433289](https://github.com/Niki-Tester/battle-dice/commit/892b226e7f553e08e9146a2e044524ca83433289)

---

- Expected Outcome - When the user has defeated one boss, the game should progress onto the next boss monster.

    - Issue Found:
        - When the user defeated the first boss, they play continue on to a new level, but a new boss is not loaded.

    - Causes:
        - The function loadOpponentData checks the players level and selects a boss monster based on the value of the players level. This was always returning null, as the playerLevel variable was set to localStorage.getItem('level') or "0" if not found.

    - Solution: 
        - localStorage.getItem('level') returned null as there was no key saved in local storage with the value 'level'. The required value is stored within JSON with a key value of 'player', so the player first had to be parsed from JSON to an object, and accessed using object notation.


Commit - [e59e8874256f52dec13b8e0fe7f7254e1a83bc11](https://github.com/Niki-Tester/battle-dice/commit/e59e8874256f52dec13b8e0fe7f7254e1a83bc11)

---

- Expected Outcome - When the user returns from being in game, to the main menu, and back to the game section, any previous rolls should be removed.

    - Issue Found:
        - When user returns back to the game section from the main menu, the previous roll images are still visible.

    - Causes:
        - The dice images are not cleared when leaving the game.

    - Solution: 
        - Clear both the player/opponent roll elements when the user returns to the main menu.


Commit - [56a3fa4a5869a240772105c1ea1d26f50305bdce](https://github.com/Niki-Tester/battle-dice/commit/56a3fa4a5869a240772105c1ea1d26f50305bdce)

---

- Expected Outcome - When clearing game data from the settings menu, all player and opponent related data should be cleared.

    - Issue Found:
        - When clearing game data from the settings menu, all stored items are removed from local storage, including user saved audio settings.

    - Causes:
        - When the clear data button is pressed, the function runs localStorage.clear().

    - Solution: 
        - Before localStorage.clear() is executed, settings are saved in a variable, local storage is then cleared, and settings are then saved as a new key/value pair.


Commit - [8d9efce278754cd847171d340554ac4a81caedac](https://github.com/Niki-Tester/battle-dice/commit/8d9efce278754cd847171d340554ac4a81caedac)

---

- Expected Outcome - Clicking on the music/sfx mute toggles saves users preferences and updates the settings in local storage.

    - Issue Found:
        - Clicking on the fontawesome icon inside the button did not trigger the event listener for the button correctly, resulting in the event target being the fontawesome icon, and not the button.

    - Causes:
        - The icon inside the button element is another element which triggers the event instead of the button.

    - Solution: 
        - setting pointer-events to "none" for all fontawesome icon elements, means that the only the buttons event is triggered.


Commit - [424dc43a12a7743957b1f8b5d84f00d5f4bf29cd](https://github.com/Niki-Tester/battle-dice/commit/424dc43a12a7743957b1f8b5d84f00d5f4bf29cd)

---

- Expected Outcome - When a user has defeated a boss, a new boss is spawned after the victory screen is loaded, and all player values are reset to their default.

    - Issue Found:
        - When a user returns to the game from the victory screen, until the user rolls and this is resolved, the players hp is still showing the value from the previous battle.

    - Causes:
        - The player elements are not updated before returning from the victory screen, and are only updated when they have rolled their next dice.

    - Solution: 
        - Update the player elements before the user returns to the game from the victory screen.


Commit - [f6c77db7e5302cd4ba9c82dbe65e405856313587](https://github.com/Niki-Tester/battle-dice/commit/f6c77db7e5302cd4ba9c82dbe65e405856313587)

---

- Expected Outcome - When the window regains focus, music should continue playing after being paused, if music was turn on in the first instance.

    - Issue Found:
        - If music was not previously playing, when focus is brought back to the browser tab/window a console error would be displayed.

    - Causes:
        - Music did not have a source for the music to continue as it was not originally assigned a source.

    - Solution: 
        - Check if the music element has a source, and if not prevent music from attemting to be played.


Commit - [0c8ed3fd01f201bf307a39e8a4ffd2b2e5e294ab](https://github.com/Niki-Tester/battle-dice/commit/0c8ed3fd01f201bf307a39e8a4ffd2b2e5e294ab)

---

- Expected Outcome - If a message is being displayed, and a new message is triggered before the previous message is cleared. The new message should have the correct background colour based on the message type.

    - Issue Found:
        - If a message is already displayed and a new message is triggered, the new messages' background colour would not change to the new value.

    - Causes:
        - The message background colour is added by a class being appended to the messageBox element.

    - Solution: 
        - Instead of appending another class to the class property, the old class should be overwritten by the new class value.


Commit - [9eda09d234f93d55510030a7740d0b5ae5b2a50f](https://github.com/Niki-Tester/battle-dice/commit/9eda09d234f93d55510030a7740d0b5ae5b2a50f)

---

- Expected Outcome - When a user completes a round in the game, and choses to return to the main menu, the game section will be hidden, and only the main menu section will be visible.

    - Issue Found:
        - When returning from the round end screen, the game section appeared underneath the main menu section,

    - Causes:
        - The display property was incorrectly removed from the relevant section elements.

    - Solution: 
        - Instead of removing the display property, this was set to the value "none".


Commit - [b8c8f9068643021cb37ea5f7a18f7f3ee7212435](https://github.com/Niki-Tester/battle-dice/commit/b8c8f9068643021cb37ea5f7a18f7f3ee7212435)

---
<!-- 
- Expected Outcome - 

    - Issue Found:
        - 

    - Causes:
        - 

    - Solution: 
        - 


Commit - [](https://github.com/Niki-Tester/battle-dice/commit/)

--- -->

[return to README.md](/README.md)