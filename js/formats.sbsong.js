/*=====================================================
 * PARSER for SongShowPlus files
 * Extension: .sbsong
 * Site: http://www.songshowplus.com/
=======================================================*/

(function () {
	parser.formats.sbsong = function(content){
		
		console.log(content);

		var song={
			title:"",
			info:[],
			slides:[]
		};

		//song.info = _getInfo(content);
		song.slides = _getSlides(content);
		
		return song;
	};

	function _getInfo (songContent) {
		var info = [];

		return info;
	}

	function _getSlides (songContent) {
		var slides = [];

		//TEMP
		var lines = songContent.split(/\r\n/);

		for (var i = lines.length - 1; i >= 0; i--) {
			slides.push({
				"title": i,
				"lyrics": lines[i]
			});
		};

		return slides;
	}


})();