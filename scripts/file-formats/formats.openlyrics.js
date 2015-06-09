/* global parser */
/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*=====================================================
 * PARSER for OpenLyrics files
 * Extension: .xml
 * Site: http://openlyrics.info & https://github.com/openlyrics/openlyrics
=======================================================*/

(function() {

    var THIS_FORMAT = 'openlrics';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt, fileData) {
        return fileExt.toLowerCase().trim() === "xml" && /<song xmlns=("|')http:\/\/openlyrics.info\/namespace\/2009\/song("|')/i.test(fileData);
    };

    //Extend the formats object on the parser to allow for parsing ProPresenter files
    parser.formats[THIS_FORMAT].convert = function(songData, fileName) {
        var $properties = $(songData).find("song properties").children();
        var $lyrics = $(songData).find("song lyrics").children();
        
        var songTitle = $properties.filter("titles title").text() || fileName.replace(".xml","");
        
        //Fill in the filled-in song object
        return {
            title: songTitle,
            info: _getInfo($properties),
            slides: _getSlides($lyrics)
        };
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================
    
    function _getInfo($properties) {
        //TODO
    }
    
    function _getSlides($lyrics) {
        //TODO
    }
    
})();