/*!
 * LICENSE:
 * CC BY-NC-SA 3.0
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
 */

/*global parser:false, Modernizr:false, JSZip:false, saveAs:false*/
/*exported isDev*/

var isDev = /\.local|localhost/i.test(document.location.hostname);

(function() {
    //Vars for this scope
    var $header;
    var $content;
    var $areaBegin;
    var $areaDisplay;
    var $dropMore;
    var $output;
    var $parserErrorDisplay;
    var isMobile = false;

    //Donation stuff
    var donationNagThreshhold = 100;
    var showDonationNag = true;
    var $donationNag;
    var $totalSongCountDisplay;

    //Cookie variables
    var cookieDuration = 365; //1 year
    var formatCookieName = "last-used-format";
    var songCountCookieName = "total-converted-song-count";
    var songCount = 0;

    //Page Load
    $(function() {
        _selectElements();
        _detectMobile();

        //Skip for mobile devices since they won't be seen anyway
        if (!isMobile) {
            _setupHeaderImage();
            _setupHeaderParrallax();
            _setupNav();
            _detectFeatures();
            _setupDonationAndSongCounter();
        }
    });

    var _cookie = {
        _create: function(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        _read: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
    };

    //======================================================================
    //Detect unsupported features and or devices
    //======================================================================
    function _displaySupportError(title, msg) {
        //Build up an HTML string for a bootstrap modal window
        var modalHtml = [
            '<div style="width: 90%; margin-left: -45%;" class="modal" tabindex="-1" role="dialog" aria-labelledby="unsupportedModalLabel" aria-hidden="true">',
            '   <div class="modal-header">',
            '       <h2 id="unsupportedModalLabel" class="text-error">' + title + '</h2>',
            '   </div>',
            '   <div class="modal-body">',
            '       <p style="font-size:22x;">' + msg + '</p>',
            '   </div>',
            '</div>'
        ].join('');

        //Load in the needed bootstrap components
        Modernizr.load({
            test: $.fn.modal,
            load: [
                'scripts/bootstrap/bootstrap-modal.js',
                'styles/bootstrap-assets/modals.css'
            ],
            complete: function() {
                //When loaded, launch the modal window
                $(modalHtml)
                    .modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
            }
        });
    }

    function _detectMobile() {
        //Set var in upper scope
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Windows Phone|Zune/i.test(navigator.userAgent);

        if (isMobile) {
            _displaySupportError(
                'Unsupported Device!',
                'Sorry, LyricConverter cannot be used on mobile devices!<br/><br/>Please use a desktop computer that supports file uploads and downloads.'
            );
        }
    }

    function _detectFeatures() {

        //If the browser does not nativly support Base64 encode/decode,
        //load in a file to add this support
        Modernizr.load({
            test: window.atob && window.btoa,
            nope: "scripts/plugins/base64.js"
        });


        //Make sure we have basic support for file drag-drop features
        if (Modernizr.draganddrop && window.FileReader) {
            //Yay! This browser can be used!
            //Init the parser
            _setupParser();
        } else {
            //Boo! no drag-n-drop support!
            _displaySupportError(
                "Unsupported Browser!",
                "Sorry, you won't be able to use LyricConverter because your browser does not support file drag-n-drop!<br/><br/>Try using a modern browser like <a href='www.google.com/chrome'>Google Chrome</a> instead!"
            );
        }
    }
    //======================================================================



    //======================================================================
    //Do initial UI setup
    //======================================================================
    function _selectElements() {
        //Fill in variables will selected elements
        $header = $('#header');
        $content = $('#main');
        $areaBegin = $("#begin-area");
        $areaDisplay = $("#display-area");
        $dropMore = $("#drop-area-more");
        $output = $("#output");
        $parserErrorDisplay = $('#parser-error-display');
        $donationNag = $("#many-songs-please-donate");
        $totalSongCountDisplay = $("#total-song-count");
    }

    function _setupHeaderImage() {
        var headerImgCount = 8;
        var headerImgPattern = /header-(\d+)\.jpg/;

        function _replaceImg(fromClick) {
            //Determine the new number
            var randomImgNumber = Math.floor(Math.random() * headerImgCount) + 1;
            var imgPath = $header.css("background-image");

            //Get the current path & parse it
            var parts = imgPath.match(headerImgPattern);

            //If the numbers cannot be teh same AND the same number was just selected,
            //Then recurse this function and stop this iteration of it
            if (fromClick && randomImgNumber === parseInt(parts[1], 10)) {
                _replaceImg(true);
                return;
            }

            //Replace it with the new one
            var newimgPath = imgPath.replace(parts[0], "header-" + randomImgNumber + ".jpg");

            //Set the CSS
            $header.css("background-image", newimgPath);
        }

        //call initially
        _replaceImg(false);

        //When the header is clicked...
        $header.on("click", function(ev) {
            //Make sure a link wasn't clicked
            if (ev.target.tagName !== "A") {
                //Get another random image
                _replaceImg(true);
            }
        });
    }

    function _setupHeaderParrallax() {
        var $win = $(window);
        var scrollSpeed = 2.4;
        var imgHeight = 350;

        //cut off the top of the image a bit, this will show the parrallax effect for OSX Elastic scrolling upwards
        var scrollUpElasticMax = 20;
        var headerScrollMax = -(imgHeight - $header.outerHeight());

        $win.on("scroll", function() {

            //Determine the vertical position, then subtract the  elastic scrolling amount
            var yPos = -($win.scrollTop() / scrollSpeed) - scrollUpElasticMax;

            if (yPos <= headerScrollMax) {
                //Disregard anything more than the image can be scroll past without seeing edges
                yPos = headerScrollMax;
            } else if (yPos >= 0) {
                //Keep it in bounds when there is elastic scrolling
                yPos = 0;
            }

            // Put together our final background position
            var coords = '50% ' + yPos + 'px';

            // Move the background
            $header.css("backgroundPosition", coords);
        });
    }

    function _setupNav() {
        var selectedClass = "active";
        var $sections = $content.children(".js-main-section");
        var $sidebarLinks = $("#js-convert-types a");

        $("#main-nav")
            .children("a")
            .on("click", function(ev) {
                var $self = $(this);
                var contentIdToShow = $self.attr("href").replace("#", "");

                //Change the selected class
                $self
                    .addClass(selectedClass)
                    .siblings()
                    .removeClass(selectedClass);

                //Hide all content containers
                $sections.addClass('hidden');

                //Show the one we care about
                $("#" + contentIdToShow).removeClass('hidden');

                ev.preventDefault();
            });

        //Click on the sidebar items to change settings in the UI
        $sidebarLinks
            .on("click", function(ev) {
                var $self = $(this);

                //Change the selected class
                $self
                    .addClass(selectedClass)
                    .siblings()
                    .removeClass(selectedClass);

                //Tell the parser to change formats
                var format = $self.data("format");
                parser.outputFormat = format;

                //Save this setting as a cookie stored for 1 year
                _cookie._create(formatCookieName, format, cookieDuration);

                ev.preventDefault();
            });

        //Read the saved format cookie on load
        var savedFormat = _cookie._read(formatCookieName);
        var $toSelect = $([]);

        //If we have a value, find the item in the UI that matches
        if (savedFormat !== null) {
            $toSelect = $sidebarLinks.filter('[data-format="' + savedFormat + '"]');
        }

        //If the UI item was not selected, then just select the first one
        if ($toSelect.length === 0) {
            $toSelect = $sidebarLinks.first();
        }

        //Trigger a click on this item
        $toSelect.triggerHandler("click");
    }

    function _setupDonationAndSongCounter() {
        //Get the previous number of parsed songs
        songCount = parseInt(_cookie._read(songCountCookieName));

        //If there is no stored count, create a cookie that will last for 1 year
        if (isNaN(songCount)) {
            songCount = 0;
            _cookie._create(songCountCookieName, songCount, cookieDuration);
        }

        $("#donate-nag-no-thanks").one('click', function() {
            showDonationNag = false;
            $donationNag.addClass('hidden');

        });
    }
    //======================================================================



    //======================================================================
    //Set up the parser
    //======================================================================
    function _setupParser() {
        //Extend the parser with the local displayError function
        parser.displayError = displayError;

        //Extend the parser with the local displaySuccessHtml function
        parser.displaySuccessHtml = displaySuccessHtml;

        $('html')
            .fileDragAndDrop(function(fileCollection) {
                _resetUI();

                //Reset lists
                parser.errorList = [];
                parser.songList = [];

                //Loop through each file and parse it
                $.each(fileCollection, parser.parseFile);

                //Parsing complete, run the display/output functions
                parser.complete($output);

                //Update the total converted song count
                _updateSongCount(parser.songList.length);

                //Also display errors if there are any
                if (parser.errorList.length) {

                    var errorTitle = parser.errorList.length === 1 ? "One song ran into an error and could not be converted" : "We ran into errors with " + parser.errorList.length + " of the songs, and they were not converted";

                    //Join all the error messages together
                    displayError(parser.errorList.join("<br/>"), errorTitle);
                }

            });
    }

    function _updateSongCount(songsToAdd) {
        songCount += songsToAdd;

        //re-save the cookie with the new count
        _cookie._create(songCountCookieName, songCount, cookieDuration);

        if (showDonationNag && songCount > donationNagThreshhold) {
            $donationNag.removeClass('hidden');
            $("#total-song-count").text(songCount);
        }
    }

    function _resetUI() {
        $areaBegin.addClass('hidden');
        $areaDisplay.removeClass('hidden');
        $dropMore.removeClass('hidden');
        $output.empty();

        //Empty out the UI so we can put in new data...
        $parserErrorDisplay
            .empty()
            .addClass('hidden');
    }

    //Public function used to "fill in" the parser's error display requirement
    function displayError(msg, title) {
        var htmlString = "";
        if (title && title.length) {
            htmlString += "<h3>" + title + "</h3>";
        }
        htmlString += "<p>" + msg + "</p>";

        $parserErrorDisplay
            .removeClass('hidden')
            .html(htmlString);
    }

    function displaySuccessHtml(convertedFileContents, THIS_OUTPUT, FILE_EXTENSION) {
        //Display any successes if we have them
        if (convertedFileContents.length > 0) {
            //Make some unique ID's we can select on later
            var downloadZipId = "btn-" + THIS_OUTPUT + "-download-zip";
            var downloadFilesId = "btn-" + THIS_OUTPUT + "-download-files";

            //Build up some HTML to write out
            var finalHtml = "<h1>Converted " + convertedFileContents.length + " Song File" + (convertedFileContents.length > 1 ? "s" : "") + "!</h1>";
            if (convertedFileContents.length > 1) {
                finalHtml += "<button id='" + downloadZipId + "' type='button' class='btn btn-lg btn-primary'>Download as .zip</button>";
                finalHtml += " or <button id='" + downloadFilesId + "' type='button' class='btn btn-default'>Download " + convertedFileContents.length + " individual files</button>";
            } else {
                finalHtml += "<button id='" + downloadFilesId + "' type='button' class='btn btn-lg btn-primary'>Download file</button>";
            }

            //Write the HTML to the page
            $output.html(finalHtml);

            //Add click events to each button we added above
            $("#" + downloadZipId).on("click", function() {

                //Create a new .ZIP archive
                var zip = new JSZip();

                //Go through and add each file to the zip
                $.each(convertedFileContents, function(i, convertedSong) {
                    zip.file(convertedSong.name + FILE_EXTENSION, convertedSong.data);
                });

                //Generate the zip file contents
                var zipContent = zip.generate({
                    type: "blob"
                });
                //Download it!
                saveAs(zipContent, "converted files.zip");
            });

            $("#" + downloadFilesId).on("click", function() {
                $.each(convertedFileContents, function(i, convertedSong) {
                    var fileBlob = new Blob([convertedSong.data], {
                        type: "text/xml;charset=utf-8"
                    });
                    saveAs(fileBlob, convertedSong.name + FILE_EXTENSION);
                });
            });
        }
    }

})();