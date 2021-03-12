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
                "Purchasing this will allow us to create more farms.",
                "(You can also assign farmers to the farm by clicking the plus/minus buttons next to their name!)"
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
                "Although a small tribute will assure it will be granted in a timely manner.",

            ], //This will add a line break between each item in the list.
            function () {
                getProject("marketQuarter").unlocked = true;
            },
            [new ItemRef("wood", 50)] /* UpgradeCost */,
            ["global"] //Which cards this effects.
        );
        this.marketTutorial = new Upgrade(
            this,
            "marketTutorial",
            "Tutorial: Markets",
            [
                "Markets are an important tool for managing production and making your city wealthy and influential. One of the keys to fully taking advantage of the market is the fact that gold isn't valuable on it's own.",
                "The main purpose of gold is to use to buy things that you can use to expand your true wealth (although having a stockpile is not a bad thing!)",
                "Increasing the amount of merchants for a product will mean they purchase more of it and use an equivalent amount more gold. Decreasing the amount below 0 will instead cause them to sell the item in question and gain gold in exchange.",
                "Consider selling wood in exchange for food as it has a much better gather rate than farms!",
                "(PS. markets create influence whether they are buying or selling. You are still becoming more well known when you sell items!)"
            ], //This will add a line break between each item in the list.
            function () {
            },
            [/*new Ref("wood", 10)*/] /* UpgradeCost */,
            [/*"workshop"*/] //Which cards this effects.
        );
        //#region artisanGrowth
        this.artisanGrowth = new Upgrade(
            this,
            "artisanGrowth",
            "Growth of Artisans",
            [
                "Now that the city has gained the rights to host a market and thus allowed us to have more access to goods, the small amount of artisans which produced barely more than what was needed for the townsfolk now see they can easily sell excess wares.",
                "Along with existing shops growing to try to make more, new shops have been constructed around the burgening market. As more traders flow through and new opportunities arise, more and more stalls will open and allow for a greater profit.",
                "This will require a greater movement of wood along with any raw materials needed."
            ], //This will add a line break between each item in the list.
            function () {
                getProject("artisans").unlocked = true;
            },
            [iRef("wood", 25)] /* UpgradeCost */,
            ["global"] //Which cards this effects.
        );
        //#endregion
        //#region irrigation
        this.irrigation = new Upgrade(
            this,
            "irrigation",
            "Irrigation",
            [
                "It's been long known that supplying crops with additional water allows them to grow larger. Allowing better harvests each year with less work.",
                "While some can use rivers to feed their hungry fields we will need a large supply of water. Although some small scale irrigation from wells",
                "Allows farmers to use water to greatly increase yields."
            ], //This will add a line break between each item in the list.
            function () {
                this.editJobs({ name: "farmer", exName: "Irrigated", amount: 1, production: [iRef("food", 2), iRef("water", -1)] })
            },
            [iRef("wood", 50)] /* UpgradeCost */,
            ["farm"] //Which cards this effects.
        );
        //#endregion
        //#region unlockAqueduct
        this.unlockAqueduct = new Upgrade(
            this,
            "unlockAqueduct",
            "Water water everywhere",
            [
                "The thirsty citizens and farms have been crying out in need. Simply adding more wells will not do to meet the rising demands. Something far larger and efficient will be needed.",
                "Although not common to see, the technology we need is already known. We must construct a system of aqueducts so that we can meet our thirst.",
                "This will not be a fast or simple process, luckily the same thirsty citizens will be happy to construct them.",
                "Scholars and Architects must be commisioned to plan and guide such a task. This of course will add additional costs before we begin."
            ], //This will add a line break between each item in the list.
            function () {
                this.unlocked = true;
                document.querySelector("#greatProjects").className = "divide greatProjects";
            },
            [iRef("gold", 250)] /* UpgradeCost */,
            ["aqueduct"] //Which cards this effects.
        );
        //#endregion
        //#region guilds
        this.guilds = new Upgrade(
            this,
            "guilds",
            "Guilds",
            [
                "As more and more artisans and stalls begin to open. The Artisans have come together to form guilds to protect profits and make sure the city's needs are met.",
                "By placing price controls to make sure no one runs anyone else out of business along with an apprenticeship system which ensures knowledge is kept inside of the trade.",
                "Although this will mean that business is much less fluid and Artisans will no longer be able to move from job to job.",
                "Artisan efficiency is raised by 50%"
            ], //This will add a line break between each item in the list.
            function () {
                this.guildProtected = true;
                this.efficiency += 0.5;
            },
            [iRef("gold", 100)] /* UpgradeCost */,
            ["artisans"] //Which cards this effects.
        );
        //#endregion
        //#region localQuarry
        this.localQuarry = new Upgrade(
            this,
            "localQuarry",
            "Quarry for local stone",
            [
                "Our ability to support the growth of out potters productivity is being hampered by the large human effort and cost in gold of transporting the large, heavy clay that they require.",
                "This, along with any upcoming plans for large stone buildings such as aqueducts and other marvels will require tonnes of stone which will be prohibitively expensive unless we are to use our local resources.",
                "Opening a quarry will allow easy access to clay and stone among other resources which will be neccesary for growing to a true regional power."
            ], //This will add a line break between each item in the list.
            function () {
                this.unlocked = true;
                this.onBuild();
            },
            getProject("quarry").costs /* UpgradeCost */,
            ["quarry"] //Which cards this effects.
        );
        //#endregion
        //#endregion
    }

    unlockUpgrades() {
        this.upgrades.forEach((upg) => {
            if (upg.purchased == true && upg.baseElement != undefined) {
                upg.baseElement.remove();
            }
        })
        if (this.tutorial == true) {
            this.dropDownTutorial.unlock();
        }

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

        if (getPop("total") >= 15) {
            this.marketCharter.unlock();
            this.marketTutorial.unlock();
        }

        if (this.marketCharter.unlocked == true && getItem("influence").amount >= 150) {
            this.artisanGrowth.unlock();
        }

        if (getPop("skilled").amount >= 10) {
            this.guilds.unlock();
        }

        if (getItem("influence").amount >= 1000) {
            this.irrigation.unlock();
        }

        if (this.irrigation.unlocked == true) {
            this.unlockAqueduct.unlock();
        }

        if (this.unlockAqueduct.unlocked == true) {
            this.localQuarry.unlock();
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
        this.uM.upgrades.push(this);
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
        this.baseElement = uIManager.shell(this.elements, this.id + "upgradesShell", undefined, undefined, "upgrades").wrapperE;
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