class Population {
    elements = []
    pops = [];
    constructor(city) {
        this.city = city;
        uIManager.shell(this.elements, "population", undefined, "", "stats");
        uIManager.dropDown(this.elements, "popDropDown", "Population", "population");
        uIManager.subEffect(this.elements, "popHappiness", function () {
            var totalHappiness = 0;
            this.pops.forEach((pop) => { totalHappiness += pop.happiness });
            return ["Total Happiness : " + totalHappiness];
        }.bind(this), "population");
        this.unemployed = new Pop("unemployed", 0, [new PopConsumption(iRef("food", -1), 1, true)], city, this);
        this.farmers = new Pop("farmers", 0, [], city, this);
        this.laborers = new Pop("laborers", 0, [new PopConsumption(iRef("food", -1), 1, true)], city, this);
        this.skilled = new Pop("skilled", 0, [new PopConsumption(iRef("food", -1), 1, true)], city, this);
        this.civil = new Pop("civil", 0, [new PopConsumption(iRef("food", -1), 1, true)], city, this);
        this.merchants = new Pop("merchants", 0, [new PopConsumption(iRef("food", -1), 1, true)], city, this);
        this.unemployed.amount += 5;
    }

    updateElements() {
        this.elements.forEach(ele => ele.set());
    }

    dailyConsumption() {
        this.pops.forEach((pop) => { pop.applyConsumption() });
    }

    sum() {
        var total = 0;
        this.pops.forEach((pop) => {
            total += pop.amount;
        })
        return total;
    }
}

class Pop {
    name;
    amount = 0;
    tax; //A list of Refs which show what they pay.
    consumption = []; //A list of Refs which they will consume each day.
    happiness = 0; //Can cause a lost if low enough

    salary = 1; //A multiplier to how much this pop consumes and gains from happiness

    constructor(name, tax, consumption, city, population) {
        this.population = population;
        this.name = name;
        this.tax = tax;
        this.city = city;
        this.population.pops.push(this);
        uIManager.dropDown(population.elements, "dropDown" + name, function () { return [name + " : " + this.amount] }.bind(this), "popDropDown");
        //uIManager.subEffect(population.elements, "popHappiness" + name, function () { return ["Happiness : " + this.happiness] }.bind(this), "dropDown" + name);
        consumption.forEach((con) => {
            this.newConsumption(con);
        })
    }

    applyConsumption() {
        this.consumption.forEach((con) => {
            if (gameManager.focusCity.items != undefined) {
                this.happiness = 0;
                con.onConsume(this);
            }

        })
    }

    newConsumption(con) {
        this.consumption.push(con);
        /*uIManager.subEffect(
            this.population.elements,
            "popConsumption" + this.name + con.itemRef.name,
            function () { return [con.itemRef.amount + " " + getItem(con.itemRef.name).displayName + " is consumed, granting " + con.happiness * this.salary + "happiness"] }.bind(this),
            "popHappiness" + this.name
        );*/
    }
}

