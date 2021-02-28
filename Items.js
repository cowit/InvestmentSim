class Items {
    constructor() {
        this.gold = new Item("gold", 5, true);
        this.food = new Item("food", 20, true);
        this.wheat = new Item("wheat", 25, true);
        this.wood = new Item("wood", 25, true);
        this.water = new Item("water", 20, true);
    }
}

class Item {
    parent; //What contains this item
    rateList = [];
    constructor(name, amount, isUnlocked = false, displayInStocks = true) {
        this.isUnlocked = isUnlocked; //Defaults to false, Locked items will not be displayed but will exist.
        this.name = name;
        this.amount = amount;
        this.displayInStocks = displayInStocks;
    }
    add(value) {
        if (this.amount + value >= 0) {
            this.amount = this.amount + value;
        }
    }
    subtract(value) {
        if (this.amount - value > 0) {
            this.amount = this.amount - value;
        }
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
    rateList = {};
    max = 0;
    merchant = false;
    buying = true;
    constructor(city, project, name, exName, growth, productList /* A list of objects {name: "food", amount: 1}*/) {
        this.city = city;
        this.name = name; //The name of the job this targets.
        this.exName = exName;
        this.growth = growth; //How many max jobs are added each time this is upgraded.
        this.project = project;
        this.max = growth * project.amount; //Multiplies growth by the number of purchased projects.
        this.amount = 0;
        this.productList = productList; //A list of objects {name: "food", amount: 1}
        for (let index = 0; index < project.amount; index++) {
            this.hire();
        }
    }

    onBuild() {
        this.max = Math.ceil(this.growth * this.project.amount);
        this.hire();
    }

    produce() {

        this.max = Math.ceil(this.growth * this.project.amount);
        while (this.amount > this.max) {
            this.fire();
        }
        var canProduce = true;
        this.productList.sort((a, b) => (b.amount - a.amount))
        this.productList.forEach((pro) => {
            if (pro.amount < 0) {
                if (Math.abs(pro.amount) > this.city.items[pro.name].amount) {
                    canProduce = false;
                }
            }
        })

        this.productList.forEach((pro) => {
            var total = 0;
            if (canProduce == true) {
                total = (this.amount * pro.amount) * this.project.efficiency;
            }
            if (total == undefined || total == NaN) {
                total = 0;
            }
            if (this.rateList[pro.name] == undefined) {
                this.rateList[pro.name] = new RateRef();
                this.city.items[pro.name].rateList.push(this.rateList[pro.name]);
            }
            this.rateList[pro.name].rate = total;
            this.rateList[pro.name].name = pro.name;
            this.project.lastProduced = total;
            //console.log(pro.amount + ":" + this.name);
            this.city.items[pro.name].add(total);
        })


    }

    swap() {
        this.productList.forEach((pro) => {
            if (pro.name != "influence") {
                if (pro.amount > 0) {
                    pro.amount -= pro.amount * 2;
                }
                else {
                    pro.amount = Math.abs(pro.amount);
                }
            }
        })
    }

    hire(calledByFire = false) {
        //console.log("Hire Log " + "Buying: " + this.buying + " Called by fire: " + (calledByFire == true));
        if (this.buying || calledByFire == true) {
            if (this.city.population["unemployed"].amount >= 1 && this.amount < this.max) {
                this.city.population["unemployed"].amount -= 1;
                this.city.population[this.name].amount += 1;
                //#region Function which allows the Pop reference to see where jobs are placed. So they can be removed randomly when a pop dies.
                this.city.population[this.name].jobs.forEach((job) => {
                    var exists = false;
                    if (job != this) {
                        exists = true;
                    }
                    if (exists == true) {
                        this.city.population[this.name].jobs.push(this);
                    }
                })
                //#endregion
                this.amount += 1;
            }
        }
        else if (this.merchant) {
            if (this.buying == false) {
                this.fire(true);
            }
        }
    }

    fire(calledByHire = false) {
        //console.log("Fire Log " + "Buying: " + this.buying + " Called by hire: " + (calledByHire == true));
        if (this.buying || calledByHire == true) {
            if (this.amount > 0) {
                this.city.population[this.name].amount -= 1;
                this.city.population["unemployed"].amount += 1;
                this.amount -= 1;
                if (this.amount == 0 && this.buying == true) {
                    this.buying = false;
                    this.swap();
                }
                else if (this.amount == 0 && this.buying == false) {
                    this.buying = true;
                    this.swap();
                }
            }

        }
        else if (this.merchant) { //Will increase the amount hired and swap the effects. Switching it to selling mode.
            this.hire(true);
        }

    }
}


class ItemRef {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }

    produce(city, multiplier) {
        var total = this.amount * multiplier;
        if (this.rateObj == undefined) {
            this.rateObj = new RateRef();
            city.items[this.name].rateList.push(this.rateObj);
        }
        this.rateObj.rate = total;
        this.rateObj.name = this.name;
        var success = total >= 0 || Math.abs(total) <= city.items[this.name].amount;
        if (success) {
            city.items[this.name].add(total);
        }
        return success;
    }


}

class RateRef {
    name;
    rate = 0;
}
