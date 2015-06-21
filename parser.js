var tempart = {
	defined: ['if', 'each', 'variable', 'echo'],
	needsEnd: ['if', 'each'],
	parse: function(templateContent) {
		// escaping backslashes, single quotes, and newlines
		templateContent = this.escapeSpecials(templateContent);

		if(templateContent[0] == '{' && templateContent[1] == '{') {
			templateContent = templateContent.slice(2, templateContent.length);
		} else {
			templateContent = "echo}}" + templateContent;
			var position = templateContent.indexOf('{{');
			templateContent[position] = '{{/echo}}{{';
		}

		var searches = templateContent.split(/{{/);
		return this.parseBlocks(searches);
	},
	parseBlocks: function(blocks) {
		var id = 0;
		var result = [];
		for(var i = 0; i < blocks.length; i++) {
			result = result.concat(this.parseBlock(blocks[i]));
		}
		return result;
	},
	parseBlock: function(block) {
		var blocks = [];
		var result = {};
		var end = this.getEnd(block);
		var type = block.slice(0, end).split(' ');
		if(type[0][0] == '/') {
			// @TODO add close-logic
		} else if(this.defined.indexOf(type[0]) == -1) {
			result.type = 'variable';
			result.depending = [type[0]];
			blocks.push(result);
		} else {
			result.type = type[0];
			type.shift();
			result.depending = type;
			blocks.push(result);
		}

		if(block.length > end + 2) {
			blocks.push(this.addEcho(block.slice(end + 2, block.length)));
		}
		return blocks;
	},
	addEcho: function(echo) {
		return {
			type: 'echo',
			content: echo
		};
	},
	getEnd: function(block) {
		return block.indexOf('}}');
	},
	escapeSpecials: function(templateContent) {
		return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
	}
};