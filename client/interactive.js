import { gameslist } from './gameslist.js';

document.getElementById("randomgame").addEventListener("click", () => {
    document.getElementById("rgame").style.color = 'green';
    document.getElementById("rgame").style.backgroundColor = 'yellow';
});

document.getElementById("randomgame").addEventListener("click", () => {
    const games = gameslist;
    document.getElementById("rgame").value = games[0];
});