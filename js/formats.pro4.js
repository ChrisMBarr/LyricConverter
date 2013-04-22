(function () {
	parser.formats.pro4 = function(content){
		
		//select the top-level document element
		var $presentationDoc = $(content);

		var song={
			title:"",
			info:[],
			slides:[]
		};

		if($presentationDoc.length<=0){
			parser.displayError("error reading PRO4 file!")
		}else{
			var attrs = $presentationDoc.get(0).attributes;

			song.title = attrs.cclisongtitle.value;

			//Parse the song info by passing in the arributes object
			song.info = _makeInfo(attrs);

			//Parse the slides by passing them all in
			song.slides = _makeSlides($presentationDoc.children("slides").children());
		}

		return song;
	};

	function _makeSlides($slides){
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

	function _makeInfo(infoAttributes){
		//An array of attributes that we don't need to display in the UI
		var itemsToRemove = ['height','width','cclisongtitle','cclidisplay','versionnumber','doctype','creatorcode','lastdateused', 'usedcount','backgroundcolor','drawingbackgroundcolor',];

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
		var removeNewlineSlashes = stripped.replace(newLineSlashesPattern, "\n")
		var removeWhitespace = removeNewlineSlashes.trim();

		return removeWhitespace;
	}
})();