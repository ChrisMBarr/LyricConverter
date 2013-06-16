(function(){
	//Vars for this scope
	var $header;
	var $content;
	var $areaBegin;
	var $areaDisplay;
	var $output;
	var $parserErrorDisplay;
	var isMobile = false;

	//Page Load
	$(function(){
		//Fill in variables wil selected elements
		$header = $('#header');
		$content = $('#main');
		$areaBegin = $("#begin-area");
		$areaDisplay = $("#display-area");
		$output = $("#output")
		$parserErrorDisplay = $('#parser-error-display');

		_detectMobile();

		//Skip for mobile devices since they won't be seen anyway
		if(!isMobile){
			_setupHeaderImage();
			_setupHeaderParrallax();

			_setupNav();

			_detectFeatures();
		}
	});



	//======================================================================
	//Detect unsupported features and or devices
	//======================================================================

	function _displaySupportError (title, msg) {
		//Build up an HTML string for a bootstrap modal window
			var modalHtml = [
			'<div style="width: 90%; margin-left: -45%;" class="modal" tabindex="-1" role="dialog" aria-labelledby="unsupportedModalLabel" aria-hidden="true">',
			'   <div class="modal-header">',
			'       <h2 id="unsupportedModalLabel" class="text-error">'+title+'</h2>',
			'   </div>',
			'   <div class="modal-body">',
			'       <p style="font-size:22x;">'+msg+'</p>',
			'   </div>',
			'</div>'].join('');

			//Load in the needed bootstrap components
			Modernizr.load({
				test: $.fn.modal,
				load:[
					'scripts/bootstrap/bootstrap-modal.js',
					'styles/bootstrap-assets/modals.css'
				],
				complete:function(){
					//When loaded, launch the modal window
					$(modalHtml)
						.modal({
							keyboard:false,
							backdrop:'static'
						});
				}
			});
	}

	function _detectMobile(){
		//Set var in upper scope
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Windows Phone|Zune/i.test(navigator.userAgent);
		
		if(isMobile) {
			_displaySupportError(
				'Unsupported Device!',
				'Sorry, LyricConverter cannot be used on mobile devices!<br/><br/>Please use a desktop computer that supports file uploads and downloads.'
			);
		}
	}

	function _detectFeatures(){

		//If the browser does not nativly support Base64 encode/decode,
		//load in a file to add this support
		Modernizr.load({
			test: window.atob && window.btoa,
			nope: "scripts/plugins/base64.js"
		});


		//Make sure we have basic support for file drag-drop features
		if(Modernizr.draganddrop && window.FileReader){
			//Yay! This browser can be used!
			//Init the parser
			_setupParser();
		}else{
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

	function _setupHeaderImage(){
		var headerImgCount = 8;
		var headerImgPattern = /header-(\d+)\.jpg/;

		function _replaceImg (fromClick) {
			//Determine the new number
			var randomImgNumber = Math.floor(Math.random() * headerImgCount) + 1;
			var imgPath = $header.css("background-image");

			//Get the current path & parse it
			var parts = imgPath.match(headerImgPattern);

			//If the numbers cannot be teh same AND the same number was just selected,
			//Then recurse this function and stop this iteration of it
			if(fromClick && randomImgNumber === parseInt(parts[1],10)){
				_replaceImg(true);
				return;
			}
			
			//Replace it with the new one
			var newimgPath= imgPath.replace(parts[0], "header-"+randomImgNumber+".jpg");

			//Set the CSS
			$header.css("background-image", newimgPath);
		}

		//call initially
		_replaceImg(false);

		//When the header is clicked...
		$header.on("click",function (ev) {
			//Make sure a link wasn't clicked
			if(ev.target.tagName !== "A"){
				//Get another random image
				_replaceImg(true);
			}
		})
	}

	function _setupHeaderParrallax(){
		var $win = $(window)
		var scrollSpeed = 2.4;
		var imgHeight = 350;
		var headerScrollMax = -(imgHeight - $header.outerHeight());

		$win.on("scroll", function() {
			var yPos = -($win.scrollTop() / scrollSpeed);
			
			if(yPos <= headerScrollMax){
				//Disregard anything more than the image can be scroll past without seeing edges
				yPos = headerScrollMax;
			}else if(yPos >=0){
				//Keep it in bounds when there is elastic scrolling
				yPos = 0;
			}

			// Put together our final background position
			var coords = '50% '+ yPos + 'px';

			// Move the background
			$header.css("backgroundPosition", coords);
		});
	}

	function _setupNav () {
		var selectedClass = "nav-current";
		var $sections = $content.children(".js-main-section");

		$("#main-nav")
			.children("a")
			.on("click",function(ev){
				var $self = $(this);
				var contentIdToShow = $self.attr("href").replace("#","");

				//Change the selected class
				$self
					.addClass(selectedClass)
					.siblings()
					.removeClass(selectedClass);

				//Hide all content containers
				$sections.hide();
				
				//Show the one we care about
				$("#" + contentIdToShow).show();

				ev.preventDefault();
			});

			//Click on the sidebar items to change settings in the UI
			$content
				.find(".nav-sidebar a")
				.on("click",function(ev){
					var $self = $(this);

					//Change the selected class
					$self
						.addClass(selectedClass)
						.siblings()
						.removeClass(selectedClass)

					//Tell the parser to change formats
					var format = $self.data("format");
					parser.outputFormat = format;

					ev.preventDefault();
				})

				//Find the first one and fire it's click event
				.first()
				.triggerHandler("click");
	}
	//======================================================================


	//======================================================================
	//Set up the parser
	//======================================================================
	function _setupParser(){

		//Extend the parser with the local displayError function
		parser.displayError = displayError;

		$('html')
			.fileDragAndDrop(function(fileCollection){
				_resetUI();

				//Reset lists
				parser.errorList = [];
				parser.songList = [];

				$.each(fileCollection, parser.parseFile);

				if(parser.songList.length){
					//Pass the final song data to the selected output type
					parser.outputs[parser.outputFormat]($output, parser.songList);
				}
					
				if(parser.errorList.length){
					displayError(parser.errorList.join("<br/>"), "Error!");
				}

			});
	}

	function _resetUI(){
		$areaBegin.hide();
		$areaDisplay.show();
		$output.empty();

		//Empty out the UI so we can put in new data...
		$parserErrorDisplay
			.empty()
			.hide();
	}

	function displayError(msg, title){
		var htmlString = "";
		if(title && title.length){
			htmlString += "<h3>"+title+"</h3>";
		}
		htmlString += "<p>"+msg+"</p>";

		$parserErrorDisplay
			.show()
			.html(htmlString);
	}
	

})();