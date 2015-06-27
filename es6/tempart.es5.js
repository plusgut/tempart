'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Parser = (function () {
	function Parser() {
		_classCallCheck(this, Parser);

		// id generator for the blocks, needs to be global because of the recusion
		this._increment = 0;
		// which things are reserved words
		this.defined = ['if', 'each', 'variable', 'echo'];
		// defines what commands need an {{/end}}
		this.needsEnd = ['if', 'each'];
	}

	_createClass(Parser, [{
		key: 'parse',

		// Precompiles the html and generates json-arrays
		value: function parse(templateContent) {
			this._increment = 0;
			templateContent = this._escapeSpecials(templateContent);

			if (templateContent[0] == '{' && templateContent[1] == '{') {
				templateContent = templateContent.slice(2, templateContent.length);
			} else {
				templateContent = this._addEcho(templateContent);
			}
			// @TODO add check if open-blocks are the same as end-blocks
			var searches = templateContent.split('{{');
			return this._parseBlocks(searches).content;
		}
	}, {
		key: '_parseBlocks',

		// takes an array of commands
		value: function _parseBlocks(blocks) {
			var result = [];
			var end = null;
			while (blocks.length) {
				var block = this._parseBlock(blocks);
				if (block == 'end' || block == 'else') {
					// @TODO improve!
					end = block;
					break;
				} else if (block) {
					block.id = this._increment;
					result.push(block);
				}
				this._increment++;
			}
			return { content: result, end: end };
		}
	}, {
		key: '_parseBlock',

		// parses one command and adds new ones if needed
		value: function _parseBlock(blocks) {
			var block = blocks[0];
			var result = {};
			var end = this._getEnd(block);
			var type = block.slice(0, end).split(' ');
			if (type[0][0] == '/') {
				// @TODO add for debugging purpose a check if this was the one which was last opened
				result = 'end';
			} else if (type[0] == 'else') {
				result = 'else';
			} else if (this.defined.indexOf(type[0]) == -1) {
				result.type = 'variable';
				result.depending = [type[0]];
			} else {
				result.type = type[0];
				type.shift();
				result.depending = type;
				if (result.type == 'echo') {
					result.content = block.slice(end + 2, block.length);
				}
			}
			blocks.shift();

			this._handleOverlength(block, blocks);
			this._handleElse(result, blocks);

			return result;
		}
	}, {
		key: '_handleElse',

		// Checks if an block-has the {{else}} possibility and adds elseContains
		value: function _handleElse(result, blocks) {
			if (this.needsEnd.indexOf(result.type) != -1) {
				var contains = this._parseBlocks(blocks);
				if (contains) {
					result.contains = contains.content;
					if (contains.end == 'else') {
						result.elseContains = this._parseBlocks(blocks).content;
					} else {
						result.elseContains = [];
					}
				}
			}
		}
	}, {
		key: '_handleOverlength',

		// Checks if an block has an html-string behind it
		value: function _handleOverlength(block, blocks) {
			var end = this._getEnd(block);
			if (block.length > end + 2 && block.slice(0, end) != 'echo') {
				// Handling of not-variable stuff
				blocks.unshift(this._addEcho(block.slice(end + 2, block.length)));
			}
		}
	}, {
		key: '_addEcho',

		// plain html without any variable
		value: function _addEcho(echo) {
			return 'echo}}' + echo;
		}
	}, {
		key: '_getEnd',

		// returns int on which position the }} are existent
		value: function _getEnd(block) {
			return block.indexOf('}}');
		}
	}, {
		key: '_escapeSpecials',

		// escaping backslashes, single quotes, and newlines
		value: function _escapeSpecials(templateContent) {
			return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
		}
	}]);

	return Parser;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Compiler = (function () {
	function Compiler() {
		_classCallCheck(this, Compiler);

		this.types = {
			// returns a variable
			variable: function variable(block, data) {
				return { html: data[block.depending[0]], value: data[block.depending[0]] };
			},

			// returns html
			echo: function echo(block, data) {
				return { html: block.content, value: true };
			},

			// calls handleBlocks depending on the data contributed
			'if': function _if(block, data) {
				var result = false;
				var type = 'elseContains';
				if (data[block.depending[0]]) {
					result = true;
					type = 'contains';
				}
				return { contains: [this._handleBlocks(block[type], data, {})], value: result };
			},

			// sets a variable of an array and calls handleBlocks in the containing level
			each: function each(block, data) {
				var key = data[block.depending[2]];
				if (data[key]) {
					// @TODO add deep-handling
					var result = [];
					for (var i = 0; i < data[key].length; i++) {
						data[block.depending[0]] = data[key][i];
						result.push({ contains: this._handleBlocks(block.contains, data, {}), value: data[key].length });
					}
					return result;
				} else {
					return { contains: [this._handleBlocks(block.elseContains, data, {})], value: false };
				}
			}
		};
	}

	_createClass(Compiler, [{
		key: 'compile',

		// returns the compiled blocks, depending on the inserted data
		value: function compile(blocks, data, opt) {
			var result = {};
			this._handleBlocks(blocks, data, result, opt);
			return result;
		}
	}, {
		key: '_handleBlocks',

		// iterates threw the block on one level and calls the type-handler
		value: function _handleBlocks(blocks, data, result, opt) {
			for (var i = 0; i < blocks.length; i++) {
				this._handleBlock(blocks[i], data, result, opt);
			}
			return result;
		}
	}, {
		key: '_handleBlock',

		// returns the compiled block, depending on the inserted data
		value: function _handleBlock(block, data, result, opt) {
			result[block.id] = this.types[block.type](block, data);
			result[block.id].type = block.type;
		}
	}]);

	return Compiler;
})();
'use strict';

(function () {
	if (typeof module === 'object') {
		module.exports.tempart = {
			parser: Parser,
			compiler: Compiler
		};
	} else if (typeof window === 'object') {
		window.tempart = {
			Parser: Parser,
			Compiler: Compiler
		};
	} else {
		var tempart = {
			Parser: Parser,
			Compiler: Compiler
		};
	}
})();

