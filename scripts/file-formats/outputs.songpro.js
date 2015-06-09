/* global parser */
/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*=====================================================
 * OUTPUT for converting to SongPro format
=======================================================*/

(function() {
    var THIS_OUTPUT = 'songpro';
    var FILE_EXTENSION = ".txt";

    //Extend the outputs object on the parser to allow for HTML output
    parser.outputs[THIS_OUTPUT] = function(songList) {

        //Loop through and convert each file and add the 
        var convertedFileContents = [];
        var errorFiles = [];
        $.each(songList, function(i, song) {
            //try {
            convertedFileContents.push({
                name: song.name,
                data: _makeSongProFile(song.data)
            });
            //} catch (ex) {
            //    errorFiles.push(song.name);
            //}
        });

        //Display any errors if we have them
        if (errorFiles.length) {
            parser.displayError(errorFiles.join(", "), "Error converting the following " + errorFiles.length + " songs!");
        }

        //Complete! Show the success HTML
        parser.displaySuccessHtml(convertedFileContents, THIS_OUTPUT, FILE_EXTENSION);
    };

    //===================================
    //PRIVATE
    //===================================

    var slideTitleDictionary = {
        //Lyric props
        "Bridge": "B",
        "Chorus": "C",
        "Coda": "D",
        "Verse": "V", //Not actually in SongPro, but we'll put this here as a helper

        //Info props
        "Author": "A",
        "Category": "G",
        "Key": "K",
        "Title": "T",
        "Music Source": "M",
        "Notes": "N",
        "Order": "O",
        "Copyright": "R"
    };

    function _makeSongProFile(songData) {
        window.console.log(songData);
        var content = "#T\r\n";
        content += songData.title + "\r\n\r\n";

        //Get all the lyrics out
        for (var i = 0; i < songData.slides.length; i++) {
            var slide = songData.slides[i];
            if (slideTitleDictionary.hasOwnProperty(slide.title)) {
                content += _addProperty(slideTitleDictionary[slide.title], _addRtfData(slide.lyrics));
            } else if (/verse \d+/i.test(slide.title)) {
                content += _addProperty(slide.title.replace(/verse/i, "").trim(), _addRtfData(slide.lyrics));
            }
        }

        var hasNotes = false;
        for (var j = 0; j < songData.info.length; j++) {
            var info = songData.info[j];
            if (slideTitleDictionary.hasOwnProperty(info.name)) {
                content += _addProperty(slideTitleDictionary[info.name], info.value);

                if (info.name === "Notes") {
                    hasNotes = true;
                }
            }
        }

        //Add some other data
        content += _addProperty("F", "Arial"); //Font
        content += _addProperty("FS", "40"); //Font size
        content += _addProperty("I", "False"); //Italics
        content += _addProperty("BD", "True"); //Bold
        content += _addProperty("BE", "True"); //???
        content += _addProperty("JL", "True"); //Justify Left
        content += _addProperty("JT", "False"); //Justify Top
        content += _addProperty("FC", "0"); //Foreground Color
        content += _addProperty("BC", "16777215"); //Background color
        if (!hasNotes) {
            content += _addProperty("N"); //Notes (none)
        }
        content += _addProperty("SB", "False"); //Favorites
        content += _addProperty("SH", "False"); //Shadow/Outline
        content += _addProperty("E"); //Flag the end of the song

        //Trim off any whitespace
        content = content.trim();

        return content;
    }

    function _addProperty(key, value) {
        if (!value) {
            value = "";
        }
        return "#" + key + "\r\n" + value + "\r\n\r\n";
    }

    function _addRtfData(str) {
        var out = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n";
        out += "{\\colortbl ;\\red0\\green0\\blue0;}\n";
        out += "\\viewkind4\\uc1\\pard\\cf1\\lang2057\\f0\\fs17 ";

        out += str.split("\n").join("\n\\par ");

        out += "\n\\par }";

        return out;
    }

})();