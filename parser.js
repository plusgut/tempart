var tempart = {
	defined: ['if', 'each', 'variable', 'echo'],
	needsEnd: ['if', 'each'],
	parse: function(templateContent) {
		templateContent = this.escapeSpecials(templateContent);

		if(templateContent[0] == '{' && templateContent[1] == '{') {
			templateContent = templateContent.slice(2, templateContent.length);
		} else {
			templateContent = this.addEcho(templateContent);
		}

		var searches = templateContent.split(/{{/);
		return this.parseBlocks(searches).content;
	},
	parseBlocks: function(blocks) {
		var id     = 0; // Has to be global or reference
		var result = [];
		var end    = null;
		while(blocks.length) {
			var block = this.parseBlock(blocks);
			if(block == 'end' || block == 'else') { // @TODO improve!
				end = block;
				break;
			} else if(block) {
				block.id = id;
				result.push(block);
			}
			id++;
		}
		return {content: result, end: end};
	},
	parseBlock: function(blocks) {
		var block = blocks[0];
		var result = {};
		var end = this.getEnd(block);
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
			blocks.unshift(this.addEcho(block.slice(end + 2, block.length)));
		}

		if(this.needsEnd.indexOf(result.type) != -1) {
			var contains = this.parseBlocks(blocks);
			if(contains) {
				result.contains = contains.content;
				if(contains.end == 'else') {
					result.elseContains = this.parseBlocks(blocks).content;
				}
			}
		}


		return result;
	},
	addEcho: function(echo) {
		return 'echo}}' +  echo;
	},
	getEnd: function(block) {
		return block.indexOf('}}');
	},
	escapeSpecials: function(templateContent) {
		// escaping backslashes, single quotes, and newlines
		return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
	}
};