/*=====================================================
 * PARSER for JSON files
 * Extension: .json
=======================================================*/

(function() {

    var THIS_FORMAT = 'json';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt) {
        return fileExt.toLowerCase().trim() === THIS_FORMAT;
    };

    //Extend the formats object on the parser to allow for parsing JSON files
    parser.formats[THIS_FORMAT].convert = function(songData) {
        try {
            //If this JSON object was generated from LyricCOnverter
            //we should just be able to pass it right on through!
            window.console.log(JSON.parse(songData));
            return JSON.parse(songData);
        } catch (ex) {
            return {};
        }
    };

})();