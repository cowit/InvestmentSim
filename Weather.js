class Weather {
    //Should generally have various climates and conditions.
    condition = "sunny";
    season = "harvest";
    conditions = ["sunny", "rainy", "baumy"];
    seasons = ["harvest", "cold", "ok"];
    currentSeason = 0;
    seasonDuration = 5;
    dayInSeason = 0;

    updateWeather() {
        var randomCondition = Math.floor(Math.random() * this.conditions.length);
        this.condition = this.conditions[randomCondition];
        this.season = this.seasons[this.currentSeason];
        this.dayInSeason += 1;
        if (this.dayInSeason == this.seasonDuration) {
            if (this.currentSeason == this.seasons.length - 1) {
                this.currentSeason = 0;
                this.dayInSeason = 0;
            }
            else {
                this.currentSeason += 1;
                this.dayInSeason = 0;
            }
        }



    }
}