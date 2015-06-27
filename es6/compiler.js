class Compiler {
	// returns the compiled blocks, depending on the inserted data
	compile(blocks, data, opt) {
		var result = {};
		this._handleBlocks(blocks, data, result, opt);
		return result;
	}

	constructor(){
		this.types = {
			// returns a variable
			variable: function(block, data) {
				return {html: data[block.depending[0]], value: data[block.depending[0]]};
			},
	
			// returns html
			echo: function(block, data) {
				return {html: block.content, value: true};
			},
	
			// calls handleBlocks depending on the data contributed
			if: function(block, data) {
				var result = false;
				var type   = 'elseContains';
				if(data[block.depending[0]]) {
					result = true;
					type   = 'contains';
				}
				return {contains: [this._handleBlocks(block[type], data, {})], value: result};
			},
	
			// sets a variable of an array and calls handleBlocks in the containing level
			each: function(block, data) {
				var key = data[block.depending[2]];
				if(data[key]) { // @TODO add deep-handling
					var result = [];
					for(var i = 0; i < data[key].length; i++) {
						data[block.depending[0]] = data[key][i];
						result.push({contains: this._handleBlocks(block.contains, data, {}), value: data[key].length});
					}
					return result;
				} else {
					return {contains: [this._handleBlocks(block.elseContains, data, {})], value: false};
				}
			}
		}
	}

	// iterates threw the block on one level and calls the type-handler
	_handleBlocks(blocks, data, result, opt) {
		for(var i = 0; i < blocks.length; i++) {
			this._handleBlock(blocks[i], data, result, opt);
		}
		return result;
	}

	// returns the compiled block, depending on the inserted data
	_handleBlock(block, data, result, opt) {
		result[block.id]      = this.types[block.type](block, data);
		result[block.id].type = block.type;
	}
}