let itemManager = {
    items: new Items(),
    subscribers: [new Items()], //Will add to this whenever a new set of items is added anywhere.
    Subscribe: function (parent) {//Parent is what will be added as the Parent to all Items
        //When called it will add the caller to Subscribers and give them the edited list.
        var list = new Items();
        this.subscribers.push(list);
        for (var item in list) {
            if (typeof item == typeof this.items.gold) {
                item.parent = parent;
            }
        }
        return list;
    },
    Unlock: function (toUnlock) {
        for (i = 0; i < this.subscribers.length; i++) {//Checks through every subscribed Items object.
            for (var item in this.subscribers[i]) {
                items = this.subscribers[i];
                item = items[item];
                if (item.name == toUnlock.name) {
                    item.isUnlocked = true;
                }
            }
        }

    }

}