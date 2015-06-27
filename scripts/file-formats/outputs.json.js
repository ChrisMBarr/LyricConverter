/* global parser */
/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*=====================================================
 * OUTPUT for converting to JSON format
=======================================================*/

(function() {
    var THIS_OUTPUT = 'json';
    var FILE_EXTENSION = "." + THIS_OUTPUT;

    //Extend the outputs object on the parser to allow for HTML output
    parser.outputs[THIS_OUTPUT] = function(songList) {

        //Loop through and convert each file and add the 
        var convertedFileContents = [];
        var errorFiles = [];
        $.each(songList, function(i, song) {
            try {
                convertedFileContents.push({
                    name: song.name,
                    data: JSON.stringify(song.data, null, 2)
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
})();