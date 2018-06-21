class GameData{

	/** Creates a new GameData module
     * @constructs GameData
     * @param {Cache} cache - The cache to use
     * @author Mackan
	 */
	constructor(redis){
		this.client = redis
	}
}

module.exports = GameData