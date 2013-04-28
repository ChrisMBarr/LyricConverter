/*=====================================================
 * OUTPUT for displaying slide content in the browser as HTML
=======================================================*/

parser.outputs.display = (function(){

	//Init some vars to be used within this scope
	var $songTitle;
	var $songInfoList;
	var $songSlideContainer;

	function _init() {
		//Fill in the variables
		$songTitle = $("#song-title");
		$songInfoList = $("#song-info");
		$songSlideContainer = $("#slides-container");
	}

	//Extend the outputs object on the parser to allow for HTML output

	function _createSlides(songData){
		$songTitle.text(songData.title);

		//Add the title
		if(songData.slides.length>0) $songSlideContainer.show();

		//Add each info item
		for (var i = 0; i < songData.info.length; i++) {
			var s = songData.info[i];

			$("<li><strong>"+s.name+":</strong> "+s.value+"</li>").appendTo($songInfoList);
		};

		//Output the slides themselves
		for (var i = 0; i < songData.slides.length; i++) {
			var s = songData.slides[i];
			//If the title is blank, add a space character so it look even
			var title = s.title.length < 1 ? '&nbsp;' : s.title;
			//Create a new HTML clide and add it to the DOM
			$("<li class='span3'><div class='thumbnail slide-content'><p class='slide-lyrics'>"+s.lyrics+"</p><h6 class='slide-label'>"+title+"</h6></div></li>").appendTo($songSlideContainer);
		};
	}

	function _equalSlideHeights(){
		var currentTallest = 0;

		$songSlideContainer
			.find('.slide-lyrics')
			.each(function(i){
				if ($(this).height() > currentTallest) {
					currentTallest = $(this).height();
				}
			})
			.css({'min-height': currentTallest}); 
	}

	_init();

	return{
		run:function (songData) {
			//Create some slides with the normalized song data
			_createSlides(songData);

			//Now make all the slides have the same height
			_equalSlideHeights();
		},
		resetUI: function(){
			//Impliment the required reset function
			$songTitle.text("");
			$songInfoList.empty();
			$songSlideContainer.empty().hide();
		}
	}

});