class UpgradeManager {
    elements = []
    constructor() {
        uIManager.effectHeader(this.elements, "upgradesHeader", "Upgrades", "upgradesDivider");
        this.farmInvestments = new Upgrade(
            this,
            "farmInvestments",
            "Farm Investments",
            "The small farms around which birthed this village have provided us with a steady flow of food. Although it is time to encourage further use of the land that we control by providing wood and land to people who wish to work it.",
            function () {
                this.unpurchasable = true;
            },
            [],
            ["farm"]
        );

    }

    unlockUpgrades(city) {
        if (city.projects.farm.amount >= 5 && this.influentialFarmsUnlocked == undefined) {
            this.influentialFarms = new Upgrade(
                this,
                "influentialFarms",
                "Influential Farms",
                "As you have supported the growth of nearby farms, more people have been coming to the city looking for places to sell their crops and gain other services. This influence will allow you to further expand the city and attract more population. +10 influence",
                function () {
                    this.city.items["influence"].amount += 10;
                },
                [],
                ["farm"]
            )
            this.influentialFarmsUnlocked = true;
        }
        if (city.projects.farm.amount >= 25 && this.fallowedFieldsUnlocked == false) {
            this.fallowedFields = new Upgrade(
                this,
                "fallowedFields",
                "Fallowed Fields",
                "Allowing some fields to go fallow through out the year will let them gain nutrients from grazing animals and produce more during cultivated years. This will require 25% fewer farmers to work them.",
                function () {
                    this.editJobs({ name: "farmers", amount: -0.25 });
                    this.efficiency += 0.25;
                },
                [new ItemRef("wood", 10)] /* UpgradeCost */,
                ["farm"] //Which cards this effects.
            );
            this.fallowedFieldsUnlocked = true;
        }
    }

    updateDisplay() {
        this.elements.forEach(ele => ele.set());
    }


}

class Upgrade {
    purchased = false; //When true will be removed from all upgrade lists.
    baseElement; //The element which is Removed() when purchased.
    constructor(uM, id, name, description, effect, costs, targetBuildings) {
        this.uM = uM;
        this.elements = uM.elements;
        this.id = id;
        this.name = name;
        this.description = description;
        this.effect = effect; //A function which activates when purchased.
        this.costs = costs; //A list of Refs passed by the constructor.
        this.targetBuildings = targetBuildings; //A list of strings which tell it which buildings this effect.
        this.createUI();
    }

    createUI() {
        this.baseElement = uIManager.shell(this.elements, this.id + "upgradesShell", undefined, undefined, 4)
        uIManager.dropDown(this.elements, this.id + "dropDown", this.name, this.id + "upgradesShell");
        uIManager.subEffect(this.elements, this.id + "desc", function () { return [this.description] }.bind(this), this.id + "dropDown");
        uIManager.refEffect(this.elements, this.id + "costs", "Costs", function () { return this.costs }.bind(this), this.id + "dropDown");
        uIManager.buildButton(this.elements, this.id + "buyButton", function () { this.purchase(this.targetBuildings) }.bind(this), this.id + "dropDown");
    }

    purchase(targetBuildings) {
        if (gameManager.focusCity.projects.applyCosts(this.costs)) {
            this.purchased = true;
            this.baseElement.remove();
            targetBuildings.forEach((tar) => {
                var index = targetBuildings.indexOf(tar);
                gameManager.cities.forEach((cit) => {
                    this.effect.bind(cit.projects[targetBuildings[index]])();
                })
            })
        }
    }
}