// tempart templating library

;(function(tempartCompiler) {
	////-----------------------------------------------------------------------------------------
	// returns the html and adds context to currentValues
	tempartCompiler.compile = function( blocks, content, currentValues, dirties ){
		return this._handleBlocks(blocks, content, currentValues, dirties);
	};
	////-----------------------------------------------------------------------------------------
	// iterates threw the block on one level and calls the type-handler
	tempartCompiler._handleBlocks = function( blocks, content, currentValues, dirties ){
		var result = "";
		for(var i = 0; i < blocks.length; i++) {
			result += this._handleBlock( blocks[i], content, currentValues, dirties );
		}
		return result;
	};
	////-----------------------------------------------------------------------------------------
	// returns the compiled block, depending on the inserted data
	tempartCompiler._handleBlock = function( block, content, currentValues, dirties ){
		return  tempartCompiler.types[block.type]( block, content, currentValues, dirties );
	};

	////-----------------------------------------------------------------------------------------
	// Contains the possible handlers
	tempartCompiler.types = {
		////-----------------------------------------------------------------------------------------
		// returns a variable
		variable: function( block, content, currentValues, dirties ){
			return content[block.depending[ 0 ]];
		},
		////-----------------------------------------------------------------------------------------
		// returns html
		echo: function( block, content, currentValues, dirties ){
			return block.content;
		},
		////-----------------------------------------------------------------------------------------
		// calls handleBlocks depending on the data contributed
		if: function( block, content, currentValues, dirties ) {
			var result = false;
			var type   = 'elseContains';
			if(content[block.depending[0]]) {
				result = true;
				type   = 'contains';
			}
			return tempartCompiler._handleBlocks(block[type],  content, currentValues, dirties);
		},
		////-----------------------------------------------------------------------------------------
		// sets a variable of an array and calls handleBlocks in the containing level
		each: function(block, content, currentValues, dirties ) {
			var key = block.depending[ 0 ];
			if(content[key] && content[key].length) { // @TODO add deep-handling
				var result = "";
				for(var i = 0; i < content[key].length; i++) {
					content[block.depending[2]] = content[key][i];
					result += tempartCompiler._handleBlocks( block.contains, content, currentValues, dirties);
				}
				return result;
			} else {
				return tempartCompiler._handleBlocks( block.elseContains, content, currentValues, dirties );
			}
		},
		////-----------------------------------------------------------------------------------------
		// puts values in the console
		log: function(block, content) {
			console.log(content[block.depending[ 0 ]] );
			return "";
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
