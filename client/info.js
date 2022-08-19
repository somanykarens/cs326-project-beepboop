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

class CategoryList {
    constructor() {
        this.status = 'not loaded';
        this.categories = [];
    }

    async loadCats() {
        const response = await fetch('category.json');
        if (response.ok) {
            this.categories = await response.json();
            this.status = 'loaded';
            return true;
        } else {
            this.status = 'unavailable';
            return false;
        }
    }

    getCats() {
        return this.categories;
    }

    async render(element) {
        await this.loadCats();
        if (this.status === 'loaded') {
            for (let i = 0; i < this.categories.length; ++i) {
                const o = document.createElement("option");
                o.textContent = this.categories[i];
                o.value = this.categories[i];
                element.appendChild(o);
            }
        } else {
            element.innerHTML = 'There was a problem loading';
        }
    }
}

const info = new Info();
const categories = new CategoryList();

export { info, categories };