
## **During Development Testing**
During the development process, manual testing was carried out in the following ways:-

1. Manually tested each element responsiveness and appearance via a live server extension for VSCode.
    
1. Published the page on GitHub pages and shared with peers for testing and for them to provide feedback. 

### **Manual Testing:**
* During testing, I used three different browsers to ensure cross-compatibility. The desktop browsers used by myself were:

  1. Chrome
  1. Firefox  
  1. Edge

- Using devtools to simulate different screen sizes/devices down to 280px in width, allowed me to test responsiveness. 
- Additionally I used an iPhone 11 with Safari / Chrome browser, and Samsung Galaxy S21 with the Chrome browser, for further testing.

### **Testing User Stories from User Experience (UX) Section**

- #### **First Time Visitor Goals**

    - **As a first time visitor, I want to be able to clearly understand the purpose of the site.**
        - When the site is loaded, the user is presented with a site that has been designed to be fluid. On the very first page that is loaded, the user is greeted with a clear, logo for the app, and has three buttons that are clearly labeled.

    - **As a first time visitor, I want to be able to understand the rules of the game.**
        - On the very first page that is loaded, the user is greeted with  three buttons that are clearly labeled. One of these buttons is labeled "How To Play".

        - When a user clicks on this button, they are taken to a section that gives them a summary on how to play the game.

    - **As a first time visitor, I want to play the game.**
        - When the site is loaded, the user is presented with a "Play" button, clicking this button takes the user to the character selection screen, with a name/username input field and a group of images, where they can select their character.

        - Once they have entered their name/username, and chosen a character, clicking the "Start" button will allow them to play the game.

- #### Returning Visitor Goals

    - **As a returning visitor, I want to be able to play a different character.**
        - When a user returns to the site they can choose to continue playing as their previous character (if they were not defeated), or if they wish to create a new character, they can clear their game data from the settings menu, which will clear their old character, and allow them to create a new one.

- #### Frequent User Goals
    - **As a frequent user, I want to be able to see my high score.**
        - When the site is loaded, the user is able to view their high score at the top left of the screen, if they have not previously played the game this will show as 0, otherwise this will show the highest they have managed to level one of their characters, before it was defeated.

 
### **Issues and Solutions:**

---

- **Expected Outcome** - When the user clicks the Play button, they are taken to the character selection section, they should see a text input field, with a group of images depicting the different characters the user can select from.

    - **Issue Found:**
        - When the user clicks the Play button, the character selection images are duplicated. This occurs anytime after the first time the character selection section is visited.

    - **Causes:**
        - Each time the Play button is pressed, each character image is appended to the list of the existing images.

    - **Solution:** 
        - Each time the user clicks the Play button, before the character images are added the inner HTML of the element it is first cleared, this prevents the images from being duplicated each time the user presses the play button.


Commit - [26dc5c07dcc31bd8df5e650a6711d26f5a85ff1c](https://github.com/Niki-Tester/battle-dice/commit/26dc5c07dcc31bd8df5e650a6711d26f5a85ff1c)

---

- **Expected Outcome** - When the user clicks the Play button, they are taken to the character selection section, they should see a text input field, with a group of images depicting the different characters the user can select from.

    - **Issue Found:** 
        - When the user clicks the Play button, the character selection images briefly appear, disappear, then reappear. This occurs anytime after the first time the character selection section is visited.

    - **Causes:**
        - Each time the user clicks the Play button the images in the character selection section are loaded, but if images were previously loaded from a previous visit, the innerHTML still retains the previous values.

    - **Solution:** 
        - Clear the character selection image section before attempting to load it again. This resolves the character images flickering.


Commit - [61b0a65ec14524e0f8978dd0c1efbb07cb679190](https://github.com/Niki-Tester/battle-dice/commit/61b0a65ec14524e0f8978dd0c1efbb07cb679190)

---

- **Expected Outcome** - When a user presses either the "Enter" / "Return" key while the text input field is focused, they should be presented with a warning message if they have not already selected a character, or the form should be submitted and proceed to the Game section if they have already selected a character.

    - **Issue Found:**
        - When the user presses either the "Enter" / "Return" key as described above, they are returned to the Main Menu section.

    - **Causes:**
        - The default form action refreshes the page, presenting the user with the home page of the application again.

    - **Solution:** 
        - A temporary fix was put in place, displaying a warning message to the user, that they should click the start button instead of pressing "Enter" / "Return" when completing the input field. This was later addressed with a further fix, where instead of displaying a message to the user, a simulated click is used on the Start Game button.
            - Commit - [53d6fb908e51ff9261b071ef04247b9ec43e76ca](https://github.com/Niki-Tester/battle-dice/commit/53d6fb908e51ff9261b071ef04247b9ec43e76ca)


Commit - [578c9b8095ede3043bef799d946b7d06ece45d67](https://github.com/Niki-Tester/battle-dice/commit/578c9b8095ede3043bef799d946b7d06ece45d67)

---

- **Expected Outcome** - If a user attempts to change a value of an item in local storage via dev tools, this should be prevented and the value reset to it's original value.

    - **Issue Found:**
        - When the user clears local storage via dev tools, a key of null, with a value of null is saved, this causes an issue when attempting to determine if there is anything stored in local storage.

    - **Causes:**
        - When the "Clear All" button in dev tools is clicked, the storage event listener detects a change has taken place, but because the event listener is triggered after local storage has already been cleared, and not just changed to a different value a key and value of null is stored.

    - **Solution:** 
        - Check if the event triggered by the storage event listener has a key, and if the key is falsy return before saving the key/value pair to local storage.


Commit - [892b226e7f553e08e9146a2e044524ca83433289](https://github.com/Niki-Tester/battle-dice/commit/892b226e7f553e08e9146a2e044524ca83433289)

---

- **Expected Outcome** - When the user has defeated one boss, the game should progress onto the next boss monster.

    - **Issue Found:**
        - When the user defeated the first boss, they play continue on to a new level, but a new boss is not loaded.

    - **Causes:**
        - The function loadOpponentData checks the players level and selects a boss monster based on the value of the players level. This was always returning null, as the playerLevel variable was set to localStorage.getItem('level') or "0" if not found.

    - **Solution:** 
        - localStorage.getItem('level') returned null as there was no key saved in local storage with the value 'level'. The required value is stored within JSON with a key value of 'player', so the player first had to be parsed from JSON to an object, and accessed using object notation.


Commit - [e59e8874256f52dec13b8e0fe7f7254e1a83bc11](https://github.com/Niki-Tester/battle-dice/commit/e59e8874256f52dec13b8e0fe7f7254e1a83bc11)

---

- **Expected Outcome** - When the user returns from being in game, to the main menu, and back to the game section, any previous rolls should be removed.

    - **Issue Found:**
        - When user returns back to the game section from the main menu, the previous roll images are still visible.

    - **Causes:**
        - The dice images are not cleared when leaving the game.

    - **Solution:** 
        - Clear both the player/opponent roll elements when the user returns to the main menu.


Commit - [56a3fa4a5869a240772105c1ea1d26f50305bdce](https://github.com/Niki-Tester/battle-dice/commit/56a3fa4a5869a240772105c1ea1d26f50305bdce)

---

- **Expected Outcome** - When clearing game data from the settings menu, all player and opponent related data should be cleared.

    - **Issue Found:**
        - When clearing game data from the settings menu, all stored items are removed from local storage, including user saved audio settings.

    - **Causes:**
        - When the clear data button is pressed, the function runs localStorage.clear().

    - **Solution:** 
        - Before localStorage.clear() is executed, settings are saved in a variable, local storage is then cleared, and settings are then saved as a new key/value pair.


Commit - [8d9efce278754cd847171d340554ac4a81caedac](https://github.com/Niki-Tester/battle-dice/commit/8d9efce278754cd847171d340554ac4a81caedac)

---

- **Expected Outcome** - Clicking on the music/sfx mute toggles saves users preferences and updates the settings in local storage.

    - **Issue Found:**
        - Clicking on the fontawesome icon inside the button did not trigger the event listener for the button correctly, resulting in the event target being the fontawesome icon, and not the button.

    - **Causes:**
        - The icon inside the button element is another element which triggers the event instead of the button.

    - **Solution:** 
        - setting pointer-events to "none" for all fontawesome icon elements, means that the only the buttons event is triggered.


Commit - [424dc43a12a7743957b1f8b5d84f00d5f4bf29cd](https://github.com/Niki-Tester/battle-dice/commit/424dc43a12a7743957b1f8b5d84f00d5f4bf29cd)

---

- **Expected Outcome** - When a user has defeated a boss, a new boss is spawned after the victory screen is loaded, and all player values are reset to their default.

    - **Issue Found:**
        - When a user returns to the game from the victory screen, until the user rolls and this is resolved, the players hp is still showing the value from the previous battle.

    - **Causes:**
        - The player elements are not updated before returning from the victory screen, and are only updated when they have rolled their next dice.

    - **Solution:** 
        - Update the player elements before the user returns to the game from the victory screen.


Commit - [f6c77db7e5302cd4ba9c82dbe65e405856313587](https://github.com/Niki-Tester/battle-dice/commit/f6c77db7e5302cd4ba9c82dbe65e405856313587)

---

- **Expected Outcome** - When the window regains focus, music should continue playing after being paused, if music was turn on in the first instance.

    - **Issue Found:**
        - If music was not previously playing, when focus is brought back to the browser tab/window a console error would be displayed.

    - **Causes:**
        - Music did not have a source for the music to continue as it was not originally assigned a source.

    - **Solution:** 
        - Check if the music element has a source, and if not prevent music from attemting to be played.


Commit - [0c8ed3fd01f201bf307a39e8a4ffd2b2e5e294ab](https://github.com/Niki-Tester/battle-dice/commit/0c8ed3fd01f201bf307a39e8a4ffd2b2e5e294ab)

---

- **Expected Outcome** - If a message is being displayed, and a new message is triggered before the previous message is cleared. The new message should have the correct background colour based on the message type.

    - **Issue Found:**
        - If a message is already displayed and a new message is triggered, the new messages' background colour would not change to the new value.

    - **Causes:**
        - The message background colour is added by a class being appended to the messageBox element.

    - **Solution:** 
        - Instead of appending another class to the class property, the old class should be overwritten by the new class value.


Commit - [9eda09d234f93d55510030a7740d0b5ae5b2a50f](https://github.com/Niki-Tester/battle-dice/commit/9eda09d234f93d55510030a7740d0b5ae5b2a50f)

---

- **Expected Outcome** - When a user completes a round in the game, and choses to return to the main menu, the game section will be hidden, and only the main menu section will be visible.

    - **Issue Found:**
        - When returning from the round end screen, the game section appeared underneath the main menu section,

    - **Causes:**
        - The display property was incorrectly removed from the relevant section elements.

    - **Solution:** 
        - Instead of removing the display property, this was set to the value "none".


Commit - [b8c8f9068643021cb37ea5f7a18f7f3ee7212435](https://github.com/Niki-Tester/battle-dice/commit/b8c8f9068643021cb37ea5f7a18f7f3ee7212435)

--- 
### **Known Issues:**
- During after development testing, a couple of issues were highlighted from other users testing. 
    - #### **Flickering Elements**:
        - On iOS devices iPhone/iPad when the user clicks the roll button elements below the dice area flicker. I spent some time trying to look for a cause but I lack the necessary hardware to debug this fully. If I had a MAC & iPhone/iPad I would be able to use the developer tools within Safari to fully debug and gain a better understanding of what may be causing the issue. As this issue is very device specific, and can not be replicated on other devices I have left this as a future fix, to be completed if/when I am able to obtain the tools to debug this issue further.

    - #### **Disabled Audio Sliders**:
        - On iOS devices iPhone/iPad adjusting the volume sliders in the Settings menu, has no impact on the volume of the music/sfx. As with the previous known issue, this is something that is again very device specific, and is considered a future fix, to be completed if/when I am able to obtain the tools to debug this issue further. 
        - The volume sliders for iPhone/iPad devices have been disabled within the settings menu so as not to confuse the user. Volume can still be muted, and adjusted using the volume buttons on the users device.



### **Code Validation:**

The W3C Markup Validator and W3C CSS Validator Services were used to validate every page of the project to ensure there were no syntax errors in the project, along with JsHint for validating all Javascript used.

- [W3C Markup Validator](https://validator.w3.org/) - [Results](https://validator.w3.org/nu/?doc=https%3A%2F%2Fniki-tester.github.io%2Fbattle-dice%2F)
    - W3C Markup Validator displays no errors, but does display 2 warnings, advising that two sections lack headings, this is by design and is not of concern.


- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input) - [Results](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fniki-tester.github.io%2Fbattle-dice%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)
    - W3C CSS Validator displayed no errors, but did display 3 warnings:

    |Style.css Line | Warning |
    | --- | --- | 
    | 287 | -webkit-appearance is a vendor extension |
    | 290 |	::-webkit-slider-thumb is a vendor extended pseudo-element |
    | 293 | -webkit-appearance is a vendor extension |

    - These warnings relate to the range sliders in the Settings section of the project, and are needed to override the default appearance of the slider thumb and backgrounds.
    
- [JsHint](https://jshint.com/) - Which returned no errors. It is important to note that the /*jshint esversion: 6 */ flag should be used when testing via JsHint. You do this by placing this comment on line 1 of the index.js file.

[Return to README](/README.md)