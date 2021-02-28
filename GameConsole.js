//This will act like "the console" for anything that needs directly changed.
//gameManager.focusCity = new City("Angkor");
//itemManager.Unlock(gameManager.focusCity.items.gold);
//gameManager.focusCity.items.gold.amount += 10;
//gameManager.SetItemElements();
var upgradeManager = new UpgradeManager();
gameManager.createCity("Angkor");
gameManager.initialize();

