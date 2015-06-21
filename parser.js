var tempart = {
	defined: ['if', 'each', 'variable', 'echo'],
	needsEnd: ['if', 'each'],
	parse: function(templateContent) {
		// escaping backslashes, single quotes, and newlines
		templateContent = this.escapeSpecials(templateContent);

		if(templateContent[0] == '{' && templateContent[1] == '{') {
			templateContent = templateContent.slice(2, templateContent.length);
		} else {
			templateContent = this.addEcho(templateContent);
		}

		var searches = templateContent.split(/{{/);
		return this.parseBlocks(searches);
	},
	parseBlocks: function(blocks) {
		var id = 0;
		var result = [];
		while(blocks.length) {
			var block = this.parseBlock(blocks);
			if(block) {
				block.id = id;
				result.push(block);
			} else {
				break;
			}
			id++;
		}
		return result;
	},
	parseBlock: function(blocks) {
		var block = blocks[0];
		var result = {};
		var end = this.getEnd(block);
		var type = block.slice(0, end).split(' ');
		if(type[0][0] == '/') {
			// @TODO add close-logic
		} else if(this.defined.indexOf(type[0]) == -1) {
			result.type = 'variable';
			result.depending = [type[0]];
			
		} else {
			result.type = type[0];
			type.shift();
			result.depending = type;
		}
		blocks.shift();
		if(this.needsEnd.indexOf(result.type) != -1) {
			var contains = this.parseBlocks(blocks);
			if(contains) {
				result.contains = contains;
			}
		}

		if(block.length > end + 2) {
			// blocks.unshift(this.addEcho(block.slice(end + 2, block.length)));
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
		return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
	}
};