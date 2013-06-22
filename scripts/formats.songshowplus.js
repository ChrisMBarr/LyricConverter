/*=====================================================
 * PARSER for SongShowPlus files
 * Extension: .sbsong
 * Site: http://www.songshowplus.com/
=======================================================*/

(function () {

	var THIS_FORMAT = 'songshowplus';
	parser.formats[THIS_FORMAT] = {};

	parser.formats[THIS_FORMAT].testExtension = function(fileExt){
		return /sbsong/i.test(fileExt);
	};

	//Extend the formats object on the parser to allow for parsing SongShowPlus files
	parser.formats[THIS_FORMAT].convert = function(songData, fileName){
		//We don't want any properties XML tags which can sometimes begin the file.
		//Splitting these out and then taking teh first array item can prevent this.
		//Each song sections seems to be split up by a percent sign, so make an array by splitting on that
		var sections = songData.split("<Properties>")[0].split("%");

		//Pass all the sections in here to get the lyrics
		//We will get out the slides and the keywords
		var slideContent = _getSlides(sections);

		//The info is all contained in the first section, so only pass that in and pass in teh keywords from above
		var parsedInfo = _getInfo(sections[0], slideContent.keywords, fileName);

		//Return the filled in song object
		return {
			title: parsedInfo.title,
			info: parsedInfo.info,
			slides: slideContent.slides
		};
	};

	//===================================
	//PRIVATE FUNCTIONS
	//===================================

	//Regex pattern AS A STRING to match invisible control characters
	//Slashes are double escaped here so it can be in a string!
	var _patternInvisiblesStr = "[\\xA0\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F]";
	//Same pattern, but as a real RexExp object
	var _invisibles = new RegExp(_patternInvisiblesStr);

	function _getInfo (firstSection, keywords, fileName) {
		//Split the info up into an array by the invisible characters
		var infoArray = firstSection.split(_invisibles);
		
		//Now loop through the array and remove all empty items and items that are only 1 character long
		infoArray = $.grep(infoArray,function(n){
			var item = $.trim(n).replace(/\r\n\t/g,"");
			return item.length>1 ? item : false;
		});

		//If the first items is a number between 1 and 4 digits, remove it
		if(/[0-9]{1,4}/.test(infoArray[0])){
			infoArray.splice(0,1);
		}

		//Make sure the title is filled in, if not use the filename
		var songTitle = (infoArray.length > 0 && infoArray[0].length > 0) ? infoArray[0] : fileName;

		//remove leading dollar signs for whatever reason...
		songTitle = songTitle.indexOf("$")===1 ? songTitle.substring(1,songTitle.length) : songTitle;
		
		//remove trailing dollar signs for whatever reason...
		songTitle = songTitle.substring(0, songTitle.length - +(songTitle.lastIndexOf('$')==songTitle.length-1));
		
		var songInfo = [];

		songInfo.push({
			'name':'Artist/Author',
			'value':infoArray[1]
		});

		//If the copyright exists, add it
		if(infoArray[2]){
			songInfo.push({
				'name':'Copyright',
				'value':infoArray[2].replace("$","") //copyright info tends to end with a $ sign, so remove it
			});
		}

		//If the CCLI exists, add it
		if(infoArray[3]){
			songInfo.push({
				'name':'CCLI',
				'value':infoArray[3]
			});
		}

		//If we have keywords, add them
		if(keywords){
			songInfo.push({
				'name':'Keywords',
				'value':keywords
			});
		}

		return {
			'info': songInfo,
			'title': songTitle
		};
	}

	function _getSlides (sections) {
		//Sections tend to begin with N number of control characters, a random print character, more control characters, and then the title "Verse 1" or soemthing
		//After that is the actual song lyrics, but it may be preceeded by one non-word character
		//Slashes are double escaped here so it can be in a string!
		var slidePattern = new RegExp("^" + _patternInvisiblesStr + "+.{1}" + _patternInvisiblesStr + "+(.+)" + _patternInvisiblesStr + "+\\W*([\\s\\S]+)", "m");

		var slideArray = [];

		//Loop through the sections, but SKIP the first one since it contains the song info we don't need here
		for (var i = 1; i < sections.length; i++) {
			
			//Run the regex on each section to split out the slide title from the lyrics
			var matches = sections[i].match(slidePattern);

			//Remove whitespace from the title
			var slideTitle = (matches !== null && matches[1]) ? $.trim(matches[1]).replace(_invisibles, "") : "";

			//Remove any more invisibles from the lyrics and remove whitespace
			var slideLyrics = (matches !== null && matches[2]) ? $.trim(matches[2]).replace(_invisibles, "") : "";
			
			//Save it to the array!
			slideArray.push({
				"title": slideTitle,
				"lyrics": slideLyrics
			});
		}

		//The last slide also contains the keywords, we need to parse these out separately
		var lastSlideObj = _getKeywordsFromLastSlide(sections.slice(-1)[0]);
		var keywords = false;
		if(lastSlideObj){

			//If we have no slides, and what we think are keywords are longer than the lyrics...
			//Then we might need to switch them for some reason...
			if(slideArray.length === 0 && lastSlideObj.keywords.length > lastSlideObj.lastLyrics.length){
				keywords = lastSlideObj.lastLyrics;
				slideArray.push({
					"title": "",
					"lyrics": lastSlideObj.keywords
				});
			}else{
				keywords = lastSlideObj.keywords;
				if(slideArray.length > 0){
					slideArray.slice(-1)[0].lyrics = lastSlideObj.lastLyrics;
				}else{
					slideArray.push({
						"title": "",
						"lyrics": lastSlideObj.lastLyrics
					});
				}
			}

			
		}

		return {
			'slides': slideArray,
			'keywords': keywords
		};
	}

	function _getKeywordsFromLastSlide(lastSlideRaw) {

		var infoArray = lastSlideRaw.split(_invisibles);
		//Now loop through the array and remove all empty items and items that are only 1 character long
		infoArray = $.grep(infoArray,function(n){
			var item = $.trim(n);
			return item.length>1 ? item : false;
		});

		//If we have at least 3 sections, then we have keywords
		if(infoArray.length>2){
			//The keywords are the entire array except for the first two items
			var keywords = infoArray.splice(2).join(", ").replace(/\r\n\t/g,"");

			//Return the last slide minus the keywords, then parse out the optional begining non-word character
			var lastLyrics = infoArray[1].match(/^\W*([\s\S]+)/m)[1];

			return{
				'keywords': keywords,
				'lastLyrics': lastLyrics
			};
		}

		//We have nothing to return!
		return false;
		
	}

})();