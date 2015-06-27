()=>{
	if(typeof module === 'object'){
		module.exports.tempart = {
			parser: Parser,
			compiler: Compiler
		};
	}else if(typeof window === 'object'){
		window.tempart = {
			Parser: Parser,
			Compiler: Compiler
		};
	}else{
		var tempart = {
			Parser: Parser,
			Compiler: Compiler
		};
	}
}();