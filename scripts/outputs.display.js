/*=====================================================
 * OUTPUT for displaying slide content in the browser as HTML
=======================================================*/

(function(){

	//Extend the outputs object on the parser to allow for HTML output
	parser.outputs.display = function ($container, songList) {
		
		$.each(songList, function(i, song){
			//Create some slides with the normalized song data
			var $song = $(_createSlides(song.data))
			$container.append($song);

			//Now make all the slides have the same height
			_equalSlideHeights($song);
		});
	}

	//===================================
	//PRIVATE FUNCTIONS
	//===================================
	function _createSlides(songData){

		var htmlOutput = '<h3 class="song-title">'+songData.title+'</h3>';
		htmlOutput += '<ul class="song-info">';
		

		//Add each info item
		for (var i = 0; i < songData.info.length; i++) {
			var s = songData.info[i];
			htmlOutput += '<li><strong>'+s.name+':</strong> '+s.value+'</li>';
		};

		htmlOutput += '</ul><ul class="slides-container thumbnails">';

		//Output the slides themselves
		for (var i = 0; i < songData.slides.length; i++) {
			var s = songData.slides[i];
			//If the title is blank, add a space character so it look even
			var title = s.title.length < 1 ? '&nbsp;' : s.title;
			//Create a new HTML clide and add it to the DOM
			htmlOutput += '<li class="span3"><div class="thumbnail slide-content"><p class="slide-lyrics">'+s.lyrics+'</p><h6 class="slide-label">'+title+'</h6></div></li>';
		};

		htmlOutput += '</ul>'

		return htmlOutput;
	}

	function _equalSlideHeights($scope){
		var currentTallest = 0;

		$scope
			.find('.slide-lyrics')
			.each(function(i){
				if ($(this).height() > currentTallest) {
					currentTallest = $(this).height();
				}
			})
			.css({'min-height': currentTallest}); 
	}
})();