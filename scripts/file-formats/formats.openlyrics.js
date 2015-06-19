/* global parser*/
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
        var $properties = $(songData).find("properties").children();
        var $lyrics = $(songData).find("lyrics").children();
        
        //Fill in the filled-in song object
        var songObj = {
            title: _getTitle($properties, fileName),
            info: _getInfo($properties),
            slides: _getSlides($lyrics)
        };
        
        //console.log(songObj);
        
        return songObj;
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================
    
    function _getTitle($properties, fileName){
        var $allTitles = $properties.filter("titles").children();
        
        if($allTitles.length === 1){
            //only one title, grab it's text
            return $allTitles.text();
        }else if($allTitles.length > 1){
            //more than 1 title... prefer the one flagged as orginal if it exists
            var $originalTitle = $allTitles.filter("[original='true']");
            if($originalTitle.length){
                return $originalTitle.first().text();
            }else{
                //if not, then just use the first listed title
                $allTitles.first().text();
            }
        }else{
            //if no titles listed, just use the file name without the extension 
            return fileName.replace(".xml","");
        }
    }
    
    function _getInfo($properties) {
        var infoArr = [];
        
        //get all the properties except for the title since we hadle that elsewhere
        var $singleProps = $properties.filter(":not(titles, authors, songbooks, themes, comments)");
        $singleProps.each(function(){
            infoArr.push({
                "name":this.tagName.toLowerCase(),
                "value":this.innerText.trim()
            });
        });
                
        var $multiProps = $properties.filter("authors, songbooks, themes, comments").children();
        $multiProps.each(function(){
            var name=this.tagName.toLowerCase();
            var val= this.innerText;
            if(name==="author"){
                if(this.attributes.type){
                  name+=" ("+this.attributes.type.textContent+")";
                }
            }else if(name==="songbook"){
                val = this.attributes.name.textContent;
                if(this.attributes.entry){
                  name+=" (entry: "+this.attributes.entry.textContent+")";
                }
            }else if(name==="theme"){
                if(this.attributes.lang){
                  name+=" ("+this.attributes.lang.textContent+")";
                }
            }
            
            infoArr.push({
                "name":name,
                "value": val
            });
        });
        
        return infoArr;
    }
    
    function _getSlides($lyrics) {
        //TODO
          
        return [];
    }
    
})();