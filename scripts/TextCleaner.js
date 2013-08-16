//NOTE: This file MUST be saved in Windows 1252 character encoding or else it WILL NOT WORK!!!

var TextCleaner = (function () {
	
	//List out the Windows1252 strinsg that are representative of UTF-8 strings
	var toReplace = ["€","À","�","‚","Â","ƒ","Ã","„","Ä","…","Å","�","Æ","‡","Ç","ˆ","È","‰","É","�","Ê","‹","Ë","Œ","Ì","�","Ž","Î","�","�","‘","Ñ","’","Ò","“","Ó","�","Ô","•","Õ","–","Ö","—","×","˜","Ø","™","Ù","š","Ú","›","Û","œ","Ü","�","ž","Þ","Ÿ","ß","�","¡","á","¢","â","£","ã","¤","ä","¥","å","¦","æ","§","ç","¨","è","©","é","ª","ê","«","ë","¬","ì","­","í","®","î","¯","ï","°","ð","±","ñ","²","ò","³","ó","´","ô","µ","õ","¶","ö","·","÷","¸","ø","¹","ù","º","ú","»","û","¼","ü","½","ý","¾","þ","¿","ÿ"];
	
	//List out the UTF-8 string that we want to get back
	var replaceWith = ["�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�"];
	
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