// tempart templating library

;(function(tempartCompiler) {
	////-----------------------------------------------------------------------------------------
	// you need to overwrite this function, to have working partial support
	tempartCompiler.partial = function( block, context, currentValues, dirties, path, opt ){
		// @TODO do a better api for that..
		console.error('Overwrite the function tempartCompiler.partial to have partials');
		return '';
	};
	////-----------------------------------------------------------------------------------------
	// you need to overwrite this function, to have working partial support
	tempartCompiler.trigger = function( componentId, action, parameter ){
		console.error('Overwrite the function tempartCompiler.trigger to have events');
		return '';
	};

	////-----------------------------------------------------------------------------------------
	// parses dataattribute tempartStart, to return an array of block ids
	tempartCompiler.getBlockIds = function( ele ){
		for( var i = 0; i < ele.attributes.length; i++ ){
			if( ele.attributes[i].nodeName === tempartCompiler.types.executes.options.attrStart.toLowerCase() ){ // Has to be lowercase, because of standard
				return ele.attributes[i].nodeValue.split('-');
			}
		}
		throw 'Getting the blockids went wrong';
	};

	////-----------------------------------------------------------------------------------------
	// an object which holds all block-callbacks
	// {prefix-block.id: callback}
	tempartCompiler.eventCallbacks = {};
	////-----------------------------------------------------------------------------------------
	// returns the html and adds context to currentValues
	// path is not used, it only is passed to partial
	// expected properties of opt:
	// blocks, content, currentValues, dirties, path, prefix
	// dirties: [
	//	{op: 'insert',          to: 0, key: ['todos'], values: []},
	//	{op: 'update',          to: 1, key: ['todos'], value:  []}
	//	{op: 'move',   from: 4, to: 3, key: ['todos']},
	//	{op: 'remove', from: 4,        key: ['todos']}
	// ]
	tempartCompiler.compile = function( opt ){
		if(!opt.currentValues) opt.currentValues = {};
		if(!opt.dirties)       opt.dirties = '*';
		if(!opt.path)          opt.path = '/';
		if(!opt.prefix)        opt.prefix = '';
		var local = {};
		return this._handleBlocks(opt.blocks, opt.content, local, opt.currentValues, opt.dirties, opt.path, opt.prefix, opt);
	};

	////-----------------------------------------------------------------------------------------
	// iterates threw the block on one level and calls the type-handler
	tempartCompiler._handleBlocks = function( blocks, content, local, currentValues, dirties, path, prefix, opt ){
		var result = "";
		for( var i = 0; i < blocks.length; i++ ){
			result += this._handleBlock( blocks[i], content, local, currentValues, dirties, path, prefix, opt );
		}
		return result;
	};
	////-----------------------------------------------------------------------------------------
	// returns the compiled block, depending on the inserted data
	tempartCompiler._handleBlock = function( block, content, local, currentValues, dirties, path, prefix, opt ){
		var detailPrefix = prefix + this.types.executes.options.prefixDelimiter + block.id;
		if(block.type === 'log' || block.type === 'dom' ){ // No need for pre and suffix at log/attribute-bindings
			if( dirties === '*' ){
				return this.types[block.type]( block, content, local, currentValues, dirties, path, prefix, opt );
			} else {
				return this.types.dirties[block.type]( block, content, local, currentValues, dirties, path, prefix, opt );
			}
		} else {
			if( dirties === '*' ){
				return this.types.executes.prefix( detailPrefix ) + this.types[ block.type ]( block, content, local, currentValues, dirties, path, prefix, opt ) + this.types.executes.suffix( detailPrefix );
			} else {
				return this.types.dirties[ block.type ]( block, content, local, currentValues, dirties, path, prefix, opt );
			}
		}
	};

	////-----------------------------------------------------------------------------------------
	// Checks if anything given has a dependency - recusivly
	tempartCompiler._hasDependency = function( blocks, dirties, exclude ){
		var result = [];
		for( var blockIndex = 0; blockIndex < blocks.length; blockIndex++ ){
			var block = blocks[ blockIndex];
			if( block.depending ){
				for( var dependingIndex = 0; dependingIndex < block.depending.length; dependingIndex++ ){
					var depending = block.depending[ dependingIndex ];
					if( dirties.hasOwnProperty( depending ) && depending != exclude ) {
						result.push( block );
					}
				}
			}

			var containTypes = ['contains', 'elseContains'];
			for( var containIndex = 0; containIndex < containTypes.length; containIndex++ ){
				if( block[ containTypes[ containIndex ]]){
					var childrenDependency = this._hasDependency( block[ containTypes[ containIndex ]], dirties, exclude );

					if( result ){ // Only stopping when i found something
						result.push( block );
					}
				}
			}
		}
		return result;
	};

	////-----------------------------------------------------------------------------------------
	// logic xor
	tempartCompiler.xor = function(a,b) {
		return ( a || b ) && !( a && b );
	};

	// Is used
	tempartCompiler.locals = {
		_generate: function(ids, blocks, content, local, currentValues, offset) {
			var idParts = ids[ offset ].split(':');
			for( var i = 0; i < blocks.length; i++) {
				block = blocks[i];
				if(block.id == idParts[0]) {
					tempartCompiler.locals[block.type](ids, idParts, blocks, block, content, local, currentValues, offset + 1);
				}
			}
		},
		each: function(ids, idParts, blocks, block, content, local, currentValues, offset) {
			if(!currentValues[ idParts[ 0 ]].order.length) {
				throw 'each-else events are not yet implemented';
			}
			var value = tempartCompiler.types.executes.get( block.depending[ 0 ], content, local );
			for(var i = 0; i < currentValues[ idParts[ 0 ]].order.length; i++) {
				if( idParts[ 1 ] === currentValues[ idParts[ 0 ]].order[ i ]) {
					tempartCompiler.types.executes.set( block.depending[ block.depending.length - 1 ], value[ i ], local );
					if(block.depending.length > 2) {
						tempartCompiler.types.executes.set( block.depending[1 ], i, local );
					}
					tempartCompiler.locals._generate(ids, blocks, content, local, currentValues[ idParts[ 0 ]], offset);
				}
			}

		}
	};

	////-----------------------------------------------------------------------------------------
	// Contains the possible handlers
	tempartCompiler.types = {
		////-----------------------------------------------------------------------------------------
		// checks if a variable changed and update its attribute
		dom: function( block, content, local, currentValues, dirties, path, prefix, opt ){
			var result = block.content;
			result += ' ' + this.executes.options.attrStart + '="' +prefix + this.executes.options.prefixDelimiter + block.id + '"';
			// @TODO is it a good idea to add attrEnd?
			// result += this.executes.options.attrEnd   + '="' +prefix + this.executes.options.prefixDelimiter + block.id + '"';
			currentValues[ block.id ] = {};
			for( var i = 0; i < block.order.length; i++ ){
				var dependingBlock = block.contains[ i ];
				var blockContent = this[ dependingBlock.type ]( dependingBlock, content, local, currentValues[ block.id ], dirties, path, prefix, opt );
				if( block.order[ i ]){ // Not every block needs a attribute (events zb)
					result += block.order[ i ] + '="' + blockContent + '" ';
				} else {
					result += blockContent;
				}
			}
			result += '>';
			return result;
		},
		////-----------------------------------------------------------------------------------------
		// returns a variable
		variable: function( block, content, local, currentValues, dirties ){
			var value = this.executes.get( block.depending[ 0 ], content, local );
			if( value === undefined || value === null ) value = '';
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
			var type = this.executes.condition( block.depending[ 0 ], content, local );
			currentValues[ block.id ] = {type: type, contains: {}};
			prefix += this.executes.options.prefixDelimiter + block.id;

			return tempartCompiler._handleBlocks(block[type], content, local, currentValues[block.id].contains, dirties, path, prefix );
		},
		////-----------------------------------------------------------------------------------------
		// sets a variable of an array and calls handleBlocks in the containing level
		each: function( block, content, local, currentValues, dirties, path, prefix, opt ) {
			var value = this.executes.get( block.depending[ 0 ], content, local );
			return this._each( block, content, local, currentValues, dirties, path, prefix, opt, value, 0);
		},
		_each: function( block, content, local, currentValues, dirties, path, prefix, opt, values, contentOffset) {
			if(!currentValues[ block.id ]) {
				currentValues[ block.id ] = {values: {}, order: []};
			}
			if( values && values.length ){
				var result = "";
				for(var i = 0; i < values.length; i++) {
					var rand = this.executes.random();
					currentValues[ block.id ].values[ rand ] = {};
					currentValues[ block.id ].order.splice( i + contentOffset, 0, rand );
					var detailPrefix = prefix + this.executes.options.prefixDelimiter + block.id + ':' + rand;
					this.executes.set( block.depending[ block.depending.length - 1 ], values[i], local );
					if( block.depending.length > 2) {
						this.executes.set( block.depending[ 1 ], i + contentOffset, local );
					}

					result += tempartCompiler._handleBlocks( block.contains, content, local, currentValues[ block.id ].values[ rand ], dirties, path, detailPrefix, opt );
					//	this.executes.unset( block.depending[ block.depending.length - 1 ], local );
					//	if( block.depending.length > 2) {
					//		this.executes.unset( block.depending[ 1 ], local );
					//	}
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
			return '';
		},
		////-----------------------------------------------------------------------------------------
		// patial handler, for rewriting contexts and stuff
		partial: function( block, content, local, currentValues, dirties, path ) {
			if( block.path !== '/' ){
				path = path + '/' + block.path;
			}
			return tempartCompiler.partial(block, content, currentValues, dirties, path);
		},
		////-----------------------------------------------------------------------------------------
		// Adds element listeners
		event: function( block, content, local, currentValues, dirties, path, prefix, opt ) {
			var type    = null;
			var action  = null;
			var result  = '';
			var eventId = opt.prefix + '-' + block.id;
			currentValues[ block.id ] = {values: {}, parameter: []};
			for( var i = 0; i < block.dependingNames.length; i++ ) {
				if(block.dependingNames[ i ] === null) {
					currentValues[ block.id ].parameter.push(this.executes.get(block.depending[ i ], content, local));
				} else {
					currentValues[ block.id ].values[ block.dependingNames[ i ]] = this.executes.get(block.depending[ i ], content, local);
				}
			}
			if( !currentValues[ block.id ].values.type || !currentValues[ block.id ].values.action ) {
				throw 'Event definition was malformed';
			}
			if( !tempartCompiler.eventCallbacks[ eventId ]){
				tempartCompiler.eventCallbacks[eventId] = function( block, blocks, content, currentValues, obj ) {
					var ids         = tempartCompiler.getBlockIds( obj );
					var componentId = ids.shift();
					var local       = {};
					var parameter   = [];
					var action      = null;
					tempartCompiler.locals._generate(ids, blocks, content, local, currentValues, 0);

					for( var dependingIndex = 0; dependingIndex < block.dependingNames.length; dependingIndex++) {
						if(block.dependingNames[dependingIndex] === null) {
							parameter.push(tempartCompiler.types.executes.get( block.depending[ dependingIndex ], content, local ));
						} else if( block.dependingNames[dependingIndex] === 'action' ) {
							action = tempartCompiler.types.executes.get( block.depending[ dependingIndex ], content, local );
						}
					}
					if(!action) {
						throw "Could not find action parameter";
					}
					parameter.push(event); // In case the component wants the event
					tempartCompiler.trigger(componentId, action, parameter);
				}.bind( undefined, block, opt.blocks, content, opt.currentValues );
			}
			result = 'on' + currentValues[ block.id ].values.type.charAt(0).toUpperCase() + currentValues[ block.id ].values.type.slice(1) + '="tempartCompiler.eventCallbacks[`' + eventId + '`](this)"';
			return result;
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
				if( key[ 0 ] === '"' && key[ key.length - 1 ] === '"' ) {
					return key.slice( 1, key.length - 1 );
				} else {
					var scopes   = [ local, global ];
					var keyParts = key.split( '.' );
					for( var scopeIndex = 0 ; scopeIndex < scopes.length; scopeIndex++) {
						var value = scopes[ scopeIndex ];
						var keyPartIndex = 0;
						do {
							var keyNode = keyParts[ keyPartIndex ];
							keyPartIndex++;
							if( value.hasOwnProperty( keyNode )) {
								if(keyPartIndex === keyParts.length) {
									return value[ keyNode ];
								}
								value = value[ keyNode ];
							} else {
								break;
							}
						} while( keyPartIndex < keyParts.length );
					}
				}
			},
			////-----------------------------------------------------------------------------------------
			// sets things in the local space, we dont want to manipulate the original object
			set: function( key, value, scope ){
				scope[ key ] = value;
			},
			////-----------------------------------------------------------------------------------------
			// Removes some values from the local place
			unset: function( key, scope ){
				delete scope[key];
			},
			////-----------------------------------------------------------------------------------------
			// Inserts an value to a specific index to an array
			isertAt: function( arr, value, index){

			},
			////-----------------------------------------------------------------------------------------
			// Generates start-element of an block
			prefix: function( prefix ){
				return '<' +this.options.domNode+ ' ' +this.options.attrStart+ '="' +prefix + '"></' +this.options.domNode+ '>';
			},
			////-----------------------------------------------------------------------------------------
			// Generates end-element of an block
			suffix: function( suffix ){
				return '<' +this.options.domNode+ ' ' +this.options.attrEnd+ '="' +suffix + '"></' +this.options.domNode+ '>';
			},
			////-----------------------------------------------------------------------------------------
			// Generates a random string (needed for length changing #each)
			random: function() {
				return Math.random().toString(36).substring(7);
			},
			////-----------------------------------------------------------------------------------------
			// decides what type will be used
			condition: function( key, global, local ){
				if(this.get( key, global, local )) {
					return 'contains';
				} else {
					return 'elseContains';
				}
			},
			////-----------------------------------------------------------------------------------------
			// Checks if two arrays are the same
			isSame: function( parentKey, childKey ) {
				if(parentKey.length != childKey.length) {
					return false;
				} else {
					return this.isChild( parentKey, childKey );
				}
			},
			////-----------------------------------------------------------------------------------------
			// Checks if two arrays are beginning the same
			isChild: function( parentKey, childKey ){
				for(var i = 0; i < parentKey.length; i++) {
					if(parentKey[ i ] !== childKey[ i ]) {
						return false;
					}
				}
				return true;
			}
		},
		////-----------------------------------------------------------------------------------------
		// Special implementation of each lazy-block
		dirties: {
			////-----------------------------------------------------------------------------------------
			// only changed values should be iterated, or when in contains dependings something changed
			each: function( block, content, local, currentValues, dirties, path, prefix, opt ){
				var previous = currentValues[ block.id ];
				var keyParts = block.depending[ 0 ].split('.');
				var detailPrefix =  prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id;

				for( var i = 0; i < dirties.length; i++ ){
					var dirty = dirties[ i ];
					if( tempartCompiler.types.executes.isSame(keyParts, dirty.key)) {
						if(dirty.type === 'create') {
							var rand = currentValues[block.id].order[dirty.to - 1]; // Has to be in this position, else because ._each inserts to currentValues
							var result = tempartCompiler.types._each( block, content, local, currentValues, '*', path, prefix, opt, dirty.values, dirty.to);
							if( dirty.to === 0) {
								tempartCompiler.dom.append(prefix + '-' + block.id, result);
							} else {
								var lastBlock = block.contains[block.contains.length - 1].id;
								tempartCompiler.dom.append(prefix + '-' + block.id + ':' + rand + '-' + lastBlock, result);
							}
						} else if(dirty.type === 'update') {
							throw 'Not yet implemented'; // @TODO
						} else if(dirty.type === 'delete') {
							throw 'Not yet implemented'; // @TODO
						} else if(dirty.type === 'move') {
							throw 'Not yet implemented'; // @TODO
						} else {
							throw dirty.type + ' is no valid dirtytype';
						}
					}
				}
				this._eachDependencyHelper( block, content, local, currentValues, dirties, path, prefix, opt );
			},
			_eachDependencyHelper: function( block, content, local, currentValues, dirties, path, prefix, opt ){
				var previous = currentValues[ block.id ];
				var key = block.depending[ 0 ];
				var detailPrefix =  prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id;
				var eachIndex   = null;
				if( block.depending.length > 2 ) eachIndex = block.depending[ 1 ];
				if( !dirties[ key ] || !dirties[ key ].update.length ) { // No need to check inside dependencies, when update already triggered
					// Checks the dependencies, which are maybe defined outside the array scope
					for( var index in dirties ){
						if( dirties.hasOwnProperty( index ) && index != key ){
							var containType = 'elseContains';
							if( currentValues[block.id].order.length ) containType = 'contains';
							var dependencies = tempartCompiler._hasDependency( block[ containType ], dirties, key );
							if( dependencies.length){
								if( containType == 'contains' ){
									var values = tempartCompiler.types.executes.get( key, content, local );
									for( valueIndex = 0; valueIndex < values.length; valueIndex++ ){
										tempartCompiler.types.executes.set( key, values[ valueIndex ], local );
										for(var blockIndex        = 0; blockIndex < dependencies.length; blockIndex++ ) {
											var depencyBlock      = dependencies[ blockIndex ];
											var rand              = currentValues[ block.id ].order[ valueIndex ];
											var detailBlockPrefix = prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id + ':' + rand;
											if( eachIndex == index ){
												tempartCompiler.types.executes.set( eachIndex, valueIndex, local );
											}
											tempartCompiler.types.dirties[ depencyBlock.type ]( depencyBlock, content, local, currentValues[ block.id ].values[ rand ], dirties, path, detailBlockPrefix, opt );
											//	if( eachIndex == index ){
											//		tempartCompiler.types.executes.unset( eachIndex, local );
											//	}
										}
									}
									// tempartCompiler.types.executes.unset( key, local);
								} else {
									for(var elseBlockIndex = 0; elseBlockIndex < dependencies.length; elseBlockIndex++ ) {
										var elseDepencyBlock = dependencies[ elseBlockIndex ];
										tempartCompiler.types.dirties[ elseDepencyBlock.type ]( elseDepencyBlock, content, local, currentValues, dirties, path, detailPrefix );
									}
								}
							}
						}
					}
				}
			},
			////-----------------------------------------------------------------------------------------
			// checks if a variable changed and update its attribute
			dom: function( block, content, local, currentValues, dirties, path, prefix, opt ){
				for(var i = 0; i < block.order.length; i++) {
					var attribute = block.order[ i ];
					var dependingBlock = block.contains[ i ];
					for( var dependingIndex = 0; dependingIndex < dependingBlock.depending.length; dependingIndex++ ){
						var depending = dependingBlock.depending[dependingIndex];
						var oldValue = currentValues[ block.id ][ dependingBlock.id ];
						var newValue = tempartCompiler.types[dependingBlock.type]( dependingBlock, content, local, currentValues[ block.id ], dirties, path, prefix, opt );

						if(oldValue != newValue) {
							tempartCompiler.dom.updateAttribute(prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id, attribute, newValue);
						}
					}
				}
			},
			////-----------------------------------------------------------------------------------------
			// checks if a variable changed
			variable: function( block, content, local, currentValues, dirties, path, prefix ){
				var previous = currentValues[ block.id ];
				var now      = tempartCompiler.types[ block.type ]( block, content, local, currentValues, dirties );
				if( previous != now ){
					tempartCompiler.dom.update( prefix + tempartCompiler.types.executes.options.prefixDelimiter + block.id, now );
				}
			},
			////-----------------------------------------------------------------------------------------
			// an echo of a constant never changes
			echo: function() {},
			////-----------------------------------------------------------------------------------------
			// only updates when something is different, or an contains depending changed
			if: function( block, content, local, currentValues, dirties, path, prefix ) {
				var type = tempartCompiler.types.executes.condition( block.depending[ 0 ], content, local );
				prefix += tempartCompiler.types.executes.options.prefixDelimiter + block.id;
				if( currentValues[ block.id ].type == type ){
					return tempartCompiler._handleBlocks( block[ type ], content, local, currentValues[ block.id ].contains, dirties, path, prefix );
				} else {
					currentValues[ block.id ].type = type;
					var now = tempartCompiler._handleBlocks( block[ type ], content, local, currentValues[ block.id ].contains, '*', path, prefix );
					tempartCompiler.dom.remove( prefix );
					tempartCompiler.dom.append( prefix, now );
				}
				
			},
			////-----------------------------------------------------------------------------------------
			// I actually don't know what exactly will happen here, some dependencieneeds to be done...
			// @TODO
			partial: function() {

			}
		},
	};

	tempartCompiler.dom = {
		////-----------------------------------------------------------------------------------------
		// Puts the things where they belong
		prepend: function( id, html ){
			this.obj( id, tempartCompiler.types.executes.options.attrStart).insertAdjacentHTML( 'afterend', html );
		},
		////-----------------------------------------------------------------------------------------
		// Puts the things where they belong
		append: function( id, html ){
			this.obj( id, tempartCompiler.types.executes.options.attrEnd).insertAdjacentHTML( 'beforebegin', html );
		},
		////-----------------------------------------------------------------------------------------
		// Realises nextUntil and its replacement
		update: function( id, html ){
			var first = this.obj( id, tempartCompiler.types.executes.options.attrStart );
			var end   = this.obj( id, tempartCompiler.types.executes.options.attrEnd );
			while( first.nextSibling != end ) {
				first.nextSibling.remove(); // @FIXME I want to batch that, but how?
			}
			first.insertAdjacentHTML( 'afterend', html );
		},
		remove: function( id ){
			var first = this.obj( id, tempartCompiler.types.executes.options.attrStart );
			var end   = this.obj( id, tempartCompiler.types.executes.options.attrEnd );
			while( first.nextSibling != end ) {
				first.nextSibling.remove(); // @FIXME I want to batch that, but how?
			}
		},
		////-----------------------------------------------------------------------------------------
		// Updates only the attributes of an dom element
		updateAttribute: function( id, attribute, value ){
			var obj = this.obj( id, tempartCompiler.types.executes.options.attrStart);
			if( attribute === 'value' ){
				if( obj[attribute] != value ){
					obj[attribute] = value;
				}
			} else {
				if( obj.getAttribute(attribute) != value ){
					obj.setAttribute(attribute, value);
				}
			}
		},
		////-----------------------------------------------------------------------------------------
		// Searches for the right objects
		obj: function( id, attr ){
			var objs = document.querySelectorAll( '[' + attr + ']' );
			for(var i = 0; i < objs.length; i++) {
				var obj = objs[ i ];
				if( obj.getAttribute( attr ) === id ){
					return obj;
				}
			}
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartCompiler= {}));
