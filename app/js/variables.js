class Variables{
	constructor(){
		this._variables = {}
	}

	set(key, val){
		this._variables[key] = val
	}

	get(key){
		return this._variables[key]
	}
}

module.exports = new Variables()