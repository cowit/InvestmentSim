class Population {
    elements = []
    pops = [];
    constructor(city) {
        this.city = city;
        uIManager.shell(this.elements, "population", "Population", "", 3);
        this.unemployed = new Pop("unemployed", [], 1, [new Ref("food", 1, 0)], city, this);
        this.farmers = new Pop("farmers", [], 0, [], city, this);
        this.labourers = new Pop("laborers", [], 0, [], city, this);
        this.craftsmen = new Pop("craftsmen", [], 0, [], city, this);
        this.civil = new Pop("civil", [], 0, [], city, this);
        this.unemployed.amount += 2;
    }

    updateElements() {
        this.elements.forEach(ele => ele.set());
    }

    dailyConsumption() {
        this.pops.forEach((pop) => { this.applyConsumption(pop.consumption, pop) });
    }

    applyConsumption(conList, pop) {
        conList.forEach((con) => {
            if (con.rateCount == con.itemRate || con.itemRate == 0) {
                var item = this.city.items[con.itemName];
                var notSatisfied = Math.max(0, pop.amount - item.amount);
                item.subtract(pop.amount - notSatisfied);
                pop.unrest += notSatisfied;
                con.rateCount = 0;
            }
            else {
                con.rateCount += 1;
            }

        })
    }
}

class Pop {
    name;
    amount = 0;
    tax; //A list of Refs which show what they pay.
    buildRate = 0; //How much labor they contribute to workorders. if 0 they will not be displayed for use.
    consumption; //A list of Refs which they will consume each day.
    unrest = 0; //A production penalty. Also increases risk of uprisings.

    constructor(name, tax, buildRate, consumption, city, population) {
        this.population = population;
        this.name = name;
        this.tax = tax;
        this.buildRate = buildRate;
        this.consumption = consumption;
        this.city = city;
        this.population.pops.push(this);
        uIManager.dropDown(population.elements, "popDropDown" + name, name, "population");
        uIManager.subEffect(population.elements, "pop" + name + "total", function () { return ["Population : " + this.amount] }.bind(this), "popDropDown" + name);
        uIManager.refEffect(population.elements, "pop" + name + "tax", "Taxes", function () { return this.tax }.bind(this), "popDropDown" + name);
        uIManager.refEffect(population.elements, "pop" + name + "consumption", "Consumes", function () { return this.consumption }.bind(this), "popDropDown" + name);
    }

}

