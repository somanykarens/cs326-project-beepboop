// imports
import { interactive, animation } from './interactive.js';
import { info , categories } from './info.js';
await info.loadInfo();

// Render categories list to UI from JSON file
const selectCategoryElement_p = document.getElementById('selectCategory-picker');
const selectCategoryElement_a = document.getElementById('selectCategory-adder');
await categories.render(selectCategoryElement_p);
await categories.render(selectCategoryElement_a);

// UI Components
//  - We grab the DOM elements we need to work with to make our code cleaner.
const allGamesElement = document.getElementById('allGamesDiv');
const resultElement = document.getElementById('gamePickerResult');
const aboutElement = document.getElementById('about');
const dynamicElement = document.getElementById('dynamic-view-details');
const dynamic1Link = document.getElementById('dynamic1');
const dynamic2Link = document.getElementById('dynamic2');
const dynamic3Link = document.getElementById('dynamic3');

// NAV ELEMENTS or OTHER BUTTONS
const allGamesNavElement = document.getElementById('all-games-nav-link');
const aboutNavLink = document.getElementById('about-nav-link');
const randomButton = document.getElementById('random');
const addGameButton = document.getElementById('frfr-add');
const pickGameButton = document.getElementById('pickGame');

allGamesNavElement.addEventListener('click', () => {
    animation.renderHamster(document.getElementById('hamster'));
    interactive.renderAllGames(allGamesElement);
});

randomButton.addEventListener('click', () => {
    interactive.renderRandom(allGamesElement);
});

aboutNavLink.addEventListener('click', () => {
    aboutElement.innerText = info.getInfo().about;
});

dynamic1Link.addEventListener('click', () => {
    dynamicElement.innerText = info.getInfo().dynamic1;
});

dynamic2Link.addEventListener('click', () => {
    dynamicElement.innerText = info.getInfo().dynamic2;
});

dynamic3Link.addEventListener('click', () => {
    dynamicElement.innerText = info.getInfo().dynamic3;
});


addGameButton.addEventListener('click', () => {
    addTheGame();
});

async function addTheGame() {
    let g = await getElementValues('a');
    interactive.addGame(g.name, g.category, g.numPlayers, g.playTime);
    // have some way to show success to user
    interactive.renderLastGame(document.getElementById('lastGameAdded'), g.name);
}


async function getElementValues(form) {
    if (form === 'a') { // if form = 'a' then treat as add game form
        const name = document.getElementById('name_a').value;
        const category = selectCategoryElement_a.value;
        const numPlayers = parseInt(document.getElementById('numPlayers_a').value);
        const playTime = parseInt(document.getElementById('playTime_a').value);
        return { "name" : name, "category" : category, "numPlayers" : numPlayers, "playTime" : playTime };
    } else if (form === 'p') { // if form = 'p' then treat as pick game form
        const category = selectCategoryElement_p.value;
        const numPlayers = parseInt(document.getElementById('numPlayers_p').value);
        const playTime = parseInt(document.getElementById('playTime_p').value);
        return { "category" : category, "numPlayers" : numPlayers, "playTime" : playTime };
    } else if (form === 'r') { // if form = 'r' then treat as rating form
        // FIXME these elements do not exist in index.html yet ...
        const name = document.getElementById('name_r').value;
        const username = document.getElementById('username_r').value;
        const rating = document.getElementById('rating_r').value; // make this number 1-5
        return {"name" : name, "username" : username, "rating" : rating };
    } else {
        return false; // for testing
    }
}