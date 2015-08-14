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
		return this._handleBlocks(blocks, content, local, currentValues, this._batchDirties( dirties ), path, prefix);
	};
	////-----------------------------------------------------------------------------------------
	// batches the dirties
	tempartCompiler._batchDirties = function( dirties ){
		if( dirties === '*' ) return dirties;
		var result = {};
		var batchMap = {push: 'append', unshift: 'prepend'};
		// @TODO update / remove
		for( var key in dirties ){
			if( dirties.hasOwnProperty( key )){
				var dirty = dirties[ key ];
				result[key] = {append: [], prepend: []};
				for( var i = 0; i < dirty.length; i++ ){
					var entity = dirty[ i ];
					result[ key ][ batchMap[ entity.type ]].push( entity.value );
				}
			}
		}
		return result;
	};

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
			if( dirties === '*' ){
				return this.types.executes.prefix( detailPrefix ) + this.types[ block.type ]( block, content, local, currentValues, dirties, path, prefix ) + this.types.executes.suffix( detailPrefix );
			} else {
				return this.types.dirties[ block.type ]( block, content, local, currentValues, dirties, path, prefix );
			}
		}
		
	};

	////-----------------------------------------------------------------------------------------
	// Contains the possible handlers
	tempartCompiler.types = {
		////-----------------------------------------------------------------------------------------
		// returns a variable
		variable: function( block, content, local, currentValues, dirties ){
			var value = this.executes.get(block.depending[ 0 ], content, local );
			currentValues[ block.id ] = value;
			return value;
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
			var value = this.executes.get(block.depending[ 0 ], content, local );
			currentValues[block.id] = {values: {}, order: []};

			if( value && value.length ){
				var result = "";
				for(var i = 0; i < value.length; i++) {
					var rand = this.executes.random();
					currentValues[ block.id ].values[ rand ] = {};
					currentValues[block.id].order.push( rand );
					var detailPrefix = prefix + this.executes.options.prefixDelimiter + block.id + ':' + rand;
					this.executes.set( block.depending[2], value[i], local );
					result += tempartCompiler._handleBlocks( block.contains, content, local, currentValues[ block.id ].values[ rand ], dirties, path, detailPrefix );
				}
				return result;
			} else {
				var elsePrefix = prefix + this.executes.options.prefixDelimiter + block.id;
				return tempartCompiler._handleBlocks( block.elseContains, content, local, currentValues, dirties, path, elsePrefix);
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
			unset: function( key, scope ){
				delete scope[key];
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
		},
		dirties: {
			////-----------------------------------------------------------------------------------------
			// only changed values should be iterated, or when in contains dependings something changed
			each: function( block, content, local, currentValues, dirties, path, prefix ){
				var previous = currentValues[ block.id ];
				var key = block.depending[ 0 ];
				if( dirties[ key ] !== undefined ){
					var types = ['prepend', 'append'];
					for( var i = 0; i < types.length; i++ ){
						var type  = types[ i ];
						var value = dirties[ key ][ type ];
						if( value.length ){
							tempartCompiler.types.executes.set( key, value, local );
							var tmpCurrentValues = {};
							var result = tempartCompiler.types[ block.type ]( block, content, local, tmpCurrentValues, '*', path, prefix );
							for( var orderIndex = 0; orderIndex < tmpCurrentValues[ block.id ].order.length; orderIndex++ ) {
								var rand = null;
								if( type == 'append' ){
									rand =  tmpCurrentValues[ block.id ].order[ orderIndex ];
									currentValues[ block.id ].order.push( rand );
								} else {
									var order = tmpCurrentValues[ block.id ].order;
									rand =  order[ order.length - orderIndex - 1];
									currentValues[ block.id ].order.unshift( rand );
								}
								currentValues[ block.id ].values[ rand ] = tmpCurrentValues[ block.id ].values[ rand ];
							}
							tempartCompiler.dom[ type ]( prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id, result );
							tempartCompiler.types.executes.unset( key, local ); // @FIXME is this actually needed?
						}
					}
				} else {
					// @TODO searchblocks
					throw "Not yet implemented";
				}
				
			},
			////-----------------------------------------------------------------------------------------
			// checks if a variable changed
			variable: function( block, content, local, currentValues, dirties, path, prefix ){
				var previous = currentValues[ block.id ];
				var now      = tempartCompiler.types[ block.type ]( block, content, local, currentValues, dirties );
				if( previous != now ){
					debugger;
				}
			},
			////-----------------------------------------------------------------------------------------
			// an echo of a constant never changes
			echo: function() {},
			////-----------------------------------------------------------------------------------------
			// only updates when something is different, or an contains depending changed
			// @TODO
			if: function() {

			},
			////-----------------------------------------------------------------------------------------
			// I actually don't know what exactly will happen here, some dependencieneeds to be done...
			// @TODO
			partial: function() {

			}
		},
	};

	tempartCompiler.dom = {
		prepend: function( prefix, html ){
			this.obj( prefix, tempartCompiler.types.executes.options.attrStart).after( html );
		},
		append: function( prefix, html ){
			this.obj( prefix, tempartCompiler.types.executes.options.attrEnd).before( html );
		},
		obj: function( prefix, attr ){
			return $('[' + attr + '=' + prefix + ']' );
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
