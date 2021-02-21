class City {
    items = itemManager.Subscribe(this); //Tells the ItemManager to keep this list up to date.
    projects = new Projects(this);
    weather = new Weather();
    population = new Population(this);

    //Stats
    maxTraders; //The amount of traders that can come from this city.

    //Modifiers
    traderSpeed;
    constructor(name) {
        this.name = name;
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