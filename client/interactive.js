class InteractiveEntries {
    constructor() {
        this.data = { games: [], ratings: [] };
        this.result = {};
    }

    async addGame(name, category, numPlayers, playTime) {
        this.data.games.push({ 
            "name" : name,
            "category" : category, 
            "numPlayers" : numPlayers, 
            "playTime" : playTime });
        await fetch(`/add?name=${name}&category=${category}&numPlayers=${numPlayers}&playTime=${playTime}`,
        {
          method: 'GET',
        });
      }

      renderLastGame(element, gamename) {
        let last = this.data.games.length - 1;
        let html = '<h2 class="fw-normal center">Whoops...Something went wrong...Nothing to see here...</h2>';
        if (last >= 0 && this.data.games[last].name === gamename) {
          html = '<h2 class="fw-normal animatedh2">Last game added: <span class="text-muted">' + this.data.games[last].name + '</span></h2>';
        }
        element.innerHTML = html;
      }

      async addRating(name, username, rating) {
        this.data.ratings.push({ 
            "name" : name, 
            "username" : username, 
            "rating" : rating });
        await fetch(`/rateThisGame?name=${name}&username=${username}&rating=${rating}`,
        {
          method: 'GET',
        });
      }

      async getAllGames() {
        const response = await fetch(`/allGames`,
        {
          method: 'GET',
        });
    
        if (response.ok) {
          this.data.games = await response.json();
          return true;
        } else {
          return false;
        }
      } 

      async randomGG() {
        const response = await fetch(`/randomGG`,
        {
          method: 'GET',
        });
    
        if (response.ok) {
          this.result = await response.json();
          return true;
        } else {
          return false;
        }
      }

      async renderRandom(element) {
        await this.randomGG();
        element.innerHTML = '';
        let html = '<h2 class="fw-normal animatedh2">Our pick: <span class="text-muted">' + this.result.name + '</span></h2>'; 
        html += '<p class="subtitle">This one is a great'; 
        if (this.result.category !== "OTHER") { html += ' ' + this.result.category; }
        html += ' game, sure to please.</p>';
        if (this.result.playTime === "0") { html += '<p class="subtitle">Play as long as you want, this game is a ~forever game ~ </p><p class="subtitle">(breaks recommended)</p>'; }
        else if (this.result.playTime === "3000") { html += '<p class="subtitle">Play until you beat it</p><p class="subtitle">and there will still be more to do...</p>'; }
        else { html += '<p class="subtitle">Playtime is ' + this.result.playTime + ' minutes with up to ' + this.result.numPlayers +' players.</p>'; }
        element.innerHTML = html;
      }
      
      async renderAllGames(element) {
        await this.getAllGames();
        let html = '<h2 class="featurette-heading fw-normal lh-1" id="gamepickertitle"> All Games in Database </h2>';
        if (this.data.games.length === 0) {
          html += '<h2 class="fw-normal center">There was a problem loading or the database is empty!</h2>';
        } else {
          // alphabetize games by name
          this.data.games.sort((a, b) => {
            let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) { return -1; } //sort string ascending
            if (nameA > nameB) { return 1; }
            return 0; // no sorting
          });
          html += '<table class="allGamesTable">';
          html += `
            <tr>
              <td class="tdheader">Name of Game</td>
              <td class="tdheader">Category</td>    
              <td class="tdheader">Max Number of Players</td>
              <td class="tdheader">Expected Play Time (minutes)</td>
            </tr>
          `;
          this.data.games.forEach((g) => {
            html += `
              <tr class="gamerow">
                <td class="lead">${g.name}</td>
                <td class="lead">${g.category}</td>
                `;
              if (g.numPlayers === "0") { html+= '<td class="lead">No limit</td>'; } else { html += `<td class="lead">${g.numPlayers}</td>`; }
              if (g.playTime === "0") { html+= '<td class="lead">---</td>'; } else { html += `<td class="lead">${g.playTime}</td>`; }
              html += `</tr>`;
            });
            html += '</table>';
            html += '<p class="asterick">*** --- indicates you could probably play the game forever... but really should not. ***</p>';
            html += '<br><h2 class="fw-normal center">Not seeing a certain game? <a href="#gameform" class="plain">Add it!</a></h2>'
        }
        element.innerHTML = html;
      }
}

class FunStuff {
  renderHamster(element) {
    let html = `
    <div class="box-canvas">
    <div class="wheel-leg left"></div>
    <div class="wheel-leg right"></div>
    <div class="wheel"></div>
    <div class="hamster">
        <div class="body">
          <div class="eye"></div>
          <div class="nose"></div>
        </div>
        <div class="ear"></div>
        <div class="tail"></div>
        <div class="leg front"></div>
        <div class="leg back"></div>
      </div>
      </div>
      <hr class="featurette-divider">
      `;
    element.innerHTML = html;
  }


}

export const animation = new FunStuff();
export const interactive = new InteractiveEntries();