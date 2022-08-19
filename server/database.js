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
    data.games.push({ 
        "name" : name, 
        "category" : category, 
        "numPlayers" : numPlayers, 
        "playTime" : playTime });
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
    data.ratings.push({ "name" : name, "username" : username, "rating" : rating });
    await this._write(data);
  }

  // FIXME GAME PICKER: recommendation function here or on front-end only?
  // not planning to store recommendations ... unless added to user ?

  // READ 
  // ------------------------------------------------

  /**
   * Returns all games in Database
   * @returns [{ 
        "name" : name, 
        "category" : category, 
        "numPlayers" : numPlayers, 
        "playTime" : playTime }] returns games
   */
  async getAllGames() {
    const data = await this._read();
    const gamesOnly = data.games;
    return gamesOnly;
  }

  /**
   * Return available ratings for a game
   * @param {string} name of game
   * @returns [{name: string, username: string, rating: number }] returns ratings
   */
   async getRatings(name) {
    const data = await this._read();
    const result = data.ratings.filter((x) => x.name === name);
    return result;
  }

  // UPDATE
  // ------------------------------------------------

  /**
   * Updates existing ratings
   * @returns 
   */


  // DELETE 
  // ------------------------------------------------
  // async deleteRatings(name, username)


  // PRIVATE 
  // ------------------------------------------------

  async _read() {
    try {
      const data = await readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { games: [], ratings: [] };
    }
  }

  async _write(data) {
    await writeFile(this.path, JSON.stringify(data), 'utf8');
  }

}

const database = new Database();
export { database };