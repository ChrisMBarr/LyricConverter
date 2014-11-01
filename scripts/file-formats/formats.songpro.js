/*=====================================================
 * PARSER for ChordPro/Chord files
 * Extension: .txt
 * Site: http://www.vromans.org/johan/projects/Chordii/chordpro/
=======================================================*/

/*global console:false*/
/*exported console*/

/* TODO
 * Deal with multiple songs in an incoming file
 * Use the order data to order the slides correctly
 */

(function() {

    var THIS_FORMAT = 'songpro';
    parser.formats[THIS_FORMAT] = {};

    //When true, we will reorder the slides based on the "#O" metadata
    var shouldOrderSlides = true;

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

        return _reorderSlides(songObj);
    };

    //===================================
    //PRIVATE
    //===================================

    var slideTitleDictionary = {
        //Lyric props
        "B": "Bridge",
        "C": "Chorus",
        "D": "Coda",
        "V": "Verse", //Not actually in SongPro, but we'll put this here as a helper

        //Info props
        "A": "Author",
        "G": "Category",
        "K": "Key",
        "T": "Title",
        "M": "Music Source",
        "N": "Notes",
        "O": "Order",
        "R": "Copyright"
    };

    function _keyIsInfoRelated(key) {
        return /A|G|K|T|M|N|O|R/.test(key);
    }

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
            //Clean up the key & make sure it's uppercase
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
                } else if (_keyIsInfoRelated(k)) {
                    infoArr.push({
                        "name": slideTitleDictionary[k],
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
            if (!_keyIsInfoRelated(key)) {

                //Use whatever the key is as the slide title
                var slideTitle = key;

                //If we have a replacement for the slide title, we'll use that instead
                if (slideTitleDictionary.hasOwnProperty(key)) {
                    slideTitle = slideTitleDictionary[key];
                } else if (/\d+/.test(key)) {
                    //Verses are just numbers, prefix it with "Verse "
                    slideTitle = slideTitleDictionary.V + " " + key;
                }

                //Remove the RTF data & add the slide
                slides.push({
                    "title": slideTitle,
                    "lyrics": parser.utilities.stripRtf(sections[i].val)
                });
            }
        }

        return slides;
    }

    function _reorderSlides(songObj) {
        //Reorder the slides based on the order flag
        if (shouldOrderSlides) {
            //First we need to see if this song even has an order defined in the info
            var hasOrder = false;
            var theOrder = "";
            for (var i = 0; i < songObj.info.length; i++) {
                if (songObj.info[i].name === slideTitleDictionary.O) {
                    hasOrder = true;
                    //Save the order to a local var
                    theOrder = songObj.info[i].value;
                    //Remove the order from the info
                    songObj.info.splice(i, 1);
                    //Exit the loop
                    break;
                }
            }

            //If we have an order, then we can continue!
            if (hasOrder) {

                var originalSlides = songObj.slides;
                var newSlides = [];

                for (var j = 0; j < theOrder.length; j++) {
                    var key = theOrder[j].toUpperCase();
                    var name = "";

                    //If the key is in the lookup table, use that name
                    if (slideTitleDictionary.hasOwnProperty(key)) {
                        name = slideTitleDictionary[key];
                    } else if (/\d+/.test(key)) {
                        //Verses are just numbers, so
                        name = slideTitleDictionary.V + " " + key;
                    }

                    //Loop over all the existing slides to find the one with the matching name
                    for (var jj = 0; jj < originalSlides.length; jj++) {
                        if (originalSlides[jj].title === name) {
                            newSlides.push(originalSlides[jj]);
                            break;
                        }
                    }
                }

                //Re-write the slides in the new order
                songObj.slides = newSlides;
            }
        }

        return songObj;
    }

})();