class Projects {
    producers = []
    elements = []
    constructor(city) {
        this.city = city;
        this.itemDisplay = new ItemDisplay(city, this);
        //#region landManagement
        this.landManagement = new Project(
            {
                projectName: "Land Management", //Displayed name.
                projectDescription: "The land administered by this city. The amount you control is increased by your influence. Each piece of land needs additional influence.", //The displayed description of the project.
                nameOfAmount: "Projects", //The name of each individual purchase.
                projectId: "landManagement", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "stats", //The column which this is put into.
                unpurchasable: false, //Will hide the amount and buy button elements if false.
                unlocked: false,
                jobList: [], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [], //Put a Ref in to tell it what this costs. 
                functionsList: [
                    {
                        callBack: "onStart",
                        onCall: function () {
                            this.land = 51;
                            this.influencedLand = 1;
                            this.city.items.influence = new Item("influence", "Influence", 0, true, false);
                        }
                    },
                    {
                        callBack: "onProduce", //onStart onProduce onBuild
                        onCall: function () {
                            var effect = Math.max(0, Math.floor(((this.city.items["influence"].amount / this.influencedLand) - this.influencedLand)));
                            if (effect != NaN) {
                                this.influencedLand += effect;
                                this.land += effect;
                            }

                        }
                    },
                ], //Put functions inside of here to create more functionality.
                uIList: [
                    {
                        effectName: "SubEffect",
                        name: "land",
                        onSet: function () { return ["Available Land Area : ", this.land] }
                    },
                    {
                        effectName: "SubEffect",
                        name: "influence",
                        onSet: function () { return ["Influence Accrued in surrounding areas :", this.city.items["influence"].amount] }
                    }
                ], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region waterManagement
        this.waterManagement = new Project(
            {
                projectName: "Water Management", //Displayed name.
                projectDescription: "An overview of the wells and other sources of water that provide the city with what it needs to survive.", //The displayed description of the project.
                nameOfAmount: "Wells", //The name of each individual purchase.
                projectId: "waterManagement", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "stats", //The column which this is put into.
                unpurchasable: true, //Will hide the amount and buy button elements if false.
                jobList: [
                    { name: "civil", exName: "Water Carrier", amount: 1, production: [new ItemRef("water", 1)] }
                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [], //Put a Ref in to tell it what this costs. 
                functionsList: [], //Put functions inside of here to create more functionality.
                uIList: [], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region farm
        this.farm = new Project(
            {
                projectName: "Farm", //Displayed name.
                projectDescription: "A plot of land worked by a farmer to feed themselves and the city.", //The displayed description of the project.
                nameOfAmount: "Fields", //The name of each individual purchase.
                projectId: "farm", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 0.5, //Base efficiency of the project which effects all output.
                column: "sLand", //The column which this is put into.
                unpurchasable: false, //Will hide the amount and buy button elements if false.
                unlocked: true,
                jobList: [
                    { name: "farmers", exName: "Farmers", amount: 1, production: [new ItemRef("food", 1)] }
                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [
                    new ItemRef("wood", 10)
                ], //Put a Ref in to tell it what this costs. 
                functionsList: [], //Put functions inside of here to create more functionality.
                uIList: [], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        this.farm.onBuild(4);
        this.farm.jobs[0].hire();
        this.farm.jobs[0].hire();
        this.farm.jobs[0].hire();
        this.farm.jobs[0].hire();
        //#endregion
        //#region Housing
        this.housing = new Project(
            {
                projectName: "Housing", //Displayed name.
                projectDescription: "Where the citizens live, and some work. Allows the population to very slowly grow using surplus food.", //The displayed description of the project.
                nameOfAmount: "Houses", //The name of each individual purchase.
                projectId: "housing", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "city", //The column which this is put into.
                unpurchasable: false, //Will hide the amount and buy button elements if false.
                unlocked: false,
                jobList: [], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [
                    new ItemRef("wood", 10)
                ], //Put a Ref in to tell it what this costs. 
                functionsList: [
                    {
                        callBack: "onStart", //onStart onProduce onBuild
                        onCall: function () {
                            this.growthRate = 3;
                        }
                    },
                    {
                        callBack: "onProduce",
                        onCall: function () {
                            if (this.storedFood == undefined) {
                                this.storedFood = 0;
                            }
                            if (this.city.items["food"].addRate() > 1) {
                                this.storedFood += Math.min(Math.floor(this.city.items["food"].amount * (this.growthRate / 100)), this.city.population.sum());
                            }
                            if (this.storedFood > this.city.population.sum()) {
                                this.storedFood -= this.city.population.sum();
                                this.city.population["unemployed"].amount += 1;
                            }
                        }
                    }
                ], //Put functions inside of here to create more functionality.
                uIList: [
                    {
                        effectName: "SubEffect",
                        name: "Growth",
                        onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] }
                    },
                    {
                        effectName: "SubEffect",
                        name: "GrowthRate",
                        onSet: function () { return ["Growth rate: ", this.growthRate + "% of stored food"] }
                    }
                ], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region woodlands
        this.woodlands = new Project(
            {
                projectName: "Woodlands", //Displayed name.
                projectDescription: "A few small forests on the outskirts of the city which supply us lumber. We can slowly reclaim the land by chopping it down and building there. Giving it plenty of surplus land will allow it to regrow.", //The displayed description of the project.
                nameOfAmount: "Acres", //The name of each individual purchase.
                projectId: "woodlands", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "sLand", //The column which this is put into.
                unpurchasable: false, //Will hide the amount and buy button elements if false.
                jobList: [
                    { name: "laborers", exName: "Laborers", amount: 1, production: [new ItemRef("wood", 1)] }
                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [
                    new ItemRef("food", 25)
                ], //Put a Ref in to tell it what this costs. 
                functionsList: [
                    {
                        callBack: "onStart",
                        onCall: function () {
                            this.totalWood = 10000;
                            this.nextLand = 0;
                        }
                    },
                    {
                        callBack: "onProduce",
                        onCall: function () {
                            this.totalWood -= this.lastProduced;
                            this.nextLand += this.lastProduced;

                            if (this.totalWood <= 0) {
                                this.efficiency = 0;
                            }

                            if (this.nextLand >= 50) {
                                //Increase Land by 1.
                                this.land.land += 1;
                                this.nextLand -= 10;
                            }

                            if (this.jobs[0].max < this.totalWood / 1000) {
                                this.onBuild(10);
                            }
                        }
                    }
                ], //Put functions inside of here to create more functionality.
                uIList: [
                    {
                        effectName: "SubEffect",
                        name: "totalWood",
                        onSet: function () { return ["Harvestable Wood : ", this.totalWood] }
                    }
                ], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region quarry
        this.quarry = new Project(
            {
                projectName: "Quarry", //Displayed name.
                projectDescription: "A pit dug deep into the earth. A ring of stairs carved into the edges which allow the workers to carry stone, clay, and other materials to the surface.", //The displayed description of the project.
                nameOfAmount: "depth", //The name of each individual purchase.
                projectId: "quarry", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 0.5, //Base efficiency of the project which effects all output.
                column: "sLand", //The column which this is put into.
                unlocked: false,
                unpurchasable: true, //Will hide the amount and buy button elements if false.
                jobList: [{ name: "laborers", exName: "Laborers", amount: 3, production: [new ItemRef("stone", 1), new ItemRef("clay", 0.2)] }], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [new ItemRef("ironTools", 20), iRef("gold", 50)], //Put a Ref in to tell it what this costs. 
                functionsList: [], //Put functions inside of here to create more functionality.
                uIList: [], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region marketQuarter
        this.marketQuarter = new Project(
            {
                projectName: "Market Quarter", //Displayed name.
                projectDescription: "A central section of street in the city which allows merchants to set up stalls. They usually occur once or twice weekly and allow citizens to buy food and luxuries.", //The displayed description of the project.
                nameOfAmount: "Stalls", //The name of each individual purchase.
                projectId: "marketQuarter", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "city", //The column which this is put into.
                unpurchasable: true, //Will hide the amount and buy button elements if false.
                unlocked: false,
                jobList: [
                    { name: "merchants", exName: "Food Merchant", amount: 1, production: [new ItemRef("food", 3), new ItemRef("gold", -1), new ItemRef("influence", 1)], merchant: true },
                    { name: "merchants", exName: "Wood Merchant", amount: 1, production: [new ItemRef("wood", 3), new ItemRef("gold", -1), new ItemRef("influence", 1)], merchant: true }

                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [
                    new ItemRef("wood", 5)
                ], //Put a Ref in to tell it what this costs. 
                functionsList: [
                    {
                        callBack: "onStart",
                        onCall: function () {
                        }
                    }
                ], //Put functions inside of here to create more functionality.
                uIList: [], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region artisans
        this.artisans = new Project(
            {
                projectName: "Artisans", //Displayed name.
                projectDescription: "The various artisans, carpenters, blacksmiths, and other skilled workers who create the finished goods that are the true lifeblood of a city.", //The displayed description of the project.
                nameOfAmount: "Shops", //The name of each individual purchase.
                projectId: "artisans", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "city", //The column which this is put into.
                unpurchasable: true, //Will hide the amount and buy button elements if false.
                unlocked: false,
                jobList: [
                    //Should be added using an upgrade and unlock Iron at the same time
                    { name: "skilled", exName: "Potter", amount: 1, production: [new ItemRef("pottery", 0.1), new ItemRef("wood", -1), new ItemRef("clay", -1)] }
                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [new ItemRef("gold", 25)], //Put a Ref in to tell it what this costs. 
                functionsList: [], //Put functions inside of here to create more functionality.
                uIList: [], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
        //#region aqueduct
        this.aqueduct = new Project(
            {
                projectName: "Aqueduct", //Displayed name.
                projectDescription: "A massive, miles long stretch of stone waterways which transport water from far away directly into the city and surrounding  countryside\
                The need for a complete path all the way to the next closest source of water will require a massive investment in labor and resources.", //The displayed description of the project.
                nameOfAmount: "Completed", //The name of each individual purchase.
                projectId: "aqueduct", //The internal name for the project. Shared with the property name it belongs to.
                baseEfficiency: 1, //Base efficiency of the project which effects all output.
                column: "greatProjects", //The column which this is put into.
                unpurchasable: false, //Will hide the amount and buy button elements if false.
                unlocked: false,
                jobList: [{
                    name: "civil",
                    exName: "Civil Builder",
                    amount: 0,
                    production: [
                        iRef("aqueductProgress", 0.1, new Item("aqueductProgress", "Aqueduct Progress", 0, true, false)),
                        iRef("stone", 10),
                        iRef("gold", 3)
                    ],
                    baseAmount: 10
                },
                { name: "civil", exName: "Maintence Workers", amount: 1, production: [new ItemRef("water", 50)] }
                ], //Put an object literal in { name: "farmers", amount: 1, production: [new ItemRef("food", 1)] }
                costList: [], //Put a Ref in to tell it what this costs. 
                functionsList: [
                    {
                        callBack: "onProduce", //onStart onProduce onBuild
                        onCall: function () {
                            if (getItem("aqueductProgress").amount >= 100) {
                                this.onBuild();
                                getItem("aqueductProgress").amount = 0;
                            }
                        }
                    },
                ], //Put functions inside of here to create more functionality.
                uIList: [
                    {
                        effectName: "SubEffect",
                        name: "completedAqueducts",
                        onSet: function () { return ["Completed : " + this.amount] }
                    },
                    {
                        effectName: "SubEffect",
                        name: "progressAqueducts",
                        onSet: function () { return ["Progress : " + prettyDecimal(getItem("aqueductProgress").amount) + " / 100"] }
                    }
                ], //Put UI templates in to create them.               
                //effectName: "SubEffect",
                //name: "Growth",
                //onSet: function () { return ["Growth: ", this.storedFood, " / ", this.city.population.sum()] } 
                city: city, //The city which this belongs to.
                projects: this //The projects which created it.
            }
        )
        //#endregion
    }

    //#region methods
    //Unlock method which uses certain keywords to unlock projects such as "workshop" would require a workshop to be built etc.

    produce() {
        this.producers.forEach(pro => pro());
    }

    updateElements() {
        this.elements.forEach(ele => ele.set());
    }

    checkCosts(costList) {
        var canBuy = true;
        costList.forEach((cos) => {
            if (cos.name == "land") {
                if (this.city.projects.landManagement.land < Math.abs(cos.amount)) {
                    canBuy = false;
                }
            }
            else if (this.city.items[cos.name].amount < Math.abs(cos.amount)) {
                canBuy = false;
            }
        })
        return canBuy;
    }

    applyCosts(costList) {
        var canBuy = this.checkCosts(costList);
        if (canBuy == true) {
            costList.forEach((cos) => {
                if (cos.name == "land") {
                    this.city.projects.landManagement.land -= cos.amount;
                }
                else {
                    this.city.items[cos.name].subtract(cos.amount);
                }
            })
            return true;
        }
        else {
            return false;
        }
    }

    //#endregion

}

class ItemDisplay {
    elements = []
    constructor(city, projects) {
        this.projects = projects;
        this.elements = projects.elements;
        this.city = city;
        for (var i in city.items) {
            var item = city.items[i];
            if (item.displayInStocks == true) {
                this.elements.push(new ItemDisplayRef(item));
            }
        }
    }
}

class Project {
    //#region stats
    efficiency = 1;
    amount = 0;
    lastProduced = 0;
    //#endregion

    constructor(conObj) {
        if (conObj.unlocked == true) {
            this.unlocked = true;
        }
        else {
            this.unlocked = false;
        }
        this.name = conObj.projectName; //Name of the project.
        this.description = conObj.projectDescription; //Description of the project.
        this.nameOfAmount = conObj.nameOfAmount;
        this.projects = conObj.projects; //The projects which this belongs to.
        this.elements = conObj.projects.elements; //The shared elements list which all projects of the same city share.
        this.city = conObj.city; //The city which this project belongs to.
        var projectId = conObj.projectId;
        this.projectId = projectId;
        this.efficiency = conObj.baseEfficiency;
        this.column = conObj.column;
        this.unpurchasable = conObj.unpurchasable;
        this.land = conObj.projects["landManagement"];
        //A list of JRefs() which determine which workers make what.
        this.jobs = [];
        conObj.jobList.forEach((job) => {
            this.editJobs(job);
        })
        //A list of Ref() which tells it what it costs to make.
        this.costs = conObj.costList;
        this.buildFunctions = []
        this.produceFunctions = []
        conObj.functionsList.forEach((fun) => {
            if (fun.callBack == "onBuild") {
                this.buildFunctions.push(fun.onCall.bind(this));
            }
            else if (fun.callBack == "onProduce") {
                this.produceFunctions.push(fun.onCall.bind(this));
            }
            else if (fun.callBack == "onStart") {
                fun.onCall.bind(this)();
            }
        })

        //#region UI creation. Use uIManager to create effects.
        this.shell = uIManager.shell(this.elements, projectId + "Shell", undefined, undefined, this.column); //Creates the shell which all other UI goes into.
        uIManager.dropDown(this.elements, projectId, this.name, projectId + "Shell");
        uIManager.subEffect(this.elements, projectId + "Desc", function () { return [this.description] }.bind(this), projectId);
        this.amountEffect = uIManager.subEffect(this.elements, projectId + "Amount", function () { return [this.nameOfAmount + " : " + this.amount] }.bind(this), projectId);
        //#region UI effects
        conObj.uIList.forEach((uI) => {
            if (uI.effectName == "SubEffect") {
                uIManager.subEffect(this.elements, projectId + uI.name, uI.onSet.bind(this), projectId);
            }
        })
        //#endregion
        uIManager.jobRefEffect(this.elements, projectId, "Workers", this.jobs, projectId)
        this.costsRef = uIManager.refEffect(this.elements, projectId + "Costs", "Costs", function () { return this.costs }.bind(this), projectId);
        this.buyButton = uIManager.buildButton(this.elements, projectId + "Buy", function () { if (this.projects.applyCosts(this.costs)) { this.onBuild() } }.bind(this), projectId);
        if (this.unpurchasable == false) {
            this.buyButton.closeButton();
            this.amountEffect.closeEffect();
            this.costsRef.close();
        }

        //#endregion

        //Tells the Projects to activate this when the production Callback happens. Delete this and onProduce to disable.
        this.projects.producers.push(this.onProduce.bind(this));
    }

    onBuild(amount = 1) {//Code which is called by BuildButton if you can afford it.
        amount = Math.min(this.land.land, amount);
        for (let index = 0; index < amount; index++) {
            this.amount += 1;
            this.land.land -= 1;
            this.jobs.forEach(job => job.onBuild());
            this.buildFunctions.forEach(fun => fun());
        }
    }

    onProduce() {//Called at the end of each day by projects.producers.
        if (this.unlocked == true) {
            this.jobs.forEach(job => job.produce());
            this.produceFunctions.forEach(fun => fun());
            if (this.unpurchasable == false) {
                this.buyButton.closeButton();
                this.amountEffect.closeEffect();
                this.costsRef.close();
            }
            else {
                this.buyButton.openButton();
                this.amountEffect.openEffect();
                this.costsRef.open();
            }
        }

        if (this.unlocked == true) {
            this.shell.open();
        }
        else {
            this.shell.close();
        }

    }

    editJobs(jobObj) {
        var emptyList = true;
        this.jobs.forEach((job) => {
            emptyList = false;
            if (job.name == jobObj.name && jobObj.exName == job.exName) {
                job.growth += jobObj.amount;
                if (jobObj.production != undefined) {
                    job.productList.forEach((pro) => {
                        var index = job.productList.indexOf(pro);
                        if (pro.name == jobObj.production[index].name) {
                            pro.amount += jobObj.production[index].amount;
                        }
                        else {
                            job.productList.push(jobObj.production[index]);
                        }
                    })

                }
            }
            else {
                var ref = new JRef(this.city, this, jobObj.name, jobObj.exName, jobObj.amount, jobObj.production, jobObj.baseAmount);
                if (jobObj.merchant == true) {
                    ref.merchant = true;
                }
                this.jobs.push(ref);
            }
        })

        if (emptyList == true) {
            var ref = new JRef(this.city, this, jobObj.name, jobObj.exName, jobObj.amount, jobObj.production, jobObj.baseAmount);
            if (jobObj.merchant == true) {
                ref.merchant = true;
            }
            this.jobs.push(ref);
        }
    }

}
