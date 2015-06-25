// tempart templating library

;(function(tempartCompiler) {
	tempartCompiler.compile = function(blocks, data, opt) {
		var result = {};
		this._handleBlocks(blocks, data, result, opt);
		return result;
	};
	tempartCompiler._handleBlocks = function(blocks, data, result, opt) {
		for(var i = 0; i < blocks.length; i++) {
			this._handleBlock(blocks[i], data, result, opt);
		}
		return result;
	};
	tempartCompiler._handleBlock = function(block, data, result, opt) {
		result[block.id]      = tempartCompiler.types[block.type](block, data);
		result[block.id].type = block.type;
	};

	tempartCompiler.types = {
		variable: function(block, data) {
			return {html: data[block.depending[0]], value: data[block.depending[0]]};
		},
		echo: function(block, data) {
			return {html: block.content, value: true};
		},
		if: function(block, data) {
			var result = false;
			var type   = 'elseContains';
			if(data[block.depending[0]]) {
				result = true;
				type   = 'contains';
			}
			return {contains: [tempartCompiler._handleBlocks(block[type], data, {})], value: result};
		},
		each: function(block, data) {
			var key = data[block.depending[2]];
			if(data[key]) { // @TODO add deep-handling
				var result = [];
				for(var i = 0; i < data[key].length; i++) {
					data[block.depending[0]] = data[key][i];
					result.push({contains: tempartCompiler._handleBlocks(block.contains, data, {}), value: data[key].length});
				}
				return result;
			} else {
				return {contains: [tempartCompiler._handleBlocks(block.elseContains, data, {})], value: false};
			}
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
