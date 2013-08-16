//NOTE: This file MUST be saved in Windows 1252 character encoding or else it WILL NOT WORK!!!

var TextCleaner = (function () {
	
	//List out the Windows1252 strinsg that are representative of UTF-8 strings
	var toReplace = ["â‚¬","Ã€","Ã","â€š","Ã‚","Æ’","Ãƒ","â€ž","Ã„","â€¦","Ã…","â€","Ã†","â€¡","Ã‡","Ë†","Ãˆ","â€°","Ã‰","Å","ÃŠ","â€¹","Ã‹","Å’","ÃŒ","Ã","Å½","ÃŽ","Ã","Ã","â€˜","Ã‘","â€™","Ã’","â€œ","Ã“","â€","Ã”","â€¢","Ã•","â€“","Ã–","â€”","Ã—","Ëœ","Ã˜","â„¢","Ã™","Å¡","Ãš","â€º","Ã›","Å“","Ãœ","Ã","Å¾","Ãž","Å¸","ÃŸ","Ã","Â¡","Ã¡","Â¢","Ã¢","Â£","Ã£","Â¤","Ã¤","Â¥","Ã¥","Â¦","Ã¦","Â§","Ã§","Â¨","Ã¨","Â©","Ã©","Âª","Ãª","Â«","Ã«","Â¬","Ã¬","Â­","Ã­","Â®","Ã®","Â¯","Ã¯","Â°","Ã°","Â±","Ã±","Â²","Ã²","Â³","Ã³","Â´","Ã´","Âµ","Ãµ","Â¶","Ã¶","Â·","Ã·","Â¸","Ã¸","Â¹","Ã¹","Âº","Ãº","Â»","Ã»","Â¼","Ã¼","Â½","Ã½","Â¾","Ã¾","Â¿","Ã¿"];
	
	//List out the UTF-8 string that we want to get back
	var replaceWith = ["€","À","Á","‚","Â","ƒ","Ã","„","Ä","…","Å","†","Æ","‡","Ç","ˆ","È","‰","É","Š","Ê","‹","Ë","Œ","Ì","Í","Ž","Î","Ï","Ð","‘","Ñ","’","Ò","“","Ó","”","Ô","•","Õ","–","Ö","—","×","˜","Ø","™","Ù","š","Ú","›","Û","œ","Ü","Ý","ž","Þ","Ÿ","ß","à","¡","á","¢","â","£","ã","¤","ä","¥","å","¦","æ","§","ç","¨","è","©","é","ª","ê","«","ë","¬","ì","­","í","®","î","¯","ï","°","ð","±","ñ","²","ò","³","ó","´","ô","µ","õ","¶","ö","·","÷","¸","ø","¹","ù","º","ú","»","û","¼","ü","½","ý","¾","þ","¿","ÿ"];
	
	//Create an object map to associate the two arrays so we can look up a string and find it's replacement
	var map = {};
	for (var i=0; i<toReplace.length; i++) {
		map[toReplace[i]] = replaceWith[i];
	}

	//Now that we have a map, let's sort the haystack from longerst to shortest
	toReplace.sort(function(a,b){
		return b.length - a.length;
	});

	//Build up a regular expression to find the strings to replace
	var expression = new RegExp(toReplace.join("|"), "g");

	//Public function to convert from win1252 to UTF-8
	function convertWin1252ToUtf8(source) {
		//Use teh RegEx to search the string for matches, then replace any of them with the corresponding replacement string
		return source.replace(expression, function(m) {
			return map[m] || "";
		});
	}

	return{
		ConvertWin1252ToUtf8: convertWin1252ToUtf8
	};
})();