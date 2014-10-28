/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*global parser:false*/

/*=====================================================
 * OUTPUT for displaying slide content in the browser as HTML
=======================================================*/

(function() {
    var THIS_OUTPUT = 'display';

    //Extend the outputs object on the parser to allow for HTML output
    parser.outputs[THIS_OUTPUT] = function(songList, $container) {

        $.each(songList, function(index, song) {
            //Create some slides with the normalized song data
            var $song = $(_createSlides(song.data));
            $container.append($song);

            //Now make all the slides have the same height
            _equalSlideHeights($song);
        });
    };

    //===================================
    //PRIVATE FUNCTIONS
    //===================================
    function _createSlides(songData) {

        var htmlOutput = '<h3 class="song-title">' + songData.title + '</h3>';
        htmlOutput += '<ul class="song-info">';

        //Add each info item
        for (var infoIndex = 0; infoIndex < songData.info.length; infoIndex++) {
            var sInfo = songData.info[infoIndex];
            htmlOutput += '<li><strong>' + sInfo.name + ':</strong> ' + sInfo.value + '</li>';
        }

        htmlOutput += '</ul><div class="slides-container row">';

        //Output the slides themselves
        for (var slideIndex = 0; slideIndex < songData.slides.length; slideIndex++) {
            var slide = songData.slides[slideIndex];
            //If the title is blank, add a space character so it look even
            var title = slide.title.length < 1 ? '&nbsp;' : slide.title;
            //Create a new HTML slide and add it to the DOM
            htmlOutput += '<div class="col-xs-6 col-sm-4 col-md-3"><div class="thumbnail slide-content"><p class="slide-lyrics">' + slide.lyrics + '</p><h6 class="slide-label">' + title + '</h6></div></div>';
        }

        htmlOutput += '</div>';

        return htmlOutput;
    }

    function _equalSlideHeights($scope) {
        var currentTallest = 0;

        $scope
            .find('.slide-lyrics')
            .each(function() {
                if ($(this).outerHeight() > currentTallest) {
                    currentTallest = $(this).outerHeight();
                }
            })
            .css({
                'min-height': currentTallest
            });
    }
})();