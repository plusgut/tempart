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
	};
	tempartCompiler._handleBlock = function(block, data, result, opt) {
		result[block.id] = tempartCompiler.types[block.type](block, data);
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
			// @TODO add logic operators
			if(data[block.depending[0]])
			return 'ifstuff';
		},
		each: function(block, data) {

			return 'eachstuff';
			// @TODO
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
