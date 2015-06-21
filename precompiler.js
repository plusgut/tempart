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

		console.log(searches);
	},
	escapeSpecials: function(templateContent) {
		return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '');
	}
};