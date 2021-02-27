let uIManager = {
    subEffect: function (parentList, id, func, attachTo) {
        var element = document.querySelector("#" + id); //Attemps to find the element by ID
        if (element == null) { //If it does not find it.
            const sE = document.createElement("p"); //Creates the paragraph
            sE.id = id; //Sets the ID of the element
            document.querySelector("#" + attachTo).append(sE); //Appends to the attachTo element.
            sE.className = "subEffect";
            element = sE; //Sets the element to the newly created one.
        }
        var subClass = new SubEffect(func, element);
        parentList.push(subClass); //Actually creates the new subEffect so it can be set by the Subscriber.
        return subClass;
    },
    effectHeader: function (parentList, id, name, attachTo) {
        var elementHeader = document.querySelector("#" + id);
        var elementName = document.querySelector("#name" + id);
        if (elementHeader == null) {
            const eH = document.createElement("div");
            const n = document.createElement("p");
            eH.id = id;
            n.id = "name" + id;
            document.querySelector("#" + attachTo).append(document.createElement("br"));
            document.querySelector("#" + attachTo).append(eH);
            eH.append(n);
            n.className = "effect projectName";
            elementHeader = eH;
            elementName = n;
        }
        parentList.push(new EffectHeader(name, elementName, elementHeader));

    },
    shell: function (parentList, id, name, description, column) {
        if (column == undefined) {
            column = 1;
        }
        var effectsWrapper = document.querySelector("#" + id);
        var projectName = document.querySelector("#" + id + "ProjectName");
        var projectDesc = document.querySelector("#" + id + "ProjectDesc");
        if (effectsWrapper == null) {
            var projects;
            if (column == 1) {
                projects = document.querySelector(".divide.projects");
            }
            else if (column == 2) {
                projects = document.querySelector(".divide.items");
            }
            else if (column == 3) {
                projects = document.querySelector(".divide.cities");
            }
            else if (column == 4) {
                projects = document.querySelector(".divide.upgrades");
            }


            //The container for the entire project.
            const title = document.createElement("div");
            projects.append(title);
            title.className = "project title";
            title.id = id + "Title";
            //the name
            if (name != undefined) {
                projectName = document.createElement("p");
                title.append(projectName);
                projectName.textContent = name;
                projectName.className = "textPad projectName";
                projectName.id = id + "ProjectName";
            }

            //the description
            if (description != undefined) {
                projectDesc = document.createElement("p");
                title.append(projectDesc);
                projectDesc.textContent = description;
                projectDesc.className = "textPad projectDesc"
                projectDesc.id = id + "ProjectDesc";
            }

            //Effects Wrapper
            const effectsWrapper = document.createElement("div");
            title.append(effectsWrapper);
            effectsWrapper.id = id;
            effectsWrapper.className = "project shell";
            parentList.push(new Shell(name, description, title, projectName, projectDesc, effectsWrapper));
        }
        else {
            const title = document.querySelector("#" + id + "Title");
            const projectName = document.querySelector("#" + id + "ProjectName");
            const projectDesc = document.querySelector("#" + id + "ProjectDesc");
            parentList.push(new Shell(name, description, title, projectName, projectDesc, effectsWrapper));
        }
    },
    buildButton: function (parentList, id, onClick, attachTo) {
        var buy = document.querySelector("#" + id);
        if (buy == null) {
            buy = document.createElement("div");
            buy.id = id;
            document.querySelector("#" + attachTo).append(buy);
            buy.className = "buyButton";
            buy.textContent = "Buy";
        }
        var buttonClass = new BuyButton(onClick, buy);
        parentList.push(buttonClass);
        return buttonClass;
    },
    button: function (parentList, id, name, onClick, attachTo) {
        var but = document.querySelector("#" + id);
        if (but == null) {
            but = document.createElement("div");
            but.id = id;
            document.querySelector("#" + attachTo).append(but);
            but.className = "buyButton open";
            but.textContent = name;
        }
        var buttonClass = new BuyButton(onClick, but);
        parentList.push(buttonClass);
        return buttonClass;
    },
    dropDown: function (parentList, id, name, attachTo) {
        var element = document.querySelector("#dropDown" + id);
        var nameElement = document.querySelector("#name" + id);
        var dropDownElement = document.querySelector("#" + id);

        if (element == null) {
            const drop = document.createElement("div");
            const n = document.createElement("p");
            const down = document.createElement("div");
            drop.id = "#dropDown" + id;
            n.id = "name" + id;
            down.id = id;
            document.querySelector("#" + attachTo).append(drop);
            drop.append(n);
            drop.append(down);
            drop.className = "dropDown";
            n.className = "projectName";
            down.className = "open";
            element = drop;
            nameElement = n;
            dropDownElement = down;
        }
        parentList.push(new DropDown(name, nameElement, dropDownElement, element));
        return element;
    },
    refEffect: function (parentList, id, name, func, attachTo) {
        var element = document.querySelector("#" + id); //Attemps to find the element by ID
        var nameElement = document.querySelector("#name" + id);
        if (element == null) { //If it does not find it.
            const sE = document.createElement("p"); //Creates the paragraph
            const n = document.createElement("p");
            sE.id = id; //Sets the ID of the element
            n.id = "name" + id;
            document.querySelector("#" + attachTo).append(document.createElement("br"));
            document.querySelector("#" + attachTo).append(sE); //Appends to the attachTo element.
            sE.append(n);
            sE.className = "subEffect";
            n.className = "projectName";
            element = sE; //Sets the element to the newly created one.
            nameElement = n;
        }
        parentList.push(new RefEffect(func, name, nameElement, element)); //Actually creates the new subEffect so it can be set by the Subscriber.
    },
    workerEffect: function (parentList, id, name, jobList, attachTo) {
        var wrapper = document.querySelector("#" + id);
        if (wrapper == undefined) {
            wrapper = document.createElement("div");
            wrapper.id = id;
            document.querySelector("#" + attachTo).append(document.createElement("br"));
            document.querySelector("#" + attachTo).append(wrapper);
        }
        parentList.push(new WorkerEffect(wrapper, name, jobList));
    },
    productionEffect: function (parentList, id, name, prodList, attachTo) {
        var wrapper = document.querySelector("#" + id);
        if (wrapper == undefined) {
            wrapper = document.createElement("div");
            wrapper.id = id;
            document.querySelector("#" + attachTo).append(wrapper);
        }
        parentList.push(new ProductionEffect(wrapper, name, prodList));
    },
    jobRefEffect: function (parentList, id, name, jobList, attachTo) {
        var wrapper = document.querySelector("#" + id);
        if (wrapper == undefined) {
            wrapper = document.createElement("div");
            wrapper.id = id;
            document.querySelector("#" + attachTo).append(document.createElement("br"));
            document.querySelector("#" + attachTo).append(wrapper);
        }
        parentList.push(new JobRefEffect(wrapper, name, jobList));
    },
}

class JobRefEffect {
    elements = {}
    headerElement;
    constructor(wrapperElement, name, jobList) {
        this.wrapperElement = wrapperElement;
        this.name = name;
        this.jobList = jobList;
        this.set();
    }

    set() {
        if (this.headerElement != undefined) {
            this.headerElement.textContent = this.name;
        }
        else {
            this.headerElement = document.createElement("p");
            this.wrapperElement.append(this.headerElement);
            this.headerElement.textContent = this.name;
        }

        if (this.jobList.length == 0) {
            this.headerElement.className = "close";
        }

        this.jobList.forEach((job) => {
            if (this.elements[job.name] != undefined) {

                this.elements[job.name].set(job);
            }
            else {
                var ref = new JRERef();
                ref.wrapper = document.createElement("div");
                this.wrapperElement.append(ref.wrapper);
                ref.plusButton = document.createElement("div");
                ref.plusButton.textContent = "+";
                ref.plusButton.className = "workerButton";
                ref.wrapper.append(ref.plusButton);
                ref.minusButton = document.createElement("div");
                ref.minusButton.textContent = "-";
                ref.minusButton.className = "workerButton";
                ref.wrapper.append(ref.minusButton);
                ref.popDisplay = document.createElement("p");
                ref.popDisplay.className = "popDisplay";
                ref.wrapper.append(ref.popDisplay);
                ref.plusButton.addEventListener("click", job.hire.bind(job));
                ref.minusButton.addEventListener("click", job.fire.bind(job));
                this.elements[job.name] = ref;
            }
        })

    }

}

class JRERef {
    wrapper;
    plusButton;
    minusButton;
    popDisplay;
    productElements = [];

    set(jobRef) {
        this.popDisplay.textContent = jobRef.name + " : " + jobRef.amount + " / " + jobRef.max;
        var index = 0;
        jobRef.productList.forEach((pro) => {

            if (this.productElements[index] != undefined) {
                this.productElements[index].textContent = pro.name + " : " + (pro.amount * jobRef.project.efficiency);
            }
            else {
                var proPara = document.createElement("p");
                this.wrapper.append(proPara);
                proPara.textContent = pro.name + " : " + pro.amount;
                this.productElements.push(proPara);
            }
            index++;
            if (jobRef.productList[index] == undefined && this.productElements[index] != undefined) {
                this.productElements[index].remove();
            }
        })
    }
}

class SubEffect {
    constructor(func, element) {
        this.listFunction = func;
        this.element = element;
    }

    openEffect() {
        this.element.className = "subEffect open";
    }

    closeEffect() {
        this.element.className = "subEffect close";
    }

    set() {
        var text = this.listFunction().join(" ");
        if (text != undefined || text != "" || text != " ") {
            this.element.textContent = text;
        }
    }
}

class EffectHeader {
    constructor(name, elementName, elementHeader) {
        this.name = name;
        this.elementName = elementName;
        this.elementHeader = elementHeader;
    }

    set() {
        this.elementName.textContent = this.name;
    }
}

class Shell {
    constructor(name, description, titleE, nameE, descE, wrapperE) {
        this.name = name;
        this.description = description;
        this.titleE = titleE;
        this.nameE = nameE;
        this.descE = descE;
        this.wrapperE = wrapperE;
    }

    set() {
        if (this.nameE != undefined) {
            this.nameE.textContent = this.name;
        }

        if (this.descE != undefined) {
            this.descE.textContent = this.description;
        }

    }
}

class BuyButton {
    constructor(onClick, element) {
        this.element = element;
        this.element.addEventListener("click", onClick);
    }

    openButton() {
        this.element.className = "buyButton open";
    }

    closeButton() {
        this.element.className = "buyButton close";
    }

    set() { //Dummy Function for now. Won't be called by Projects API

    }
}

class DropDown {
    constructor(name, nameElement, dropDownElement, element) {
        this.name = name;
        this.nameElement = nameElement;
        this.element = element;
        this.dropDownElement = dropDownElement;
        this.nameElement.addEventListener("click", this.openClose.bind(this));
    }

    set() {
        if (typeof this.name === "function") {
            this.nameElement.textContent = this.name();
        }
        else {
            this.nameElement.textContent = this.name;
        }
    }

    openClose() {
        if (this.dropDownElement.className == "open") {
            this.dropDownElement.className = "close";
        }
        else {
            this.dropDownElement.className = "open";
        }
    }

}

class RefEffect {
    refList = []
    constructor(func, name, nameElement, element) {
        this.listFunction = func;
        this.name = name;
        this.nameElement = nameElement;
        this.element = element;

    }

    set() {
        var checkList = this.listFunction();
        if (checkList.length == 0) {
            this.nameElement.textContent = "";
        }
        else {

            this.nameElement.textContent = this.name;
        }
        checkList.forEach(ref => {
            var i = checkList.indexOf(ref);
            if (this.refList.length == i) {
                var par = document.createElement("p");
                par.textContent = ref.itemName + " : " + ref.itemAmount;
                this.refList.push(par)
                this.element.append(par);
                par.append(document.createElement("br"));
            }
            else if (ref.itemRate == 0) {
                this.refList[i].textContent = ref.itemName + " : " + ref.itemAmount;
            }
            else {
                this.refList[i].textContent = ref.itemName + " : " + ref.itemAmount + " every " + ref.itemRate + " day";
            }
        });
        if (this.refList.length > checkList.length) {
            this.refList.forEach(ref => {

                if (this.refList.indexOf(ref) >= this.checkList.length) {
                    console.log(ref + "This comes from UI manager! It Means a refList was too large.");
                    ref.remove();
                }
            })
            this.refList.length = checkList.length;
        }
    }
}

