/* global parser */
/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*=====================================================
 * OUTPUT for converting to Text format
=======================================================*/

(function() {
    var THIS_OUTPUT = 'text';
    var FILE_EXTENSION = ".txt";

    //Extend the outputs object on the parser to allow for HTML output
    parser.outputs[THIS_OUTPUT] = function(songList) {

        //Loop through and convert each file and add the 
        var convertedFileContents = [];
        var errorFiles = [];
        $.each(songList, function(i, song) {
            try {
                convertedFileContents.push({
                    name: song.name,
                    data: _makeTextFile(song.data)
                });
            } catch (ex) {
                errorFiles.push(song.name);
            }
        });

        //Display any errors if we have them
        if (errorFiles.length) {
            parser.displayError(errorFiles.join(", "), "Error converting the following " + errorFiles.length + " songs!");
        }

        //Complete! Show the success HTML
        parser.displaySuccessHtml(convertedFileContents, THIS_OUTPUT, FILE_EXTENSION);
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================
    function _makeTextFile(songData) {

        var txtFile = "Title: " + songData.title;

        //Loop through the song info attributes
        for (var infoIndex = 0; infoIndex < songData.info.length; infoIndex++) {
            var info = songData.info[infoIndex];
            if (info.name && info.value) {
                txtFile += "\r\n";
                txtFile += info.name + ": " + info.value;
            }
        }

        txtFile += "\r\n\r\n";

        //Add the song lyrics
        for (var slideIndex = 0; slideIndex < songData.slides.length; slideIndex++) {
            var slide = songData.slides[slideIndex];

            //Skip blank slides for text files
            if (slide.title.length > 0 || slide.lyrics.length > 0) {
                txtFile += slide.title;
                txtFile += "\r\n";
                txtFile += slide.lyrics;

                //Add line breaks afterwards, but not for the last slide
                if (slideIndex < songData.slides.length - 1) {
                    txtFile += "\r\n\r\n";
                }
            }
        }

        return txtFile;

    }

})();