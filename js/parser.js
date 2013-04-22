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
				displayError("Your browser does not support file Drag-N-Drop!")
			}
		},
		fileDragAndDrop:function(){
			$("#drop-area").fileDragAndDrop(function(data, fileName){
				//Empty out the UI so we can put in new data...
				resetUI();

				//try{

					//Find the file extention
					var fileExt = fileName.split(".").slice(-1)[0].toLowerCase();

					//Make sure the file extention matches up with an existing parser
					if($.isFunction(parser.formats[fileExt])){
						//Browsers will add some unneeded text to the base64 encoding. Remove it.
						var encodedSongData = data.replace("data:text/xml;base64,","");
						var decodedSongData = utilities.decode(encodedSongData);

						//Pass the decoded song date to the parser
						//We will get back a normalized version of teh song content for any file type
						var normalizedSongData = parser.formats[fileExt](decodedSongData);

						//Create some slides with the normalized song data
						createSlides(normalizedSongData);

						//Now make all the slides have the same height
						setup.equalSlideHeights();
					}else{
						displayError("The file <strong>"+fileName+"</strong> cannot be parsed because <strong>."+fileExt.toUpperCase()+"</strong> is not a supported file type!")
					}
				//}catch(ex){
					//displayError("There was an error reading the file <strong>"+fileName+"</strong>");
				//}
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
		}
	}


	function createSlides(songData){
		console.log(songData);

		$songTitle.text(songData.title);

		//Add the title
		if(songData.slides.length>0) $songSlideContainer.show();

		//Add each info item
		for (var i = songData.info.length - 1; i >= 0; i--) {
			var s = songData.info[i];

			$("<li><strong>"+s.name+":</strong> "+s.value+"</li>").appendTo($songInfoList);
		};

		//Output the slides themselves
		for (var i = songData.slides.length - 1; i >= 0; i--) {
			var s = songData.slides[i];

			//Create a new HTML clide and add it to the DOM
			$("<div class='slide'><div class='content'>"+s.lyrics+"</div><div class='label'>"+s.title+"</div></div>").appendTo($songSlideContainer);
		};

		
	}

	function resetUI(){
		$errorContainer.empty().hide();
		$songTitle.text("");
		$songInfoList.empty();
		$songSlideContainer.empty().hide();
	}

	function displayError(msg){
		$errorContainer.show().html(msg);
	}

	//Run this on page load
	$(setup.pageInit);

	return {
		utilities: utilities,
		displayError: displayError,
		formats:{} //Filled in by other files
	}
})();