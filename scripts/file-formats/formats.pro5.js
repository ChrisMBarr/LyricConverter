/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*=====================================================
 * PARSER for ProPresenter 5 files
 * Extension: .pro5
 * Site: http://www.renewedvision.com/propresenter.php
=======================================================*/

(function() {

    var THIS_FORMAT = 'pro5';
    parser.formats[THIS_FORMAT] = {};

    parser.formats[THIS_FORMAT].testFormat = function(fileExt) {
        return fileExt.toLowerCase().trim() === THIS_FORMAT;
    };

    //Extend the formats object on the parser to allow for parsing ProPresenter files
    parser.formats[THIS_FORMAT].convert = function(songData, fileName) {

        //select the top-level document element
        var $presentationDoc = $(songData).filter("RVPresentationDocument");

        //Collect all the attributes to parse later
        var attrs = $presentationDoc.get(0).attributes;

        //Collect all the sides to parse later
        var $slidesGroups = $presentationDoc.find("RVSlideGrouping");

        //Make sure the title is filled in, if not use the filename
        var songTitle = (attrs.CCLISongTitle && attrs.CCLISongTitle.value.length > 0) ? attrs.CCLISongTitle.value : fileName;

        //Fill in the filled-in song object
        return {
            title: songTitle,
            info: _getInfo(attrs),
            slides: _getSlides($slidesGroups)
        };
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================
    function _getSlides($slidesGroups) {
        var songSlides = [];

        //Loop through all the passed in slides
        $slidesGroups.each(function() {
            var $thisGroup = $(this);
            var $slides = $thisGroup.find("RVDisplaySlide");

            $slides.each(function() {
                var $thisSlide = $(this);
                var lyricsText = "";
                var labelText = $thisGroup.attr("name").trim();
                var slideLabel = $thisSlide.attr("label").trim();

                if (slideLabel.length) {
                    labelText += " - " + slideLabel;
                }

                var $slideTextElement = $thisSlide.find("RVTextElement");
                $.each($slideTextElement, function() {
                    //Grab the base64 encoded data from the slide element, decode it, the strip off the RTF formatting
                    var encodedRtfData = $(this).attr("RTFData");
                    var decodedRtfData = parser.utilities.decode(encodedRtfData);
                    lyricsText += _stripRtf(decodedRtfData);
                });

                songSlides.push({
                    "title": labelText,
                    "lyrics": lyricsText
                });
            });

        });

        return songSlides;
    }

    function _getInfo(infoAttributes) {
        //An array of attributes that we don't need to display in the UI
        var itemsToRemove = ['height', 'width', 'CCLISongTitle', 'CCLIDisplay', 'versionNumber', 'docType', 'creatorCode', 'lastDateUsed', 'usedCount', 'backgroundColor', 'drawingBackgroundColor'];

        var songInfo = [];

        //Loop through all the passed in attributes
        $.each(infoAttributes, function(i, thisAttr) {

            //Continue only if the attribute is not in the array above AND the value is not blank
            if ($.inArray(thisAttr.name, itemsToRemove) < 0 && thisAttr.value !== "") {
                songInfo.push({
                    "name": thisAttr.name,
                    "value": thisAttr.value
                });
            }
        });

        //Special case - Set the date. Parse it to a human readable date!
        var lastUsedDate = new Date(Date.parse(infoAttributes.lastdateused.value));
        if (!isNaN(lastUsedDate.getTime())) {
            songInfo.push({
                "name": "Last Used On",
                "value": lastUsedDate
            });
        }

        return songInfo;
    }

    function _stripRtf(str) {
        //var pattern = /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
        var basicRtfPattern = /\{\*?\\[^{}]+}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
        var newLineSlashesPattern = /\\\n/g;

        var stripped = str.replace(basicRtfPattern, "");
        var removeNewlineSlashes = stripped.replace(newLineSlashesPattern, "\n");
        var removeWhitespace = removeNewlineSlashes.trim();

        return removeWhitespace;
    }
})();