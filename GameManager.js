let gameManager = {
    focusCity: undefined,
    cities: [],
    initialize: function () {
        dayManager.startTimers();
    },
    createCity: function (name) {
        newCity = new City(name);
        this.cities.push(newCity);
        this.focusCity = newCity;
    }
}

let dayManager = {
    advanceDay: function () {
        gameManager.focusCity.projects.produce();
        gameManager.focusCity.weather.updateWeather();
        gameManager.focusCity.population.dailyConsumption();
        upgradeManager.unlockUpgrades(gameManager.focusCity);
    },
    updateTimer: function () {
        gameManager.focusCity.updateDisplay();
        upgradeManager.updateDisplay();
        divideResizer.resizeDivides();
    },
    startTimers: function () {
        window.setInterval(this.advanceDay, 1000)
        window.setInterval(this.updateTimer, 100)
    },

}

let divideResizer = {
    minWidth: 300,
    resizeDivides: function () {
        var divs = document.querySelectorAll(".resize").length;
        var screenWidth = document.querySelector(".mainView").offsetWidth;
        var totalWidth = Math.floor(screenWidth / divs);
        if (totalWidth < this.minWidth) {
            divs = Math.floor(screenWidth / this.minWidth);
            totalWidth = Math.floor(screenWidth / divs);
        }
        document.documentElement.style.setProperty("--resize-Size", (totalWidth - 8) + "px");
    }
}