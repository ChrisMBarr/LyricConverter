var parser = (function(){

	//Init some vars to be used all over the place!
	var $songTitle;
	var $songInfoList;
	var $songSlideContainer;
	var $errorContainer;

	var setup={
		pageInit:function(){
			//If the browser does not nativly support Base64 encode/decode,
			//load in a file to add this support
			Modernizr.load({
				test: window.atob && window.btoa,
				nope: "js/base64.js"
			});

			//Fill in the variables
			$songTitle = $("#song-title");
			$songInfoList = $("#song-info");
			$songSlideContainer = $("#song-slides");
			$errorContainer = $("#error-display");

			if(Modernizr.draganddrop && window.FileReader){
				setup.fileDragAndDrop();
			}else{
				//no drag-n-drop support
				_displayError("Your browser does not support file Drag-N-Drop!")
			}
		},
		fileDragAndDrop:function(){
			$("#drop-area").fileDragAndDrop(function(data, fileName){
				//Empty out the UI so we can put in new data...
				song.resetUI();
				try{
					//Browsers will add some unneeded text to the base64 encoding. Remove it.
					var encodedSong = data.replace("data:text/xml;base64,","");
					var decodedSong = utilities.decode(encodedSong);

					//Pass the decoded song date to the parser
					song.initParse(decodedSong);

					//Now make all the slides have the same height
					setup.equalSlideHeights();
				}catch(ex){
					_displayError("There was an error reading the file <strong>"+fileName+"</strong><br/>Is this a ProPresenter file?")
				}
			});
		},
		equalSlideHeights:function(){
			var currentTallest = 0;

			var $slideContent = $("#song-slides")
			.children()
			.children(".content");

			$slideContent.each(function(i){
					if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
				});

			$slideContent.css({'min-height': currentTallest}); 
		}
	};

	var utilities = {
		decode: function(str){
			return decodeURIComponent(escape(window.atob( str )));
		},
		encode:function(str){
			return window.btoa(unescape(encodeURIComponent( str )));
		},
		stripRtf:function(str){
			//var pattern = /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
			var basicRtfPattern = /\{\*?\\[^{}]+}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
			var newLineSlashesPattern = /\\\n/g;

			var stripped = str.replace(basicRtfPattern,"");
			var removeNewlineSlashes = stripped.replace(newLineSlashesPattern, "\n")
			var removeWhitespace = removeNewlineSlashes.trim();

			return removeWhitespace;
		}
	}

	var song = {
		initParse:function(content){
			//select the top-level document element
			var $presentationDoc = $(content);

			if($presentationDoc.length<=0){
				$.error("error reading file!")
			}else{
				//Parse the song info by passing in the arributes object
				song.info($presentationDoc.get(0).attributes)

				//Parse the slides by passing them all in
				song.slides($presentationDoc.children("slides").children());
			}
		},
		info:function(infoAttributes){
			//An array of attributes that we don't need to display in the UI
			var itemsToRemove = ['height','width','cclisongtitle','cclidisplay','versionnumber','doctype','creatorcode','lastdateused', 'usedcount','backgroundcolor','drawingbackgroundcolor',];

			//Loop through all the passed in attributes
			$.each(infoAttributes, function(i, thisAttr){

				//Continue only if the attribute is not in the array above AND the value is not blank
				if($.inArray(thisAttr.name, itemsToRemove) < 0 && thisAttr.value !== ""){
					$("<li>"+thisAttr.name+": <strong>"+thisAttr.value+"</strong></li>").appendTo($songInfoList);
				}
			});

			//Special case - Set the date. Parse it to a human readable date!
			var lastUsedDate = new Date(Date.parse(infoAttributes.lastdateused.value));
			if(!isNaN(lastUsedDate.getTime())){
				$("<li>Last Used On: <strong>"+lastUsedDate+"</strong></li>").appendTo($songInfoList);
			}

			//Special case - Set the song title
			$songTitle.text(infoAttributes.cclisongtitle.value)
		},
		slides:function($slides){

			if($slides.length>0) $songSlideContainer.show();

			//Loop through all the passed in slides
			$slides.each(function(i, el){
				var $thisSlide = $(el);

				//Get the slide label. If it's blank add in a space so it still renders correctly in the UI
				var labelText = $.trim($thisSlide.attr("label"));
				if (labelText === "") labelText = "&nbsp;";

				//Grab the base64 encoded data from the slide element, decode it, the strip off the RTF formatting
				var encodedRtfData = $thisSlide.find("rvtextelement").attr("rtfdata");
				var decodedRtfData = utilities.decode(encodedRtfData);
				var lyricsText = utilities.stripRtf(decodedRtfData);

				//Create a new HTML clide and add it to the DOM
				$("<div class='slide'><div class='content'>"+lyricsText+"</div><div class='label'>"+labelText+"</div></div>")
					.appendTo($songSlideContainer);
			});
		},
		resetUI:function(){
			$errorContainer.empty().hide();
			$songTitle.text("");
			$songInfoList.empty();
			$songSlideContainer.empty().hide();
		}
	}

	function _displayError(msg){
		$errorContainer.show().html(msg);
	}

	//Run this on page load
	$(setup.pageInit);
})();