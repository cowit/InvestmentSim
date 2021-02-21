class Items {
    constructor() {
        this.gold = new Item("gold", 5, true);
        this.food = new Item("food", 20, true);
        this.wheat = new Item("wheat", 25, true);
        this.wood = new Item("wood", 25, true);
    }
}

class Item {
    parent; //What contains this item
    rateList = [];
    constructor(name, amount, isUnlocked = false) {
        this.isUnlocked = isUnlocked; //Defaults to false, Locked items will not be displayed but will exist.
        this.name = name;
        this.amount = amount;
    }
    add(value) {
        this.amount = this.amount + value;
    }
    subtract(value) {
        this.amount = this.amount - value;
    }
    addRate() {
        var rate = 0;
        this.rateList.forEach((rates) => {
            rate += rates.rate;

        });
        return rate;
    }
}

class Ref {
    rateCount = 0;
    constructor(itemName, itemAmount, itemRate = 0) {
        this.itemName = itemName;
        this.itemAmount = itemAmount;
        this.itemRate = itemRate;
    }
}

class JRef {
    constructor(city, jobName, jobGrowth, jobMax = 0, jobAmount = 0) {
        this.city = city;
        this.jobName = jobName;
        this.jobGrowth = jobGrowth;
        this.jobMax = jobMax;
        this.jobAmount = jobAmount;
    }

    multiplyByJobsRatio(multiplyBy) {
        var amount = this.jobAmount / this.jobMax;
        if (amount >= 0) {
            return Math.floor(multiplyBy * amount);
        }
        else {
            return 0;
        }
    }

    hire() {
        if (this.city.population["unemployed"].amount >= this.jobGrowth && this.jobAmount < this.jobMax) {
            this.city.population["unemployed"].amount -= this.jobGrowth;
            this.city.population[this.jobName].amount += this.jobGrowth;
            this.jobAmount += this.jobGrowth;
        }
    }

    fire() {
        if (this.jobAmount > 0) {
            this.city.population[this.jobName].amount -= this.jobGrowth;
            this.city.population["unemployed"].amount += this.jobGrowth;
            this.jobAmount -= this.jobGrowth;
        }
    }
}

class ItemElementPackage {
    constructor(name, storage, cityStorage) {
        this.name = name;
        this.storage = storage;
        this.cityStorage = cityStorage;
    }
}

class PRef {
    max = 0;
    rateObj;
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }

    produce(city, delta) {
        var total = this.amount * delta;
        if (this.rateObj == undefined) {
            this.rateObj = new RateRef();
            city.items[this.name].rateList.push(this.rateObj);
        }
        this.rateObj.rate = total;
        this.rateObj.name = this.name;
        city.items[this.name].add(total);
    }
}

class RateRef {
    name;
    rate = 0;
}
