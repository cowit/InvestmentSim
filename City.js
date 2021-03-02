class City {
    items = itemManager.Subscribe(this); //Tells the ItemManager to keep this list up to date.
    population = new Population(this);
    projects = new Projects(this);
    weather = new Weather();



    //Stats

    //Modifiers
    constructor(name) {
        this.name = name;
    }

    produce() {
        this.projects.produce();
    }

    FocusCity() {//When run, Sets GameManager.FocusCity to this and runs SetItemPrices
        gameManager.focusCity = this;
        this.updateDisplay();
    }

    updateDisplay() {//Called by GameManager
        this.projects.updateElements();
        this.population.updateElements();
    }
}