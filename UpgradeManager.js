class UpgradeManager {
    elements = []
    constructor() {
        uIManager.shell(this.elements, "upgradesShell", "Upgrades", undefined, 4)
        this.fallowedFields = new Upgrade(
            this,
            "fallowedFields",
            "Fallowed Fields",
            "Allowing some fields to go fallow through out the year will let them gain nutrients from grazing animals and produce more during cultivated years. This will require 25% fewer farmers to work them.",
            function () {
                this.editJobs("farmers", -0.25)
                this.efficiency += 0.25;
            },
            [new Ref("wood", 10)] /* UpgradeCost */,
            ["farm"] //Which cards this effects.
        );
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
        this.baseElement = uIManager.dropDown(this.elements, this.id + "dropDown", this.name, "upgradesShell");
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
                    console.log(cit.projects[targetBuildings[index]]);
                    this.effect.bind(cit.projects[targetBuildings[index]])();
                })
            })
        }
    }
}