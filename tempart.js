// tempart templating library

;(function(tempartCompiler) {
	////-----------------------------------------------------------------------------------------
	// you need to overwrite this function, to have working partial support
	tempartCompiler.partial = function(block, context, currentValues, dirties, path ){
		// @TODO do a better api for that..
		console.error('Overwrite the function tempartCompiler.partial to have partials');
		return '';
	};
	////-----------------------------------------------------------------------------------------
	// returns the html and adds context to currentValues
	// path is not used, it only is passed to partial
	tempartCompiler.compile = function( blocks, content, currentValues, dirties, path, prefix ){
		if(!prefix) prefix = '';
		var local = {};
		return this._handleBlocks(blocks, content, local, currentValues, dirties, path, prefix);
	};
	////-----------------------------------------------------------------------------------------
	// iterates threw the blocks on one level and calls the type-handler

	////-----------------------------------------------------------------------------------------
	// iterates threw the block on one level and calls the type-handler
	tempartCompiler._handleBlocks = function( blocks, content, local, currentValues, dirties, path, prefix ){
		var result = "";
		for( var i = 0; i < blocks.length; i++ ){
			result += this._handleBlock( blocks[i], content, local, currentValues, dirties, path, prefix );
		}
		return result;
	};
	////-----------------------------------------------------------------------------------------
	// returns the compiled block, depending on the inserted data
	tempartCompiler._handleBlock = function( block, content, local, currentValues, dirties, path, prefix ){
		var detailPrefix = prefix + this.types.executes.options.prefixDelimiter + block.id;
		if(block.type === 'log') { // No need for pre and suffix at an log
			return this.types[block.type]( block, content, local, currentValues, dirties, path, prefix );
		} else {
			return this.types.executes.prefix( detailPrefix ) + this.types[block.type]( block, content, local, currentValues, dirties, path, prefix ) + this.types.executes.suffix( detailPrefix );
		}
		
	};

	////-----------------------------------------------------------------------------------------
	// Contains the possible handlers
	tempartCompiler.types = {
		////-----------------------------------------------------------------------------------------
		// returns a variable
		variable: function( block, content, local, currentValues, dirties ){
			return this.executes.get(block.depending[ 0 ], content, local );
		},
		////-----------------------------------------------------------------------------------------
		// returns html
		echo: function( block, content, local, currentValues, dirties ){
			return block.content;
		},
		////-----------------------------------------------------------------------------------------
		// calls handleBlocks depending on the data contributed
		if: function( block, content, local, currentValues, dirties, path, prefix ) {
			var type   = 'elseContains';
			if(this.executes.get(block.depending[ 0 ], content, local )) {
				type   = 'contains';
			}

			if( dirties != '*' && currentValues[ block.id ] != type) {
				throw 'Not yet implemented';
			} else {
				currentValues[ block.id ] = type;
			}
			prefix += this.executes.options.prefixDelimiter + block.id;

			return tempartCompiler._handleBlocks(block[type], content, local, currentValues, dirties, path, prefix);
		},
		////-----------------------------------------------------------------------------------------
		// sets a variable of an array and calls handleBlocks in the containing level
		each: function( block, content, local, currentValues, dirties, path, prefix ) {
			if( dirties === '*' ){
				currentValues[block.id] = [];
			}
			var value = this.executes.get(block.depending[ 0 ], content, local );

			if( value && value.length ){
				var result = "";
				for(var i = 0; i < value.length; i++) {
					currentValues[ block.id ].push( this.executes.random() );
					var detailPrefix = prefix + this.executes.options.prefixDelimiter + block.id + ':' + currentValues[ block.id ][ i ];
					this.executes.set( block.depending[2], value[i], local );
					result += tempartCompiler._handleBlocks( block.contains, content, local, currentValues, dirties, path, detailPrefix);
				}
				return result;
			} else {
				return tempartCompiler._handleBlocks( block.elseContains, content, local, currentValues, dirties, path, detailPrefix );
			}
		},
		////-----------------------------------------------------------------------------------------
		// puts values in the console
		log: function(block, content, local) {
			console.log( this.executes.get(block.depending[ 0 ], content, local ));
			return "";
		},
		////-----------------------------------------------------------------------------------------
		// patial handler, for rewriting contexts and stuff
		partial: function( block, content, local, currentValues, dirties, path ) {
			if(block.path !== '/') {
				path = path + '/' + block.path;
			}
			return tempartCompiler.partial(block, content, currentValues, dirties, path);
		},
		executes: {
			////-----------------------------------------------------------------------------------------
			// Executables are in need of options too!
			options: {
				domNode:   'script',
				attrStart: 'tempartStart',
				attrEnd: 'tempartEnd',
				prefixDelimiter: '-'
			},
			////-----------------------------------------------------------------------------------------
			// Checks if something is in the local space
			get: function( key, global, local ){
				if( local.hasOwnProperty( key )){
					return local[ key ];
				} else {
					return this._get( key.split( '.' ), global );
				}
			},
			////-----------------------------------------------------------------------------------------
			// handles dotnotation for getting values
			_get: function( keyParts, global) {
				var firstKey = keyParts.shift();
				if(!keyParts.length) {
					return global[ firstKey ];
				} else {
					return this.get( keyParts, value, global[ firstKey ] );
				}
			},
			////-----------------------------------------------------------------------------------------
			// sets things in the local space, we dont want to manipulate the original object
			set: function( key, value, scope ){
				scope[ key ] = value;
			},
			prefix: function( prefix ){
				return '<' +this.options.domNode+ ' ' +this.options.attrStart+ '="' +prefix + '"></' +this.options.domNode+ '>';
			},
			suffix: function( suffix ){
				// debugger;
				return '<' +this.options.domNode+ ' ' +this.options.attrEnd+ '="' +suffix + '"></' +this.options.domNode+ '>';
			},
			random: function() {
				return Math.random().toString(36).substring(7);
			}
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
