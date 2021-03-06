let gameManager = {
    focusCity: undefined,
    cities: [],
    delayedItems: [],
    initialize: function () {
        dayManager.startTimers();

    },
    createCity: function (name) {
        newCity = new City(name);
        this.cities.push(newCity);
        this.focusCity = newCity;
    },
    addDelayedItems: function () {
        this.delayedItems.forEach((ite) => {
            this.focusCity.items[ite.name] = ite;
        })
        dayManager.advanceDay();
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

function getItem(itemName) {
    return gameManager.focusCity.items[itemName];
}

function getProject(projectName) {
    //console.log(gameManager.focusCity.projects[projectName]);
    return gameManager.focusCity.projects[projectName];
}

function getPop(popName) {
    if (popName == "total") {
        return gameManager.focusCity.population.sum();
    }
    else {
        return gameManager.focusCity.population[popName];
    }
}

function iRef(name, amount, newItem) {
    if (gameManager.focusCity == undefined && newItem != undefined) {
        gameManager.delayedItems.push(newItem);
    }
    else {
        if (newItem != undefined && gameManager.focusCity.items[name] == undefined) {
            gameManager.focusCity.items[name] = newItem;
        }
    }
    return new ItemRef(name, amount);
}

function prettyDecimal(number) {
    if (number % 1 == 0) {
        return number;
    }
    else {
        return number.toFixed(2);
    }
}