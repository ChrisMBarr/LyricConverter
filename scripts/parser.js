/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */
 
var parser = (function(){

	var utilities = {
		decode: function(str){
			var decoded = window.atob( str );
			try{
				return decodeURIComponent(escape(decoded));
			}catch(ex){
				return decoded;
			}
		},
		encode:function(str){
			return window.btoa(unescape(encodeURIComponent( str )));
		}
	}

	function parseFile(i, fileObj){
		var data = fileObj.data;
		var fullFileName = fileObj.name;

		try{
			//Find the file extention
			var fileParts = fullFileName.split(".");
			var fileExt = fileParts.slice(-1)[0].toLowerCase();
			var fileName = fullFileName.replace(fileExt, '');

			//Browsers will add some unneeded text to the base64 encoding. Remove it.
			var encodedSongData = data.replace(/^data:.*;base64,/,"");
			var decodedSongData = utilities.decode(encodedSongData);
			

			//Test the file extension with the test function registered with each format type
			//When one matches, use that formats convert function
			var convertFn;
			$.each(parser.formats, function(format, formatObj){
				if(formatObj.testFormat(fileExt, decodedSongData)){
					convertFn = formatObj.convert;
					return false;
				}
			});

			//Make sure the convert function exists...
			if($.isFunction(convertFn)){
				//Pass the decoded song date to the convert function
				//We will get back a normalized version of the song content for the supported file type
				parser.songList.push({
					name: fileName,
					data: convertFn(decodedSongData, fileName)
				});

			}else{
				parser.errorList.push("The file <strong>"+fullFileName+"</strong> cannot be parsed because <strong>."+fileExt.toUpperCase()+"</strong> files are not supported!")
			}
		}catch(ex){
			console.error(ex);
			parser.errorList.push("There was an error reading the file <strong>"+fullFileName+"</strong>");
		}
	}

	function complete($outputContainer){
		if(parser.songList.length){
			//Pass the final song data to the selected output type
			parser.outputs[parser.outputFormat]($outputContainer, parser.songList);
		}
	}

	return {
		//Expose functions publicly
		utilities: utilities,
		parseFile: parseFile,
		complete: complete,
		outputFormat: null,
		
		//UI properties should be filled in when this is run
		displayError: null,
		songList:[],
		errorList:[],

		//These objects will be filled in when formatter & output files are run
		formats:{},
		outputs:{}
	}
})();