class InteractiveEntries {
    constructor() {
        this.data = [];
        this.result = {};
    }

    // FETCH
    async addGame(name, category, numPlayers, playTime) {
        this.data.push({ 
            "name" : name,
            "category" : category, 
            "numPlayers" : numPlayers, 
            "playTime" : playTime,
            "ratings" : {}
           });
        await fetch(`/add?name=${name}&category=${category}&numPlayers=${numPlayers}&playTime=${playTime}`,
        {
          method: 'GET',
        });
      }

      async addRating(name, username, rating) {
        const gameindex = this.data.findIndex((x) => x.name === name);
        this.data[gameindex].ratings[username] = rating;
        await fetch(`/rateThisGame?name=${name}&username=${username}&rating=${rating}`,
        {
          method: 'GET',
        });
        document.getElementById('ratingnew').innerHTML = '<h2 class="featurette-heading fw-normal lh-1"><span class="text-muted">Success!</span></h2>';
      }

      async getAllGames() {
        const response = await fetch(`/allGames`,
        {
          method: 'GET',
        });
    
        if (response.ok) {
          this.data = await response.json();
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

      async getRatings(name) {
        const response = await fetch(`/getRatingsFor?name=${name}`,
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

      async updateRating(name, username, rating) {
        await this.getRatings(name);
        const response = await fetch(`/updateRating?name=${name}&username=${username}&rating=${rating}`,
        {
          method: 'GET',
        });

        if (response.ok) {
          const onlyTheseRatings = this.result;
          const exists = onlyTheseRatings.hasOwnProperty(username);
          if(exists) {
            await this.addRating(name, username, rating);
            return true;
          } else {
            alert("This username does not have an existing rating for this game");
          }
        } else {
          return false;
        }
      }

      async deleteRating(name, username) {
        await this.getRatings(name);
        const response = await fetch(`/deleteRating?name=${name}&username=${username}`,
        {
          method: 'GET',
        });
        document.getElementById('ratingdelete').innerHTML = '<h2 class="featurette-heading fw-normal lh-1"><span class="text-muted">Deleted!</span></h2>';
        if (response.ok) {
          const onlyTheseRatings = this.result;
          const exists = onlyTheseRatings.hasOwnProperty(username);
          if(exists) {
            const gameindex = this.data.findIndex((x) => x.name === name);
            delete this.data[gameindex].ratings[username];
            return true;
          } else {
            alert("This username does not have an existing rating for this game");
          }
        } else {
          return false;
        }
      }

      // FILTER ON GAMES
      async findGames(category, numPlayers, playTime) {
        await this.getAllGames();
        this.alphabetize();
        const resultElement = document.getElementById('gamePickerResult');
        let result = this.data.filter((x) => x.category === category).filter((x) => x.numPlayers <= numPlayers);

        if (result.length === 0) {
          resultElement.innerHTML = '<h2 class="fw-normal animatedh2">Based on your choices: <span class="text-muted">we found no matches.</span></h2>';
        } else {
          result = result.filter((x) => x.playTime <= playTime);
          if (result.length === 0) {
            resultElement.innerHTML = '<h2 class="fw-normal animatedh2">Based on your choices: <span class="text-muted">we found no matches.</span></h2>';
          } else {
            // render games
            let html = '<h2 class="fw-normal animatedh2">Based on your choices:</h2>'; 
          html += '<table class="allGamesTable">';
          html += `
            <tr>
              <td class="tdheader">Name of Game</td>
              <td class="tdheader">Category</td>    
              <td class="tdheader">Max Number of Players</td>
              <td class="tdheader">Expected Play Time (minutes)</td>
            </tr>
          `;
          result.forEach((g) => {
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
            resultElement.innerHTML = html;
          }
        }
      }

      // RENDERINGS
      renderLastGame(element, gamename) {
        let last = this.data.length - 1;
        let html = '<h2 class="fw-normal center">Whoops...Something went wrong...Nothing to see here...</h2>';
        if (last >= 0 && this.data[last].name === gamename) {
          html = '<h2 class="fw-normal animatedh2">Last game added: <span class="text-muted">' + this.data[last].name + '</span></h2>';
        }
        element.innerHTML = html;
      }

      async renderRandom(element) {
        document.getElementById('hamster').innerHTML = '';
        await this.randomGG();
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
        if (this.data.length === 0) {
          html += '<h2 class="fw-normal center">There was a problem loading or the database is empty!</h2>';
        } else {
          // alphabetize games by name BY DEFAULT
          this.alphabetize();
          html += '<table class="allGamesTable">';
          html += `
            <tr>
              <td class="tdheader">Name of Game</td>
              <td class="tdheader">Category</td>    
              <td class="tdheader">Max Number of Players</td>
              <td class="tdheader">Expected Play Time (minutes)</td>
            </tr>
          `;
          this.data.forEach((g) => {
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

      renderRatingOptions() {
        const h2 = document.getElementById('ratingheader');
        const iElement = document.getElementById('imgDiv');
        const uElement = document.getElementById('ratingusername');
        const gElement = document.getElementById('ratinggameselector');
        const rElement = document.getElementById('ratingselector');
        const bElement = document.getElementById('buttonDiv');
        // clear if needed
        bElement.innerHTML = '';
        uElement.innerHTML = '';
        gElement.innerHTML = '';
        rElement.innerHTML = '';
        bElement.innerHTML = '';

        const newButton = document.getElementById('ratingnew');
        const updateButton = document.getElementById('ratingupdate');
        const deleteButton = document.getElementById('ratingdelete');
        h2.innerHTML = '<h2 class="featurette-heading fw-normal lh-1">Rate a game: <span class="text-muted">new or existing?</span></h2>';
        iElement.innerHTML = "<svg class='bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto' width='500' height='500' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Placeholder: 500x500' preserveAspectRatio='xMidYMid slice' focusable='false'><title>Photo of five yellow stars by Towfiqu barbhuiya on Pexels</title><image href='/images/stars-pexels-towfiqu-barbhuiya-9821386.jpg' width='100%' height='100%'></image></svg>";
        newButton.innerHTML = "<a class='btn btn-lg btn-primary'>New rating &raquo;</a>";
        updateButton.innerHTML = "<a class='btn btn-lg btn-primary'>Update a rating &raquo;</a>";
        deleteButton.innerHTML = "<a class='btn btn-lg btn-primary'>Delete a rating &raquo;</a>";
        newButton.addEventListener('click', () => { this.renderNewRatingForm(); });
        updateButton.addEventListener('click', () => { this.renderUpdateRatingForm(); });
        deleteButton.addEventListener('click', () => { this.renderDeleteRatingForm(); });
      }

      async renderNewRatingForm() { 
        await this.getAllGames();
        this.alphabetize();
        // grab necessary element id's
        const h2 = document.getElementById('ratingheader');
        const uElement = document.getElementById('ratingusername');
        const gElement = document.getElementById('ratinggameselector');
        const rElement = document.getElementById('ratingselector');
        const iElement = document.getElementById('imgDiv');
        const newButton = document.getElementById('ratingnew');
        const updateButton = document.getElementById('ratingupdate');
        const deleteButton = document.getElementById('ratingdelete');
        document.getElementById('buttonDiv').innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Back to options</a>";
        newButton.innerHTML = '';
        updateButton.innerHTML = '';
        deleteButton.innerHTML = '';

        // update h2
        h2.innerHTML = '<h2 class="featurette-heading fw-normal lh-1"> Add new rating</h2>';

        // update uElement
        uElement.innerHTML = '<p class="lead"><label for="username_r">Your name: </label><input type="text" id="username_r" /></p>';

        //update gElement
        gElement.innerHTML ='';
        // create drop down for games list
        const s = document.createElement("select");
        s.setAttribute("id","name_r");
        s.classList.add('lead');
        const sdefault = document.createElement("option");
        sdefault.textContent = 'Select a game to rate';
        s.appendChild(sdefault);
        for (let i = 0; i < this.data.length; ++i) {
          const o = document.createElement("option");
          o.textContent = this.data[i].name;
          o.value = this.data[i].name;
          s.appendChild(o);
        }
        gElement.appendChild(s);

        // update rElement
        rElement.innerHTML = "<br><p><select id='rating_r' class='lead'><option>How was it?</option><option value='5'>Best ever</option><option value='4'>One of the best</option><option value='3'>Good</option><option value='2'>Mid</option><option value='1'>Would not recommend</option></select></p><br>";
        newButton.innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Submit rating &raquo;</a>";

        // update iElement 
        iElement.innerHTML = "<svg class='bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto' width='500' height='500' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Placeholder: 500x500' preserveAspectRatio='xMidYMid slice' focusable='false'><title>Photo of five yellow stars by Towfiqu barbhuiya on Pexels</title><image href='/images/stars-pexels-towfiqu-barbhuiya-9821386.jpg' width='100%' height='100%'></image></svg>";
      }

      async renderUpdateRatingForm() { 
        await this.getAllGames();
        this.alphabetize();
        // grab necessary element id's
        const h2 = document.getElementById('ratingheader');
        const uElement = document.getElementById('ratingusername');
        const gElement = document.getElementById('ratinggameselector');
        const rElement = document.getElementById('ratingselector');
        const iElement = document.getElementById('imgDiv');
        const newButton = document.getElementById('ratingnew');
        const updateButton = document.getElementById('ratingupdate');
        const deleteButton = document.getElementById('ratingdelete');
        document.getElementById('buttonDiv').innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Back to options</a>";
        newButton.innerHTML = '';
        updateButton.innerHTML = '';
        deleteButton.innerHTML = '';

        // update h2
        h2.innerHTML = '<h2 class="featurette-heading fw-normal lh-1">Update an existing rating</h2>';

        // update uElement
        uElement.innerHTML = '<p class="lead"><label for="username_r">Your name: </label><input type="text" id="username_r" /></p>';

        //update gElement
        gElement.innerHTML ='';
        // create drop down for games list
        const s = document.createElement("select");
        s.setAttribute("id","name_r");
        s.classList.add('lead');
        const sdefault = document.createElement("option");
        sdefault.textContent = 'Select a game to rate';
        s.appendChild(sdefault);
        for (let i = 0; i < this.data.length; ++i) {
          const o = document.createElement("option");
          o.textContent = this.data[i].name;
          o.value = this.data[i].name;
          s.appendChild(o);
        }
        gElement.appendChild(s);

        // update rElement
        rElement.innerHTML = "<br><p><select id='rating_r' class='lead'><option>How was it?</option><option value='5'>Best ever</option><option value='4'>One of the best</option><option value='3'>Good</option><option value='2'>Mid</option><option value='1'>Would not recommend</option></select></p><br>";

        // update bElement
        updateButton.innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Update rating &raquo;</a>";

        // update iElement 
        iElement.innerHTML = "<svg class='bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto' width='500' height='500' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Placeholder: 500x500' preserveAspectRatio='xMidYMid slice' focusable='false'><title>Photo of five yellow stars by Towfiqu barbhuiya on Pexels</title><image href='/images/stars-pexels-towfiqu-barbhuiya-9821386.jpg' width='100%' height='100%'></image></svg>";
      }

      async renderDeleteRatingForm() { 
        await this.getAllGames();
        this.alphabetize();
        // grab necessary element id's
        const h2 = document.getElementById('ratingheader');
        const uElement = document.getElementById('ratingusername');
        const gElement = document.getElementById('ratinggameselector');
        const rElement = document.getElementById('ratingselector');
        const iElement = document.getElementById('imgDiv');
        const newButton = document.getElementById('ratingnew');
        const updateButton = document.getElementById('ratingupdate');
        const deleteButton = document.getElementById('ratingdelete');
        document.getElementById('buttonDiv').innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Back to options</a>";
        newButton.innerHTML = '';
        updateButton.innerHTML = '';
        deleteButton.innerHTML = '';

        // update h2
        h2.innerHTML = '<h2 class="featurette-heading fw-normal lh-1">Delete an existing rating</h2>';

        // update uElement
        uElement.innerHTML = '<p class="lead"><label for="username_r">Your name: </label><input type="text" id="username_r" /></p>';

        //update gElement
        gElement.innerHTML ='';
        // create drop down for games list
        const s = document.createElement("select");
        s.setAttribute("id","name_r");
        s.classList.add('lead');
        const sdefault = document.createElement("option");
        sdefault.textContent = 'Select game to delete rating from';
        s.appendChild(sdefault);
        for (let i = 0; i < this.data.length; ++i) {
          const o = document.createElement("option");
          o.textContent = this.data[i].name;
          o.value = this.data[i].name;
          s.appendChild(o);
        }
        gElement.appendChild(s);

        // update rElement
        rElement.innerHTML = "<div id='rating_r' value='x'></div>";

        // update bElement
        deleteButton.innerHTML = "<a class='btn btn-lg btn-primary' id='ratingSubmit'>Delete rating &raquo;</a>";

        // update iElement 
        iElement.innerHTML = "<svg class='bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto' width='500' height='500' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Placeholder: 500x500' preserveAspectRatio='xMidYMid slice' focusable='false'><title>Photo of five yellow stars by Towfiqu barbhuiya on Pexels</title><image href='/images/stars-pexels-towfiqu-barbhuiya-9821386.jpg' width='100%' height='100%'></image></svg>";
      }

      // SORTINGS / OTHER
      alphabetize() {
        this.data.sort((a, b) => {
          let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
          if (nameA < nameB) { return -1; } //sort string ascending
          if (nameA > nameB) { return 1; }
          return 0; // no sorting
        });
      }

      byCategory() {
        this.data.sort((a, b) => {
          let catA = a.category.toLowerCase(), catB = b.category.toLowerCase();
          if (catA < catB) { return -1; } //sort string ascending
          if (catA > catB) { return 1; }
          return 0; // no sorting
        });
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