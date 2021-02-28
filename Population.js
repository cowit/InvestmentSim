class Population {
    elements = []
    pops = [];
    constructor(city) {
        this.city = city;
        uIManager.shell(this.elements, "population", "Population", "", 3);
        this.unemployed = new Pop("unemployed", 0, 1, [new ItemRef("food", -1)], city, this);
        this.farmers = new Pop("farmers", 0, 0, [], city, this);
        this.laborers = new Pop("laborers", 0, 0, [new ItemRef("food", -1)], city, this);
        this.craftsmen = new Pop("craftsmen", 0, 0, [new ItemRef("food", -1)], city, this);
        this.civil = new Pop("civil", 0, 0, [new ItemRef("food", -1)], city, this);
        this.merchants = new Pop("merchants", 0, 0, [new ItemRef("food", -1)], city, this);
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
    buildRate = 0; //How much labor they contribute to workorders. if 0 they will not be displayed for use.
    consumption = []; //A list of Refs which they will consume each day.
    unrest = 0; //A production penalty. Also increases risk of uprisings.
    jobs = []; //When a pop type is hired into this, it's JRef is added here.

    constructor(name, tax, buildRate, consumption, city, population) {
        this.population = population;
        this.name = name;
        this.tax = tax;
        this.buildRate = buildRate;
        this.consumption = consumption;
        this.city = city;
        this.population.pops.push(this);
        uIManager.dropDown(population.elements, "popDropDown" + name, function () { return [name + " : " + this.amount] }.bind(this), "population");
        /*  consumption.forEach((con) => {
            uIManager.subEffect(population.elements, con.name + name, function () { return [con.name + " : " + con.amount] }.bind(this), "popDropDown" + name);
        })*/
    }

    applyConsumption() {
        this.consumption.forEach((con) => {
            var canEat = con.produce(this.city, this.amount);
            if (!canEat) {
                this.unrest += 1;
            }
        })
    }
}

