var tempart = {
	////-----------------------------------------------------------------------------------------
	// id generator for the blocks, needs to be global because of the recusion
	_increment: 0,
	////-----------------------------------------------------------------------------------------
	// which things are reserved words
	defined: ['if', 'each', 'variable', 'echo'],
	////-----------------------------------------------------------------------------------------
	// defines what commands need an {{/if}}
	needsEnd: ['if', 'each'],
	////-----------------------------------------------------------------------------------------
	// Precompiles the html and generates json-arrays
	parse: function(templateContent) {
		this._increment = 0;
		templateContent = this._escapeSpecials(templateContent);

		if(templateContent[0] == '{' && templateContent[1] == '{') {
			templateContent = templateContent.slice(2, templateContent.length);
		} else {
			templateContent = this._addEcho(templateContent);
		}

		var searches = templateContent.split(/{{/);
		return this._parseBlocks(searches).content;
	},
	////-----------------------------------------------------------------------------------------
	// takes an array of commands
	_parseBlocks: function(blocks) {
		var result = [];
		var end    = null;
		while(blocks.length) {
			var block = this._parseBlock(blocks);
			if(block == 'end' || block == 'else') { // @TODO improve!
				end = block;
				break;
			} else if(block) {
				block.id = this._increment;
				result.push(block);
			}
			this._increment++;
		}
		return {content: result, end: end};
	},
	////-----------------------------------------------------------------------------------------
	// parses one command and adds new ones if needed
	_parseBlock: function(blocks) {
		var block = blocks[0];
		var result = {};
		var end = this._getEnd(block);
		var type = block.slice(0, end).split(' ');
		if(type[0][0] == '/') {
			blocks.shift();
			return 'end';
		} else if(type[0] == 'else') {
			blocks.shift();
			return 'else';
		} else if(this.defined.indexOf(type[0]) == -1) {
			result.type = 'variable';
			result.depending = [type[0]];
		} else {
			result.type    = type[0];
			type.shift();
			result.depending = type;
			if(result.type == 'echo') {
				result.content = block.slice(end + 2, block.length);
			}
		}
		blocks.shift();

		if(block.length > end + 2 && result.type != 'echo') { // Handling of not-variable stuff
			blocks.unshift(this._addEcho(block.slice(end + 2, block.length)));
		}

		if(this.needsEnd.indexOf(result.type) != -1) {
			var contains = this._parseBlocks(blocks);
			if(contains) {
				result.contains = contains.content;
				if(contains.end == 'else') {
					result.elseContains = this._parseBlocks(blocks).content;
				}
			}
		}


		return result;
	},
	////-----------------------------------------------------------------------------------------
	// plain html without any variable
	_addEcho: function(echo) {
		return 'echo}}' +  echo;
	},
	////-----------------------------------------------------------------------------------------
	// returns int on which position the }} are existent
	_getEnd: function(block) {
		return block.indexOf('}}');
	},
	////-----------------------------------------------------------------------------------------
	// escaping backslashes, single quotes, and newlines
	_escapeSpecials: function(templateContent) {
		return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
	}
};