// tempart templating library

;(function(tempartParser) {
	////-----------------------------------------------------------------------------------------
	// id generator for the blocks, needs to be global because of the recusion
	tempartParser._increment = 0;
	////-----------------------------------------------------------------------------------------
	// defines what commands need an {{/end}}
	tempartParser.needsEnd = [ 'if', 'each' ];
	////-----------------------------------------------------------------------------------------
	// Precompiles the html and generates json-arrays
	tempartParser.parse = function( templateContent ){
		this._increment = 0;
		templateContent = this._escapeSpecials( templateContent );

		if( templateContent.indexOf( '{{' ) === 0 ){
			templateContent = templateContent.slice( 2, templateContent.length );
		} else {
			templateContent = this._addEcho( templateContent );
		}
		// @TODO add check if open-blocks are the same as end-blocks
		var searches = templateContent.split( '{{' );
		return this._parseBlocks( searches ).content;
	};
	////-----------------------------------------------------------------------------------------
	// takes an array of commands
	tempartParser._parseBlocks = function( blocks ){
		var result = [];
		var end    = null;
		var done   = false;
		while( blocks.length && !done){
			var parsedBlocks = this._parseBlock( blocks, result );
			for( var i = 0; i < parsedBlocks.length; i++ ){
				var block = parsedBlocks[ i ];
				if( block == 'end' || block == 'else' ){ // @TODO improve!
					end = block;
					done = true;
					break;
				} else if( block ){
					block.id = this._increment;
					result.push( block );
					this._increment++;
				}
			}
		}
		return {content: result, end: end};
	};
	////-----------------------------------------------------------------------------------------
	// parses one command and adds new ones if needed
	tempartParser._parseBlock = function( blocks ){
		var block = blocks[ 0 ];
		var result = [{}];
		var end = this._getEnd( block);
		var type = block.slice( 0, end ).split( ' ' );
		var gotRemoved = false;
		if( type[ 0 ][ 0 ] == '>' ) {
			result[ 0 ].type = 'partial';
			result[ 0 ].path = type[ 0 ].slice( 1, type[ 0 ].length );
		} else if( type[ 0 ][ 0 ] == '/' ) {
			// @TODO add for debugging purpose a check if this was the one which was last opened
			result[ 0 ] = 'end';
		} else if( type[ 0 ] == '#else' ) {
			result[ 0 ] = 'else';
		} else if( type[ 0 ][ 0 ] == '#' ) {
			result[ 0 ].type = type[ 0 ].slice( 1, type[ 0 ].length );
			type.shift();
			if( type.length ) result[ 0 ].depending = type;
			if( result[ 0 ].type == 'echo' ){
				result[ 0 ].content  = block.slice( end + 2, block.length );
				gotRemoved = true;
				blocks.shift();
				if( this._isInsideHtml( result[ 0 ].content )){
					this._buildBindAttr( result, blocks );
				}
			}
		} else {
			result[ 0 ].type = 'variable';
			result[ 0 ].depending = [ type[ 0 ] ];
		}

		if(!gotRemoved) blocks.shift();

		this._handleOverlength( block, blocks );
		this._handleElse( result[ 0 ], blocks );

		return result;
	};
	////-----------------------------------------------------------------------------------------
	// Checks if an block-has the {{else}} possibility and adds elseContains
	tempartParser._handleElse = function( result, blocks ){
		if( this.needsEnd.indexOf( result.type ) != -1 ){
			var contains = this._parseBlocks( blocks );
			if( contains ){
				result.contains = contains.content;
				if( contains.end == 'else' ){
					result.elseContains = this._parseBlocks( blocks ).content;
				} else {
					result.elseContains = [];
				}
			}
		}
	};
	////-----------------------------------------------------------------------------------------
	// Checks if an block has an html-string behind it
	tempartParser._handleOverlength = function( block, blocks ){
		var end = this._getEnd( block );
		if( block.length > end + 2 && block.slice( 0, end ) != '#echo' ){ // Handling of not-variable stuff
			blocks.unshift(this._addEcho( block.slice( end + 2, block.length )));
		}
	};
	tempartParser._buildBindAttr = function( result, blocks ){
		var block               = blocks[ 0 ];
		var detailResult        = result[ 0 ];
		var lastElementPosition = detailResult.content.lastIndexOf( '>' );
		var content             = block[ 0 ].content;
		var done                = false;
		while( this._isInsideHtml( detailResult.content )){
			if( blocks[ 0 ].indexOf( '#echo' ) === 0 ){
				var end = blocks[ 0 ].indexOf( '>' );
				if( end === -1 ){
					detailResult.content += blocks[ 0 ].slice( this._getEnd( blocks[ 0 ] ) + 2, blocks[ 0 ].length);
					blocks.shift();
				} else {
					done = true;
					detailResult.content += blocks[ 0 ].slice( this._getEnd( blocks[ 0 ] ) + 2, end + 1);
					blocks[ 0 ]           = this._addEcho( blocks[0].slice( end + 2, blocks[ 0 ].length ));
					break;
				}
			} else {
				if( !detailResult.contains ) detailResult.contains = [];
				var contains = this._parseBlock( blocks );
				if( contains.length > 1) throw 'Something weird is happening here';
				detailResult.contains.push( contains[ 0 ]);
			}
		}
		if( lastElementPosition === 0 ){
			detailResult.type = 'bindAttr';
			detailResult.depending = [];
			throw 'Not done yet!';
		} else {
			var bindAttr = '#bindAttr ';
		}
	};
	////-----------------------------------------------------------------------------------------
	// plain html without any variable
	tempartParser._addEcho = function( echo ){
		return '#echo}}' +  echo;
	};
	////-----------------------------------------------------------------------------------------
	// returns int on which position the }} are existent
	tempartParser._getEnd = function( block ){
		return block.indexOf( '}}' );
	};
	////-----------------------------------------------------------------------------------------
	// escaping backslashes, single quotes, and newlines
	tempartParser._escapeSpecials = function( templateContent ){
		return templateContent;
		// return templateContent.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\r/g, '');
	};
	tempartParser._countOpen = function( templateContent ){
		return ( templateContent.match( /</g  ) || []).length;
	};

	tempartParser._countClose = function( templateContent ){
		return ( templateContent.match( />/g  ) || []).length;
	};

	tempartParser._isInsideHtml = function( templateContent ){
		// Counts the opening and closing tags
		if( this._countOpen( templateContent ) === this._countClose( templateContent )) {
			return false;
		} else {
			return true;
		}
	};
}(typeof module == 'object' ? module.exports : window.tempartParser = {}));