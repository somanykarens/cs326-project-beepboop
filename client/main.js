// imports
import { interactiveEntries, animation } from './interactive.js';
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
const interactiveElement = document.getElementById('interactiveDiv');
const aboutElement = document.getElementById('about');
const dynamicElement = document.getElementById('dynamic-view-details');
const dynamic1Link = document.getElementById('dynamic1');
const dynamic2Link = document.getElementById('dynamic2');
const dynamic3Link = document.getElementById('dynamic3');

// NAV ELEMENTS or OTHER BUTTONS
const allGamesNavElement = document.getElementById('all-games-nav-link');
const addGameNavElement = document.getElementById('add-game-nav-link');
const aboutNavLink = document.getElementById('about-nav-link');
const randomButton = document.getElementById('random');
const addGameButton = document.getElementById('frfr-add');
const pickGameButton = document.getElementById('pickGame');

allGamesNavElement.addEventListener('click', () => {
    animation.renderHamster(document.getElementById('hamster'));
    interactiveEntries.renderAllGames(allGamesElement);
});

randomButton.addEventListener('click', () => {
    //FIXME add function to select random game from DB
    // should render game information to screen
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
    let g = await getElementValues();
    await interactiveEntries.addGame(g.name, g.category, g.numPlayers, g.playTime);
    await interactiveEntries.print(interactiveElement);
}

async function getElementValues() {
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const playTime = parseInt(document.getElementById('playTime').value);
    return { "name" : name, "category" : category, "numPlayers" : numPlayers, "playTime" : playTime };
}