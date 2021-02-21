class Projects {
    producers = []
    elements = []
    constructor(city) {
        this.city = city;
        this.itemDisplay = new ItemDisplay(city, this);
        this.wheatFarm = new WheatFarm(city, this);
        this.granary = new Granary(city, this);
        this.lumberCamp = new LumberCamp(city, this);
        this.housing = new Housing(city, this);
        this.workshop = new Workshop(city, this);
    }

    produce() {
        this.producers.forEach(pro => pro());
    }

    updateElements() {
        this.elements.forEach(ele => ele.set());
    }

    checkCosts(costList) {
        var canBuy = true;
        costList.forEach((cos) => {
            if (this.city.items[cos.itemName].amount < Math.abs(cos.itemAmount)) {
                canBuy = false;
            }
        })
        return canBuy;
    }

    applyCosts(costList) {
        var canBuy = this.checkCosts(costList);
        if (canBuy == true) {
            costList.forEach((cos) => {
                this.city.items[cos.itemName].subtract(cos.itemAmount);
            })
            return true;
        }
        else {
            return false;
        }
    }

    build(project) {
        var canBuild = project.projects.applyCosts(project.cost);
        if (canBuild == true) {
            project.jobs.forEach((job) => {
                job.jobMax += job.jobGrowth;
                job.hire();
            });
        }
        return canBuild;
    }

    refineDelta(prodList, workerList, amount, city) {
        var delta;
        prodList.forEach((pro) => {
            if (pro.amount < 0) {

                if (delta == undefined) {
                    delta = Math.floor(city.items[pro.name].amount / Math.abs(pro.amount));

                }
                else {
                    delta = Math.floor(Math.min(delta, city.items[pro.name].amount / Math.abs(pro.amount)));

                }

            }
            else if (prodList.length == prodList.indexOf(pro) + 1) {
                delta = amount;
            }

        })
        if (workerList.length > 0) {
            workerList.forEach((wor) => {
                delta = Math.floor(Math.min(delta, wor.multiplyByJobsRatio(delta)))
            })
        }
        delta = Math.min(amount, delta);
        return delta;
    }

}

class VariableBlock {
    variables = [];
    constructor(city, projects) {
        this.city = city;
        this.projects = projects;
    }

    job(name, amount) {
        if (this[name] == undefined) {
            this.variables.push(this[name] = new JRef(this.city, name, amount));
        }
        else {
            this[name].amount += amount;
        }
    }

    cost(name, amount) {
        if (this[name] == undefined) {
            this.variables.push(this[name] = new Ref(name, amount));
        }
        else {
            this[name].amount += amount;
        }
    }

    cost(name, amount) {
        if (this[name] == undefined) {
            this.variables.push(this[name] = new PRef(name, amount));
        }
        else {
            this[name].amount += amount;
        }
    }
}

class ItemDisplay {
    elements = []
    constructor(city, projects) {
        this.projects = projects;
        this.elements = projects.elements;
        this.city = city;
        uIManager.shell(this.elements, "itemDisplayShell", undefined, undefined, 2);
        uIManager.dropDown(this.elements, "itemDisplay", "Stocks", "itemDisplayShell");
        uIManager.subEffect(this.elements, "itemDisplayDesc", function () { return ["The items stored within the city"] }.bind(this), "itemDisplay");
        var cityItems = this.city.items;
        for (var i in cityItems) {
            var item = cityItems[i];
            if (item.constructor == cityItems["gold"].constructor) {
                uIManager.subEffect(this.elements, "itemDisplay" + item.name, function () { return [this.name, " :", this.amount + " + per day : " + this.addRate()] }.bind(item), "itemDisplay");
            }
        }
    }
}

class WheatFarm {
    name = "Wheat Farm";
    description = "A plot of land to produce small amounts of wheat, can hardly be described as a farm for now. Harvest occurs during the Harvest season, otherwise the fields will slowly grow wheat to be harvested.";

    //Stats
    fields = 0;
    growthRate = 1;
    growingWheat = 0;
    irrigation = 1;

    constructor(city, projects) {
        this.projects = projects; //The projects which this belongs to.
        this.elements = projects.elements; //The shared elements list which all projects of the same city share.
        this.city = city; //The city which this project belongs to.
        this.jobs = [
            new JRef(this.city, "farmers", 1)
        ]
        this.cost = [
            new Ref("wood", 5, 0)
        ]
        //Create the UI elements which display everything.
        uIManager.shell(this.elements, "wheatFarmShell");
        uIManager.dropDown(this.elements, "wheatFarm", this.name, "wheatFarmShell");
        uIManager.subEffect(this.elements, "wheatFarmDesc", function () { return [this.description] }.bind(this), "wheatFarm");
        uIManager.effectHeader(this.elements, "wheatFarmStats", "Stats", "wheatFarm");
        uIManager.subEffect(this.elements, "wheatFarmFields", function () { return ["Fields :", this.fields] }.bind(this), "wheatFarmStats");
        uIManager.subEffect(this.elements, "wheatFarmInField", function () { return ["Wheat in fields :", this.growingWheat] }.bind(this), "wheatFarmStats");
        uIManager.effectHeader(this.elements, "wheatFarmProduction", "Produces", "wheatFarm");
        uIManager.subEffect(this.elements, "wheatFarmWheatProduction", function () { return ["Growing rate :" + this.growthRate * this.irrigation] }.bind(this), "wheatFarmProduction");
        uIManager.refEffect(this.elements, "wheatFarmTestRef", "Costs", function () { return this.cost }.bind(this), "wheatFarm");
        uIManager.workerEffect(this.elements, "wheatFarmWorkers", "Workers", this.jobs, "wheatFarm");
        uIManager.buildButton(this.elements, "wheatFarmBuy", function () { if (this.projects.build(this)) { this.onBuild() } }.bind(this), "wheatFarm");

        this.projects.producers.push(this.onProduce.bind(this));//Pushes the OnProduce function to Projects, bound to this.
    }

    onBuild() {//Code which is called by BuildButton if you can afford it.
        this.fields += 1;
    }

    onProduce() { //The method that is called each day.
        this.growingWheat += this.growthRate * this.irrigation * this.jobs[0].multiplyByJobsRatio(this.fields);
        if (this.city.weather.season == "harvest") {
            this.city.items.wheat.add(this.growingWheat);
            this.growingWheat = 0;
        }
    }
}

class Granary {
    name = "Granary"; //Name of the project.
    description = "Turns wheat into food."; //Description of the project.

    //#region stats
    amount = 0;
    workRate = 0;
    //#endregion

    constructor(city, projects) {
        this.projects = projects; //The projects which this belongs to.
        this.elements = projects.elements; //The shared elements list which all projects of the same city share.
        this.city = city; //The city which this project belongs to.
        //A list of JRef() which tell it which workers to use.
        this.jobs = [
            this.civil = new JRef(city, "civil", 1)
        ]
        //A list of Ref() which tell it what it costs to make.
        this.cost = [
            this.woodCost = new Ref("wood", 10),
            this.goldCost = new Ref("gold", 3)
        ]
        this.produces = [
            this.foodProd = new PRef("food", 5),
            this.wheatProd = new PRef("wheat", -5)
        ]

        //#region UI creation. Use uIManager to create effects.
        uIManager.shell(this.elements, "granaryShell", undefined, undefined, 2); //Creates the shell which all other UI goes into.
        uIManager.dropDown(this.elements, "granary", this.name, "granaryShell");
        uIManager.subEffect(this.elements, "granaryDesc", function () { return [this.description] }.bind(this), "granary");
        uIManager.effectHeader(this.elements, "granaryStats", "Stats", "granary");
        uIManager.subEffect(this.elements, "granaryAmount", function () { return ["Granaries :", this.amount] }.bind(this), "granaryStats");

        uIManager.productionEffect(this.elements, "granaryProduction", "Production", this.produces, "granary");
        uIManager.refEffect(this.elements, "granaryCost", "Cost", function () { return this.cost }.bind(this), "granary");
        uIManager.workerEffect(this.elements, "granaryWorkers", "Workers", this.jobs, "granary");


        //#endregion
        uIManager.buildButton(this.elements, "granaryBuy", function () { if (this.projects.build(this)) { this.onBuild() } }.bind(this), "granary");
        //#endregion

        //Tells the Projects to activate this when the production Callback happens. Delete this and onProduce to disable.
        this.projects.producers.push(this.onProduce.bind(this));
    }

    onBuild() {//Code which is called by BuildButton if you can afford it.
        this.amount += 1;
    }

    onProduce() {//Called at the end of each day by projects.producers.
        this.foodProd.produce(this.city, this.projects.refineDelta(this.produces, this.jobs, this.amount, this.city));
        this.wheatProd.produce(this.city, this.projects.refineDelta(this.produces, this.jobs, this.amount, this.city));
    }


}

class LumberCamp {
    name = "Lumber camp"; //Name of the project.
    description = "Cuts down and refines trees so they can be made into furniture and housing."; //Description of the project.

    //#region stats
    amount = 0;
    //#endregion

    constructor(city, projects) {
        this.projects = projects; //The projects which this belongs to.
        this.elements = projects.elements; //The shared elements list which all projects of the same city share.
        this.city = city; //The city which this project belongs to.
        //A list of JRef() which tell it which workers to use.
        this.jobs = [new JRef(city, "laborers", 1)]
        //A list of Ref() which tell it what it costs to make.
        this.cost = [
            this.foodCost = new Ref("food", 10)
        ]
        this.produces = [
            this.woodProd = new PRef("wood", 5)
        ]

        //#region UI creation. Use uIManager to create effects.
        uIManager.shell(this.elements, "lumberCampShell"); //Creates the shell which all other UI goes into.
        uIManager.dropDown(this.elements, "lumberCamp", this.name, "lumberCampShell");
        uIManager.subEffect(this.elements, "lumberCampDesc", function () { return [this.description] }.bind(this), "lumberCamp");
        uIManager.effectHeader(this.elements, "lumberCampStats", "Stats", "lumberCamp");
        uIManager.subEffect(this.elements, "lumberCampAmount", function () { return ["Lumber camps :", this.amount] }.bind(this), "lumberCampStats");
        uIManager.productionEffect(this.elements, "lumberCampProduction", "Production", this.produces, "lumberCamp");
        uIManager.refEffect(this.elements, "lumberCampCost", "Cost", function () { return this.cost }.bind(this), "lumberCamp");
        uIManager.workerEffect(this.elements, "lumberCampWorkers", "Workers", this.jobs, "lumberCamp");
        //#region UI effects

        //#endregion
        uIManager.buildButton(this.elements, "lumberCampBuy", function () { if (this.projects.build(this)) { this.onBuild() } }.bind(this), "lumberCamp");
        //#endregion

        //Tells the Projects to activate this when the production Callback happens. Delete this and onProduce to disable.
        this.projects.producers.push(this.onProduce.bind(this));
    }

    onBuild() {//Code which is called by BuildButton if you can afford it.
        this.amount += 1;
    }

    onProduce() {//Called at the end of each day by projects.producers.
        this.woodProd.produce(this.city, this.projects.refineDelta(this.produces, this.jobs, this.amount, this.city));
    }


}

class Housing {
    name = "Housing"; //Name of the project.
    description = "Housing for your citizens."; //Description of the project.

    //#region stats
    amount = 0;
    baseCapacity = 2;
    //#endregion

    constructor(city, projects) {
        this.projects = projects; //The projects which this belongs to.
        this.elements = projects.elements; //The shared elements list which all projects of the same city share.
        this.city = city; //The city which this project belongs to.
        //A list of JRef() which tells it which workers to use.
        this.jobs = []
        //A list of Ref() which tells it what it costs to make.
        this.cost = [new Ref("wood", 10)]
        //A list of PRef() which tells it what to produce, Positive numbers produce it, and negative cost i.
        this.produces = []

        //#region UI creation. Use uIManager to create effects.
        uIManager.shell(this.elements, "housingShell", undefined, undefined, 2); //Creates the shell which all other UI goes into.
        uIManager.dropDown(this.elements, "housing", this.name, "housingShell");
        uIManager.subEffect(this.elements, "housingDesc", function () { return [this.description] }.bind(this), "housing");
        //#region UI effects
        uIManager.effectHeader(this.elements, "housingStats", "Stats", "housing");
        uIManager.subEffect(this.elements, "housingAmount", function () { return ["Houses : ", this.amount] }.bind(this), "housingStats");
        uIManager.subEffect(this.elements, "housingCitizens", function () { return ["Citizens : ", this.baseCapacity * this.amount] }.bind(this), "housing");

        //#endregion
        uIManager.buildButton(this.elements, "housingBuy", function () { if (this.projects.build(this)) { this.onBuild() } }.bind(this), "housing");
        //#endregion

        //Tells the Projects to activate this when the production Callback happens. Delete this and onProduce to disable.
        this.projects.producers.push(this.onProduce.bind(this));
    }

    onBuild() {//Code which is called by BuildButton if you can afford it.
        this.amount += 1;
        this.city.population.unemployed.amount += this.baseCapacity;
    }

    onProduce() {//Called at the end of each day by projects.producers.
    }
}

class Workshop {
    name = "Workshop"; //Name of the project.
    description = "Extensions onto the single family houses of skilled craftsmen."; //Description of the project.

    //#region stats
    hammerGoodness = 0;
    //#endregion

    constructor(city, projects) {
        this.projects = projects; //The projects which this belongs to.
        this.elements = projects.elements; //The shared elements list which all projects of the same city share.
        this.city = city; //The city which this project belongs to.
        //A list of JRef() which tells it which workers to use.
        this.jobs = [new JRef(city, "craftsmen", 1)]
        //A list of Ref() which tells it what it costs to make.
        this.cost = []
        //A list of PRef() which tells it what to produce, Positive numbers produce it, and negative cost it.
        this.produces = []

        //#region UI creation. Use uIManager to create effects.
        uIManager.shell(this.elements, "workshopShell", undefined, undefined, 2); //Creates the shell which all other UI goes into.
        uIManager.dropDown(this.elements, "workshop", this.name, "workshopShell");
        uIManager.subEffect(this.elements, "workshopDesc", function () { return [this.description] }.bind(this), "workshop");
        //#region UI effects

        //#endregion
        uIManager.buildButton(this.elements, "workshopBuy", function () { if (this.projects.build(this)) { this.onBuild() } }.bind(this), "workshop");
        //#endregion

        //Tells the Projects to activate this when the production Callback happens. Delete this and onProduce to disable.
        this.projects.producers.push(this.onProduce.bind(this));
    }

    onBuild() {//Code which is called by BuildButton if you can afford it.

    }

    onProduce() {//Called at the end of each day by projects.producers.
    }
}