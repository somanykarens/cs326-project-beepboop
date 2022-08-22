import { readFile, writeFile } from 'fs/promises';

class Database {
  constructor() {
    this.path = 'backend.json';
  }

  // CREATE 
  // ------------------------------------------------

  /**
   * Save a game to the backend database
   * @param {string} name of game
   * @param {string} category 
   * @param {number} numPlayers, minimum 1
   * @param {number} playTime 
   */
   async addGame(name, category, numPlayers, playTime) {
    const data = await this._read();
    data.push({ 
        "name" : name, 
        "category" : category, 
        "numPlayers" : numPlayers, 
        "playTime" : playTime,
        "ratings" : {}
       });
    await this._write(data);
  }
  
  /**
   * Save a rating to the backend database
   * @param {string} name of game
   * @param {string} username (reviewer)
   * @param {number} rating
   */
  async addRating(name, username, rating) {
    const data = await this._read();
    const gameindex = data.findIndex((x) => x.name === name);
    data[gameindex].ratings[username] = rating;
    await this._write(data);
  }

  // READ 
  // ------------------------------------------------
  /**
   * Returns all games in Database
   * @returns [{ 
        "name" : name, 
        "category" : category, 
        "numPlayers" : numPlayers, 
        "playTime" : playTime ,
        "ratings" : ratings
    }] returns all games
   */
  async getAllGames() {
    const data = await this._read();
    return data;
  }

  /**
   * Returns a random game from Database
   * @returns { 
        "name" : name, 
        "category" : category, 
        "numPlayers" : numPlayers, 
        "playTime" : playTime ,
        "ratings" : rating
   } returns game obj
   */
  async randomGG() {
    const data = await this._read();
    return data[Math.floor(Math.random() * gamesOnly.length)]; //game obj
  }

  /**
   * Return available ratings for a game
   * @param {string} name of game
   * @returns { username1: rating, username2: rating, ... } returns ratings
   */
   async getRatings(name) {
    const data = await this._read();
    const gameindex = data.findIndex((x) => x.name === name);
    const result = data[gameindex].ratings;
    return result; // returns { username1: rating, username2: rating, ... } or empty {}
  }

  // UPDATE
  // ------------------------------------------------
  /**
   * Update an existing rating to the backend database
   * @param {string} name of game
   * @param {string} username (reviewer)
   * @param {number} rating
   * @returns boolean, true if updated, false otherwise
   */
   async updateRating(name, username, rating) {
    const onlyTheseRatings = await this.getRatings(name);
    // check if user has rating for this game
    const exists = onlyTheseRatings.hasOwnProperty(username); // boolean
    if(exists) {
      await this.addRating(name, username, rating);
      return true;
    } else {
      return false;
    }
  }


  // DELETE 
  // ------------------------------------------------
  /**
   * Delete an existing rating from the backend database
   * @param {string} name of game
   * @param {string} username (reviewer)
   * @returns boolean, true if deleted, false otherwise
   */
   async deleteRating(name, username) {
    const data = await this._read();
    const onlyTheseRatings = await this.getRatings(name);
    // check if user has rating for this game
    const exists = onlyTheseRatings.hasOwnProperty(username); // boolean
    if(exists) {
      const gameindex = data.findIndex((x) => x.name === name);
      delete data[gameindex].ratings[username];
      await this._write(data);
      return true;
    } else {
      return false;
    }
  }


  // PRIVATE 
  // ------------------------------------------------

  async _read() {
    try {
      const data = await readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async _write(data) {
    await writeFile(this.path, JSON.stringify(data), 'utf8');
  }

}

const database = new Database();
export { database };