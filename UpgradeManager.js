class UpgradeManager {
    elements = []
    upgrades = []
    tutorial = true;
    constructor() {
        //#region upgrades
        this.farmInvestments = new Upgrade(
            this,
            "farmInvestments",
            "Farm Investments",
            [
                "The small farms around which birthed this village have provided us with a steady flow of food.",
                "Although it is time to encourage further use of the land that we control by providing wood and land to people who wish to work it.",
                "Purchasing this will allow us to create more farms."
            ],
            function () {
                this.unpurchasable = true;
            },
            [],
            ["farm"],
        );
        this.dropDownTutorial = new Upgrade(
            this,
            "dropDownTutorial",
            "Tutorial",
            ["Clicking on the names of various cards will close them so you can more easily focus on other cards."],
            function () {
            },
            [/*new Ref("wood", 10)*/] /* UpgradeCost */,
            ["farm"] //Which cards this effects.
        );
        this.encourageWood = new Upgrade(
            this,
            "encourageWood",
            "Encourage Clearing of Forests",
            [
                "To continue investing in to our farm lands we will need additional wood to supply farmers.",
                "By removing restrictions on who can clear woodlands and placing a tax on it we can ensure we have a steady supply of lumber for future use. Along with clearing land"
            ],
            function () {
                getProject("woodlands").unlocked = true;
            },
            [/*new Ref("wood", 10)*/] /* UpgradeCost */,
            ["global"] //Which cards this effects. "global" will simply call it in it's own context.
        );
        this.housingUnlock = new Upgrade(
            this,
            "housingUnlock",
            "Housing in the City",
            [
                "The increased amount of food coming into the city has also increased the number of citizens being born and alleviated many of the famines we have had.",
                "We should begin constructing more housing to ensure that the population is encouraged to continue growing and allowing us to expand our power."
            ],
            function () {
                getProject("housing").unlocked = true;
            },
            [/*new Ref("wood", 10)*/] /* UpgradeCost */,
            ["global"] //Which cards this effects.
        );
        this.influentialFarms = new Upgrade(
            this,
            "influentialFarms",
            "Influential Farms",
            [
                "As you have supported the growth of nearby farms, more people have been coming to the city looking for places to sell their crops and gain other services.",
                "This influence will allow you to further expand the city and attract more population.",
                "Gain +10 influence"
            ],
            function () {
                getItem("influence").amount += 10;
                getProject("landManagement").unlocked = true;
            },
            [],
            ["global"],
        );
        this.fallowedFields = new Upgrade(
            this,
            "fallowedFields",
            "Fallowed Fields",
            [
                "Allowing some fields to go fallow through out the year will let them gain nutrients from grazing animals and produce more during cultivated years.",
                "This will require 25% fewer farmers to work them."
            ],
            function () {
                this.editJobs({ name: "farmers", amount: -0.25 });
                this.efficiency += 0.25;
            },
            [new ItemRef("wood", 10)] /* UpgradeCost */,
            ["farm"], //Which cards this effects.
        );
        this.marketCharter = new Upgrade(
            this,
            "marketCharter",
            "Petition Noble for Market Charter",
            [
                "Gaining a market charter would allow us to open a local market. Allowing us to profit from sold goods and to easily gain other resources.",
                "Our rapid growth and strategic position on a crossroads should make our petition easy to pass once we bring it up with the local noble",
                "Although a small tribute of grain will assure it will be granted in a timely manner.",

            ], //This will add a line break between each item in the list.
            function () {
                getProject("marketQuarter").unlocked = true;
            },
            [new ItemRef("food", 50)] /* UpgradeCost */,
            ["global"] //Which cards this effects.
        );
        //#endregion
    }

    unlockUpgrades() {
        if (this.tutorial == true)
            this.dropDownTutorial.unlock();
        this.farmInvestments.unlock();
        if (getProject("farm").amount >= 5) {
            this.influentialFarms.unlock();
        }

        if (getProject("farm").amount >= 5) {
            this.housingUnlock.unlock();
        }

        if (getItem("wood").amount <= 20) {
            this.encourageWood.unlock();
        }

        if (getProject("farm".amount >= 15)) {
            this.fallowedFields.unlock();
        }

        if (getPop("total") >= 20) {
            this.marketCharter.unlock();
        }

    }

    updateDisplay() {
        this.elements.forEach(ele => ele.set());
    }


}

class Upgrade {
    purchased = false; //When true will be removed from all upgrade lists.
    baseElement; //The element which is Removed() when purchased.
    unlocked = false;
    constructor(uM, id, name, description, effect, costs, targetBuildings) {
        this.uM = uM; //Upgrade Manager.
        this.elements = uM.elements;
        this.id = id;
        this.name = name;
        this.description = description;
        this.effect = effect; //A function which activates when purchased.
        this.costs = costs; //A list of Refs passed by the constructor.
        this.targetBuildings = targetBuildings; //A list of strings which tell it which buildings this effect.
    }

    unlock() {
        if (!this.unlocked) {
            this.createUI();
        }
        this.unlocked = true;
    }

    createUI() {
        this.baseElement = uIManager.shell(this.elements, this.id + "upgradesShell", undefined, undefined, 4).wrapperE;
        uIManager.dropDown(this.elements, this.id + "dropDown", this.name, this.id + "upgradesShell");
        uIManager.subEffect(this.elements, this.id + "desc", function () { return this.description }.bind(this), this.id + "dropDown", true);
        uIManager.refEffect(this.elements, this.id + "costs", "Costs", function () { return this.costs }.bind(this), this.id + "dropDown");
        uIManager.buildButton(this.elements, this.id + "buyButton", function () { this.purchase(this.targetBuildings) }.bind(this), this.id + "dropDown");
    }

    purchase(targetBuildings) {
        if (gameManager.focusCity.projects.applyCosts(this.costs)) {
            this.purchased = true;
            this.baseElement.remove();
            if (this.targetBuildings[0] == "global") {
                this.effect();
            }
            else {
                targetBuildings.forEach((tar) => {
                    var index = targetBuildings.indexOf(tar);
                    gameManager.cities.forEach((cit) => {
                        this.effect.bind(cit.projects[targetBuildings[index]])();
                    })
                })
            }

        }
    }
}