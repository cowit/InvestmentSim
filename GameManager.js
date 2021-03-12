let gameManager = {
    focusCity: undefined,
    cities: [],
    delayedItems: [],
    initialize: function () {
        dayManager.startTimers();
        document.querySelector("#saveButton").addEventListener("click", this.saveGameState.bind(this));
        document.querySelector("#loadButton").addEventListener("click", this.loadGameState.bind(this));
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
    },
    saveGameState: function () {
        //#region Save Projects
        var savedProjects = []
        this.focusCity.projects.projectsList.forEach((pro) => {
            var jobAmounts = []
            pro.jobs.forEach((job) => {
                jobAmounts.push({ name: job.name, amount: job.amount });
            })
            //console.log(pro.jobObj);
            savedProjects.push({
                name: pro.projectId,
                efficiency: pro.efficiency,
                amount: pro.amount,
                jobObj: pro.jobObj,
                jobAmounts: jobAmounts,
                unlocked: pro.unlocked,
                unpurchasable: pro.unpurchasable,
                costs: pro.costs
            })
        })
        window.localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
        //#endregion
        //#region Save Items
        var savedItems = []
        this.focusCity.items.items.forEach((item) => {
            savedItems.push({ name: item.name, amount: item.amount, unlocked: item.unlocked });
        })
        window.localStorage.setItem("savedItems", JSON.stringify(savedItems));
        //#endregion
        //#region Save Pops
        var savedPops = []
        this.focusCity.population.pops.forEach((pop) => {
            savedPops.push({ name: pop.name, amount: pop.amount });
        })
        window.localStorage.setItem("savedPops", JSON.stringify(savedPops));
        //#endregion
        //#region Save Upgrades
        var savedUpgrades = []
        upgradeManager.upgrades.forEach((upg) => {
            savedUpgrades.push({ id: upg.id, unlocked: upg.unlocked, purchased: upg.purchased });
        })
        window.localStorage.setItem("savedUpgrades", JSON.stringify(savedUpgrades));
        //#endregion
    },
    loadGameState: function () {
        //#region load projects
        var savedProjects = JSON.parse(window.localStorage.getItem("savedProjects"));
        savedProjects.forEach((pro) => {
            var target = this.focusCity.projects[pro.name];
            if (target != undefined) {
                target.efficiency = pro.efficiency;
                target.amount = pro.amount;
                target.jobs.forEach((job) => {
                    pro.jobAmounts.forEach((jA) => {
                        if (job.name == jA.name) {
                            // console.log(job);
                            job.amount = jA.amount;
                        }
                    })
                })
                target.unlocked = pro.unlocked;
                target.unpurchasable = pro.unpurchasable;
                target.costs = []
                pro.costs.forEach((cos) => {
                    target.costs.push(new iRef(cos.name, cos.amount));
                })
            }
        })
        //#endregion
        //#region load items
        var savedItems = JSON.parse(window.localStorage.getItem("savedItems"));
        savedItems.forEach((item) => {
            var target = this.focusCity.items[item.name];
            if (target != undefined) {
                target.amount = item.amount;
                target.unlocked = item.unlocked;
            }
        })
        //#endregion
        //#region Load Pops
        var savedPops = JSON.parse(window.localStorage.getItem("savedPops"));
        savedPops.forEach((pop) => {
            var target = this.focusCity.population[pop.name];
            if (target != undefined) {
                target.amount = pop.amount;
            }
        })
        //#endregion
        //#region Load Upgrades
        var savedUpgrades = JSON.parse(window.localStorage.getItem("savedUpgrades"));
        savedUpgrades.forEach((upg) => {
            var target = upgradeManager[upg.id];
            //console.log(target);
            if (target != undefined) {
                //target.unlocked = upg.unlocked;
                target.purchased = upg.purchased;
            }
        })
        //#endregion
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