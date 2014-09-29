(function($) {
    'use strict';

    var _exitTimer = null;

    // jQuery plugin initialization
    $.fn.fileDragAndDrop = function(options) {

        //If a function was passed in instead of an options object,
        //just use this as the onFileRead options instead
        if ($.isFunction(options)) {
            var o = {};
            o.onFileRead = options;
            options = o;
        }

        //Return the elements & loop though them
        return this.each(function() {
            var $dropArea = $(this);

            //Create a finalized version of the options
            var opts = $.extend({}, $.fn.fileDragAndDrop.defaults, options);

            //If this option was not set, make it the same as the drop area
            if (opts.addClassTo.length === 0) {
                opts.addClassTo = $dropArea;
            }

            //can't bind these events with jQuery!
            this.addEventListener('dragenter', function(ev) {
                _events._over(ev, $dropArea, opts);
            }, false);
            this.addEventListener('dragover', function(ev) {
                _events._exit(ev, $dropArea, opts);
            }, false);
            this.addEventListener('drop', function(ev) {
                _events._drop(ev, $dropArea, opts);
            }, false);
        });
    };

    $.fn.fileDragAndDrop.defaults = {
        overClass: "over",
        addClassTo: $([]),
        onFileRead: null
    };

    var _events = {
        _over: function(ev, $dropArea, opts) {
            $(opts.addClassTo).addClass(opts.overClass);
            _stopEvent(ev);
        },
        _exit: function(ev, $dropArea, opts) {
            clearTimeout(_exitTimer);
            _exitTimer = setTimeout(function() {
                $(opts.addClassTo).removeClass(opts.overClass);
            }, 100);
            _stopEvent(ev);
        },
        _drop: function(ev, $dropArea, opts) {
            $(opts.addClassTo).removeClass(opts.overClass);
            _stopEvent(ev);
            var fileList = ev.dataTransfer.files;

            //Create an array of file objects for us to fill in
            var fileArray = [];

            //Loop through each file
            for (var i = 0; i <= fileList.length - 1; i++) {

                //Create a new file reader to read the file
                var reader = new FileReader();

                //Create a closure so we can properly pass in the file information since this will complete async!
                var completeFn = (_handleFile)(fileList[i], fileArray, fileList.length, opts);

                //Different browsers implement this in different ways, but call the complete function when the file has finished being read
                if (reader.addEventListener) {
                    // Firefox, Chrome
                    reader.addEventListener('loadend', completeFn, false);
                } else {
                    // Safari
                    reader.onloadend = completeFn;
                }

                //Actually read the file
                reader.readAsDataURL(fileList[i]);
            }
        }
    };

    //This is the complete function for reading a file,

    function _handleFile(theFile, fileArray, fileCount, opts) {
        //When called, it has to return a function back up to the listener event
        return function(ev) {
            //Add the current file to the array
            fileArray.push({
                name: theFile.name,
                size: theFile.size,
                type: theFile.type,
                lastModified: theFile.lastModifiedDate,
                data: ev.target.result
            });

            //Once the correct number of items have been put in the array, call the completion function		
            if (fileArray.length === fileCount && $.isFunction(opts.onFileRead)) {
                opts.onFileRead(fileArray, opts);
            }
        };
    }

    function _stopEvent(ev) {
        ev.stopPropagation();
        ev.preventDefault();
    }
})(jQuery);