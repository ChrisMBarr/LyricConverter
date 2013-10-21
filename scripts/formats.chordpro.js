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
		return {
			title: songMetadata.title,
			info: songMetadata.info,
			slides: songLyrics
		};
	};

	//===================================
	//PRIVATE FUNCTIONS
	//===================================

	function _getSongMetadata(songData, fileName){
		var infoSections = songData.match(/{.+:\s*.*}/gmi);
		
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

		var matches = songData.match(/^[\w\s]+:\s*[\s\S]+(?![\w\s]+:)/mgi);

		console.log(matches);

		return slides;
	}
	
})();