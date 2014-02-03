/*=====================================================
 * PARSER for ChordPro/Chord files
 * Extension: .txt
 * Site: http://www.vromans.org/johan/projects/Chordii/chordpro/
=======================================================*/

(function () {

	var THIS_FORMAT = 'chordpro';
	parser.formats[THIS_FORMAT] = {};

	parser.formats[THIS_FORMAT].testFormat = function(fileExt, fileData){
		//Make sure we have a .txt file and something at the beginning like {title: song title}
		return /txt/i.test(fileExt) && /^{.+:\s*.*}[\r\n]+/i.test(fileData);
	};

	//Extend the formats object on the parser to allow for parsing SongShowPlus files
	parser.formats[THIS_FORMAT].convert = function(songData, fileName){

		var songMetadata = _getSongMetadata(songData, fileName);
		var songLyrics = _getLyrics(songData);
		//console.log(songMetadata);
		//console.log(songLyrics);


		//Return the filled in song object
		var songObj = {
			title: songMetadata.title,
			info: songMetadata.info,
			slides: songLyrics
		};
		console.log(songObj);
		return songObj;
	};

	//===================================
	//PRIVATE FUNCTIONS
	//===================================

	function _getSongMetadata(songData, fileName){
		var infoSections = songData.match(/{.+?:.+?}/gmi);
		
		var infoArr = [];
		for (var i = 0; i < infoSections.length; i++) {
			var sectionParts = infoSections[i].replace(/^{(.*)}/,"$1").split(":");
			var infoObj = {};
			infoObj[$.trim(sectionParts[0])] = $.trim(sectionParts[1]);
			infoArr.push(infoObj);
		};

		return {
			title: infoArr.title || infoArr.Title || fileName.replace(".txt",""),
			info: infoArr
		};
	}

	function _getLyrics(songData){
		var slides = [];

		//Find the parts that being with the title, a color, and then a block of single-spaced characters
		var songParts = songData.match(/(\w+(\s\d)*:[\r\n]+)+(.+[\n\r])+/mgi);

		//Loop over these parts
		for (var i = 0; i < songParts.length; i++) {
			var lines = songParts[i].split(/[\r\n]+/g);

			//Get the first line from the array, and remove the colon. Now we have the title
			var title = $.trim(lines.shift().replace(":",""));

			//Join the remaining lines and remove all bracket groups
			var lyrics = $.trim(lines.join("\n").replace(/\[.+?\]|{.+?}/g,""));

			slides.push({
				"title": title,
				"lyrics": lyrics
			});	
		};
		return slides;
	}
	
})();