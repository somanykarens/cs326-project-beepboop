class InteractiveEntries {
    constructor() {
        this.data = { games: [], ratings: [] };
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

      async renderAllGames(element) {
        await this.getAllGames();
        let html = '<h2 class="featurette-heading fw-normal lh-1" id="gamepickertitle"> All Games in Database </h2>';
        html += '<table class="allGamesTable">';
        html += `
          <tr>
            <td class="tdheader">Name of Game</td>
            <td class="tdheader">Category</td>
            <td class="tdheader">Max Number of Players</td>
            <td class="tdheader">Expected Play Time (minutes)</td>
          </tr>
        `;

        if (this.data.games.length === 0) {
          html += 'There was a problem loading';
        } else {
          this.data.games.forEach((g) => {
            html += `
              <tr class="gamerow">
                <td class="lead">${g.name}</td>
                <td class="lead">${g.category}</td>
                <td class="lead">${g.numPlayers}</td>
                <td class="lead">${g.playTime}</td>
              </tr>
            `;
            });
        }
        html += '</table>';
        element.innerHTML = html;
      }

      // FIXME - REMOVE LATER...USED FOR TESTING
    async print(element) {
        let html = '';
        for (let g in this.data.games) {
            html += g.name + '<br>';
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
      `;
  element.innerHTML = html;
  }
}

export const animation = new FunStuff();
export const interactiveEntries = new InteractiveEntries();