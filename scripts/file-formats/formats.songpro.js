/*=====================================================
 * PARSER for ChordPro/Chord files
 * Extension: .txt
 * Site: http://www.vromans.org/johan/projects/Chordii/chordpro/
=======================================================*/

/*global console:false*/

(function() {

    var THIS_FORMAT = 'songpro';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt, fileData) {
        //Make sure we have a .txt file and something at the beginning like {title: song title}
        return /txt/i.test(fileExt) && /^#T\s/i.test(fileData);
    };

    //Extend the formats object on the parser to allow for parsing ChordPro files
    parser.formats[THIS_FORMAT].convert = function(songData, fileName) {
        var songMetadata = _getSongMetadata(songData, fileName);
        var songLyrics = _getLyrics(songData);

        //Return the filled in song object
        var songObj = {
            title: songMetadata.title,
            info: songMetadata.info,
            slides: songLyrics
        };
        return songObj;
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================

    var sectionRegex = new RegExp(/(#[A-Z0-9]+)([\s\S])+?(?:[\n\r]#)/ig);

    function _getSongMetadata(songData, fileName) {
        var infoArr = [];

        var matches = songData.match(sectionRegex);

        console.log(matches);

        //Temp
        infoArr.push({
            "name": "Sample Name",
            "value": songData.split(/\n/)[0]
        });

        //Get the title filename, but we will replace this later if we find a better source
        var songTitle = fileName.replace(".txt", "");

        return {
            title: songTitle,
            info: infoArr
        };
    }

    function _getLyrics(songData) {
        var slides = [];

        //Temp
        slides.push({
            "title": "Sample Title",
            "lyrics": songData.split(/\n/)[0]
        });

        return slides;
    }

})();