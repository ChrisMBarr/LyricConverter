/* global parser */
/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */
/*=====================================================
 * PARSER for ChordPro/Chord files
 * Extension: .txt
 * Site: http://www.vromans.org/johan/projects/Chordii/chordpro/
=======================================================*/

(function() {

    var THIS_FORMAT = 'chordpro';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt, fileData) {
        //Make sure we have a .txt file and something at the beginning like {title: song title}
        return /txt/i.test(fileExt) && /^.*{.+:.+}\s+/i.test(fileData);
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

    var _infoRegex = /{.+?:.+?}/gmi;

    function _getSongMetadata(songData, fileName) {
        var infoArr = [];
        var infoSections = songData.match(_infoRegex);

        //Get the title filename, but we will replace this later if we find a better source
        var songTitle = fileName.replace(".txt", "");

        for (var i = 0; i < infoSections.length; i++) {
            var sectionParts = infoSections[i].replace(/^{(.*)}/, "$1").split(":");
            var name = sectionParts[0].trim();
            var val = sectionParts[1].trim();

            if (/title/i.test(name)) {
                //If we find the title in the info, use that instead of the filename
                songTitle = val;
            } else {
                infoArr.push({
                    "name": name,
                    "value": val
                });
            }
        }

        return {
            title: songTitle,
            info: infoArr
        };
    }

    function _getLyrics(songData) {
        var slides = [];

        var songMinusInfo = songData.replace(_infoRegex, "");

        //Find the parts that being with the title, a colon, and then a block of single-spaced characters
        var songParts = songMinusInfo.match(/(\w+(\s\d)*:[\r\n]+)*(.+[\n\r])+/mgi);

        //Loop over these parts
        for (var i = 0; i < songParts.length; i++) {
            // remove all bracket groups, then split the lines into an array
            var lines = songParts[i].replace(/\[.+?\]|{.+?}/g, "").trim().split(/[\r\n]+/g);

            //Get the first line from the array, and remove the colon. Now we have the title
            var title = "";
            if (lines[0].indexOf(':') > 0) {
                title = lines.shift().replace(":", "").trim();
            }

            //Join the remaining lines together
            var lyrics = lines.join("\n").trim();

            slides.push({
                "title": title,
                "lyrics": lyrics
            });
        }
        return slides;
    }

})();