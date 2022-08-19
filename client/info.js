class Info {
    constructor() {
        this.status = 'not loaded';
        this.info = {};
    }

    async loadInfo() {
        const response = await fetch('info.json');
        if (response.ok) {
            this.info = await response.json();
            this.status = 'loaded';
            return true;
        } else {
            this.status = 'unavailable';
            return false;
        }
    }

    getInfo() {
        return this.info;
    }
}

const info = new Info();

export { info };