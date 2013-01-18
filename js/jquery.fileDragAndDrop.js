(function($){
	var _exitTimer = null;
	var overClass = "over";

	// jQuery plugin initialization
	$.fn.fileDragAndDrop = function (options) {

		//If a function was passed in instead of an options object,
		//just use this as the onFileRead options instead
		if($.isFunction(options)){
			var o = {};
			o.onFileRead = options;
			options=o; 
		}

		//Create a finalized version of the options
		var opts = opts = $.extend({}, $.fn.fileDragAndDrop.defaults, options);

		//Return the elements & loop though them
		return this.each(function(){
			var $dropArea = $(this);
			
			//can't bind these events with jQuery!
			this.addEventListener('dragenter', function(ev){
				_events._over(ev, $dropArea, opts);
			}, false);
			this.addEventListener('dragover', function(ev){
				_events._over(ev, $dropArea, opts);
			}, false);
			this.addEventListener('dragexit', function(ev){
				_events._exit(ev, $dropArea, opts);
			}, false);
			this.addEventListener('drop', function(ev){
				_events._drop(ev, $dropArea, opts);
			}, false);
		});
	};

	$.fn.fileDragAndDrop.defaults = {
		overClass: "over",
		onFileRead: null
	};

	var _events = {
		_over : function(ev, $dropArea, opts){
			$dropArea.addClass(opts.overClass);
			_stopEvent(ev);
		},
		_exit : function(ev, $dropArea, opts){
			clearTimeout(_exitTimer);
			_exitTimer=setTimeout(function(){
				$dropArea.removeClass(opts.overClass);
			},50);
			_stopEvent(ev);
		},
		_drop : function(ev, $dropArea, opts){
			$dropArea.removeClass(opts.overClass);
			_stopEvent(ev);
			var files = ev.dataTransfer.files;

			for(var i = 0; i <= files.length; i++){
				_handleFiles(files[i], opts);
			}
		}
	};

	function _handleFiles(file, opts) {
		var reader = new FileReader();

		if(reader.addEventListener) {
			// Firefox, Chrome
			reader.addEventListener('loadend', function(ev){
				_handleReaderLoadEnd(ev, file.name, opts);
			}, false);
		} else {
			// Safari
			reader.onloadend = function(ev){
				_handleReaderLoadEnd(ev, file.name, opts);
			};
		}
		reader.readAsDataURL(file);
	}

	function _handleReaderLoadEnd(ev, fullFileName, opts) {
		var data = ev.target.result;
		if(data.length>1 && $.isFunction(opts.onFileRead)){
			opts.onFileRead(data, fullFileName)
		}
	}

	function _stopEvent(ev){
		ev.stopPropagation();
		ev.preventDefault();
	}
})(jQuery);