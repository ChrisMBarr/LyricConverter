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

    var sectionRegex = new RegExp(/#[A-Z0-9]+[\s\S]+?[^#]*/ig);

    function _getSongMetadata(songData, fileName) {
        var infoArr = [];

        //Get the title filename, but we will replace this later if we find a better source
        var songTitle = fileName.replace(".txt", "");

        //Split up all the sections
        var sections = songData.match(sectionRegex);

        //Loop through each section and
        $.each(sections, function(k) {
            //Separate the key form the data
            var sectionKey = sections[k].match(/#[A-Z0-9]+/)[0];
            //Remove the key form the data
            var sectionData = sections[k].replace(sectionKey, "").trim();
            //Clean up the key
            sectionKey = sectionKey.trim().replace("#", "").toUpperCase();

            //make sure this data isn't empty or a boolean value which we don't care about
            if (sectionData !== "" && !/^(true|false)/i.test(sectionData)) {
                if (sectionKey === "T") {
                    //If we have a title, use it instead of the filename
                    songTitle = sectionData;
                } else if (sectionKey === "A") {
                    infoArr.push({
                        "name": "Author",
                        "value": sectionData
                    });
                } else if (sectionKey === "R") {
                    infoArr.push({
                        "name": "Copyright",
                        "value": sectionData
                    });
                } else if (sectionKey === "K") {
                    infoArr.push({
                        "name": "Author",
                        "value": sectionData
                    });
                } else if (sectionKey === "M") {
                    infoArr.push({
                        "name": "Music Source",
                        "value": sectionData
                    });
                } else if (sectionKey === "G") {
                    infoArr.push({
                        "name": "Category",
                        "value": sectionData
                    });
                } else if (sectionKey === "O") {
                    infoArr.push({
                        "name": "Order",
                        "value": sectionData
                    });
                } else if (sectionKey === "N") {
                    infoArr.push({
                        "name": "Notes",
                        "value": sectionData
                    });
                } else if (!/F|FS|I|BD|BE|JL|JT|FC|BC|P|SB|SH|BM|E/.test(sectionKey)) {
                    //We don't care about these, so if it's not one of these then it's probably lyrics!
                    console.log(sectionKey, sectionData)
                }
            }
        });

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