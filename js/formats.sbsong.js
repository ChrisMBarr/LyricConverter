/*=====================================================
 * PARSER for SongShowPlus files
 * Extension: .sbsong
 * Site: http://www.songshowplus.com/
=======================================================*/

(function () {
	parser.formats.sbsong = function(content){
		//We don't want any properties XML tags which can sometimes begin the file.
		//Splitting these out and then taking teh first array item can prevent this.
		//Each song sections seems to be split up by a percent sign, so make an array by splitting on that
		var sections = content.split("<Properties>")[0].split("%");

		//Create an empty song object to fill in later
		var song={
			title:"",
			info:[],
			slides:[]
		};

		//The info is all contained in the first section, so only pass that in
		song.info = _getInfo(sections);

		//Pass all the sections in here to get the lyrics, but we will skip the first one
		song.slides = _getSlides(sections);
		
		return song;
	};

	function _getInfo (sections) {
		var info = [];

		return info;
	}

	function _getSlides (sections) {
		var slides = [];

		//Sections tend to begin with N number of control characters, a random print character, more control characters, and then the title "Verse 1" or soemthing
		//After that is the actual song lyrics, but it may be preceeded by one non-word character
		var slidePattern = /^[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+.{1}[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+(.+)[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+\W*([\s\S]+)/m;

		//Loop through the sections, but SKIP the first one since it contains the song info we don't need here
		for (var i = 1; i < sections.length; i++) {
			
			//Run the regex on each section to split out the slide title from the lyrics
			var matches = sections[i].match(slidePattern);
			
			//Remove whitespace from the title
			var slideTitle = $.trim(matches[1]);

			//Remove any more invisibles from the lyrics and remove whitespace
			var slideLyrics = $.trim(matches[2].replace(patterns.invisibles,""));
			
			//Save it to the array!
			slides.push({
				"title": slideTitle,
				"lyrics": slideLyrics
			});
		};

		//console.log(slides);

		return slides;
	}

	var patterns = {
		//basic pattern for most text
		stdTextRegex : "\w\s,\.\(\)\-_=+\"':;!@#$%^&*{}\[\]\\|<>\/?`~",
		invisibles: /[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/
	};
	patterns.t = "/([" + patterns.invisibles + "])+(.){1}([" + patterns.invisibles + "])+(([" + patterns.stdTextRegex + "])+)([" + patterns.invisibles + "]){1}([^" + patterns.invisibles + "]){1}((.)*)/mi";


	var helpers = {
		_cleanCharacters: function (input){
			return input.replace('/[' + patterns.invisibles + ']*/', '');
		},
		 _englishOnly:function(input){
			return input.replace('/^[' + patterns.invisibles + ']*$/u', '');
		}
	};

})();