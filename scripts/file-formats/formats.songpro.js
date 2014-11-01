/*=====================================================
 * PARSER for ChordPro/Chord files
 * Extension: .txt
 * Site: http://www.vromans.org/johan/projects/Chordii/chordpro/
=======================================================*/

/*global console:false*/
/*exported console*/

/* TODO
 * Remove RTF Data
 * Deal with multiple songs in an incoming file
 * Use the order data to order the slides correctly
 */

(function() {

    var THIS_FORMAT = 'songpro';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt, fileData) {
        //Make sure we have a .txt file and something at the beginning like {title: song title}
        return /txt/i.test(fileExt) && /^#T\s/i.test(fileData);
    };

    //Extend the formats object on the parser to allow for parsing ChordPro files
    parser.formats[THIS_FORMAT].convert = function(songData, fileName) {
        var parsedSongData = _getSongData(songData);
        var songMetadata = _getMetadata(parsedSongData, fileName);
        var songLyrics = _getLyrics(parsedSongData);

        //Return the filled in song object
        var songObj = {
            title: songMetadata.title,
            info: songMetadata.info,
            slides: songLyrics
        };
        return songObj;
    };

    //===================================
    //PRIVATE
    //===================================

    function _getSongData(songData) {

        var parsedSections = [];

        //Split up all the sections
        var sections = songData.match(/#[A-Z0-9]+[\s\S]+?[^#]*/ig);

        //Loop through each section
        for (var i = 0; i < sections.length; i++) {
            //Separate the key form the data
            var sectionKey = sections[i].match(/#[A-Z0-9]+/)[0];
            //Remove the key form the data
            var sectionData = sections[i].replace(sectionKey, "").trim();
            //Clean up the key
            sectionKey = sectionKey.trim().replace("#", "").toUpperCase();

            //There are a few keys that we do not ever need to care about, so we skip them
            if (!/F|FS|I|BD|BE|JL|JT|FC|BC|P|SB|SH|BM|E/.test(sectionKey)) {
                //Add the other keys it to the array
                parsedSections.push({
                    key: sectionKey,
                    val: sectionData
                });
            }
        }

        //return the array of parsed sections!
        return parsedSections;
    }

    function _getMetadata(sections, fileName) {
        var infoArr = [];

        //Get the title filename, but we will replace this later if we find a better source
        var songTitle = fileName.replace(".txt", "");

        for (var i = 0; i < sections.length; i++) {
            var k = sections[i].key;
            var v = sections[i].val;

            //make sure this data isn't empty
            if (v !== "") {
                if (k === "T") {
                    //If we have a title, use it instead of the filename
                    songTitle = v;
                } else if (k === "A") {
                    infoArr.push({
                        "name": "Author",
                        "value": v
                    });
                } else if (k === "R") {
                    infoArr.push({
                        "name": "Copyright",
                        "value": v
                    });
                } else if (k === "K") {
                    infoArr.push({
                        "name": "Author",
                        "value": v
                    });
                } else if (k === "M") {
                    infoArr.push({
                        "name": "Music Source",
                        "value": v
                    });
                } else if (k === "G") {
                    infoArr.push({
                        "name": "Category",
                        "value": v
                    });
                } else if (k === "O") {
                    infoArr.push({
                        "name": "Order",
                        "value": v
                    });
                } else if (k === "N") {
                    infoArr.push({
                        "name": "Notes",
                        "value": v
                    });
                }
            }
        }

        return {
            title: songTitle,
            info: infoArr
        };
    }

    function _getLyrics(sections) {
        var slides = [];

        for (var i = 0; i < sections.length; i++) {
            var key = sections[i].key;

            //Skip the metadata related keys, they aren't needed here
            if (!/T|A|R|K|M|G|O|N/.test(key)) {

                var slideTitle = key;

                if (key === "C") {
                    slideTitle = "Chorus";
                } else if (key === "B") {
                    slideTitle = "Bridge";
                } else if (key === "D") {
                    slideTitle = "Coda";
                } else if (/\d+/.test(key)) {
                    //Verses are just numbers, prefix it with "Verse "
                    slideTitle = "Verse " + key;
                }

                //Temp
                slides.push({
                    "title": slideTitle,
                    "lyrics": parser.utilities.stripRtf(sections[i].val)
                });
            }
        }

        return slides;
    }

})();