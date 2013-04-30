/*=====================================================
 * PARSER for ProPresenter 4 files
 * Extension: .pro4
 * Site: http://www.renewedvision.com/propresenter.php
=======================================================*/

(function () {

	var THIS_FORMAT = 'propresenter';
	parser.formats[THIS_FORMAT] = {};

	parser.formats[THIS_FORMAT].testExtension = function(fileExt){
		return /pro\d+/i.test(fileExt);
	};

	//Extend the formats object on the parser to allow for parsing ProPresenter files
	parser.formats[THIS_FORMAT].convert = function(songData, fileName){
		
		//select the top-level document element
		var $presentationDoc = $(songData);

		//Collect all the attributes to parse later
		var attrs = $presentationDoc.get(0).attributes;
			
		//Collect all the sides to parse later
		var $slides = $presentationDoc.children("slides").children();

		//Make sure the title is filled in, if not use the filename
		var songTitle = (typeof attrs.cclisongtitle === "string" && attrs.cclisongtitle.length > 0) ? attrs.cclisongtitle.value : fileName;

		//Fill in the filled-in song object
		return {
			title: songTitle,
			info: _getInfo(attrs),
			slides: _getSlides($slides)
		};
	};

	//===================================
	//PRIVATE FUNCTIONS
	//===================================
	function _getSlides($slides){
		var songSlides = [];

		//Loop through all the passed in slides
		$slides.each(function(i, el){
			var $thisSlide = $(el);

			var labelText = $.trim($thisSlide.attr("label"));

			//Grab the base64 encoded data from the slide element, decode it, the strip off the RTF formatting
			var encodedRtfData = $thisSlide.find("rvtextelement").attr("rtfdata");
			var decodedRtfData = parser.utilities.decode(encodedRtfData);
			var lyricsText = _stripRtf(decodedRtfData);

			songSlides.push({
				"title":labelText,
				"lyrics":lyricsText
			});
		});

		return songSlides;
	}

	function _getInfo(infoAttributes){
		//An array of attributes that we don't need to display in the UI
		var itemsToRemove = ['height','width','cclisongtitle','cclidisplay','versionnumber','doctype','creatorcode','lastdateused', 'usedcount','backgroundcolor','drawingbackgroundcolor'];

		var songInfo = [];

		//Loop through all the passed in attributes
		$.each(infoAttributes, function(i, thisAttr){

			//Continue only if the attribute is not in the array above AND the value is not blank
			if($.inArray(thisAttr.name, itemsToRemove) < 0 && thisAttr.value !== ""){
				songInfo.push({
					"name": thisAttr.name,
					"value": thisAttr.value
				});
			}
		});

		//Special case - Set the date. Parse it to a human readable date!
		var lastUsedDate = new Date(Date.parse(infoAttributes.lastdateused.value));
		if(!isNaN(lastUsedDate.getTime())){
			songInfo.push({
				"name": "Last Used On",
				"value":lastUsedDate
			});
		}

		return songInfo;
	}

	function _stripRtf(str){
		//var pattern = /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
		var basicRtfPattern = /\{\*?\\[^{}]+}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
		var newLineSlashesPattern = /\\\n/g;

		var stripped = str.replace(basicRtfPattern,"");
		var removeNewlineSlashes = stripped.replace(newLineSlashesPattern, "\n");
		var removeWhitespace = removeNewlineSlashes.trim();

		return removeWhitespace;
	}
})();