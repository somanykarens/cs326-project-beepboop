import { readFile, writeFile } from 'fs/promises';

class Database {
    constructor() {
        this.path = 'backend.json';
    }

    // save / create

    // save / update

    // read / return data in database

    // delete


    // Private methods used in Database only:
    async reloadData() {
        try {
            const data = await readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return { word: [], game: [] };
        }
    }

    async writeData(data) {
        await writeFile(this.path, JSON.stringify(data), 'utf8');
    }
}

const database = new Database();
export { database };