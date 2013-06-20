(function(){
	//Vars for this scope
	var $header;
	var $content;
	var $areaBegin;
	var $areaDisplay;
	var $dropMore;
	var $output;
	var $parserErrorDisplay;
	var fadeSpeed = 400;
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
	$(function(){
		//Fill in variables wil selected elements
		$header = $('#header');
		$content = $('#main');
		$areaBegin = $("#begin-area");
		$areaDisplay = $("#display-area");
		$dropMore = $("#drop-area-more");
		$output = $("#output")
		$parserErrorDisplay = $('#parser-error-display');
		$donationNag = $("#many-songs-please-donate");
		$totalSongCountDisplay = $("#total-song-count");

		_detectMobile();

		//Skip for mobile devices since they won't be seen anyway
		if(!isMobile){
			_setupHeaderImage();
			_setupHeaderParrallax();
			_setupNav();
			_detectFeatures();
			_setupDonationAndSongCounter()
		}
	});



	var _cookie = {
		_create: function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		_read:function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		_erase: function(name) {
			createCookie(name,"",-1);
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

		//cut off the top of the image a bit, this will show the parrallax effect for OSX Elastic scrolling upwards
		var scrollUpElasticMax = 20;
		var headerScrollMax = -(imgHeight - $header.outerHeight());

		$win.on("scroll", function() {

			//Determine the vertical position, then subtract the  elastic scrolling amount
			var yPos = -($win.scrollTop() / scrollSpeed) - scrollUpElasticMax;
			
			if(yPos <= headerScrollMax){
				//Disregard anything more than the image can be scroll past without seeing edges
				yPos = headerScrollMax;
			}else if(yPos >= 0){
				//Keep it in bounds when there is elastic scrolling
				yPos = 0;
			}

			// Put together our final background position
			var coords = '50% '+ yPos + 'px';

			// Move the background
			$header.css("backgroundPosition", coords);
		});
	}

	function _setupNav() {
		var selectedClass = "nav-current";
		var $sections = $content.children(".js-main-section");
		var $sidebarLinks = $content.find(".nav-sidebar a");

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
			$sidebarLinks
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

					//Save this setting as a cookie stored for 1 year
					_cookie._create(formatCookieName, format, cookieDuration)

					ev.preventDefault();
				});

			//Read the saved format cookie on load
			var savedFormat = _cookie._read(formatCookieName);
			var $toSelect = $([]);

			//If we have a value, find the item in the UI that matches
			if(savedFormat !== null){
				$toSelect = $sidebarLinks.filter('[data-format="'+ savedFormat +'"]');
			}
			
			//If the UI item was not selected, then just select the first one
			if($toSelect.length===0){
				$toSelect = $sidebarLinks.first();
			}

			//Trigger a click on this item
			$toSelect.triggerHandler("click");
			
			//Affix the sidebar to the page on scroll	
			var $toAffix = $("#affix-contents");
			var topPos = $toAffix.offset().top - parseInt($header.css("margin-bottom"), 10);

			$toAffix
				.affix({
					offset:{
						top: topPos
					}
				});
	}

	function _setupDonationAndSongCounter(){
		//Get the previous number of parsed songs
		songCount = parseInt(_cookie._read(songCountCookieName));
		
		//If there is no stored count, create a cookie that will last for 1 year
		if(isNaN(songCount)){
			songCount = 0;
			_cookie._create(songCountCookieName, songCount, cookieDuration);
		}

		$("#donate-nag-no-thanks").one('click', function(){
			showDonationNag = false;
			$donationNag.fadeOut(fadeSpeed);

		});
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

				//Loop through each file and parse it
				$.each(fileCollection, parser.parseFile);

				//Parsing complete, run the display/output functions
				parser.complete($output);

				//Update the total converted song count
				_updateSongCount(parser.songList.length);
				
				//Also display errors if there are any
				if(parser.errorList.length){

					var errorTitle = parser.errorList.length == 1 ? "One song ran into an error and could not be converted": "We ran into errors with " + parser.errorList.length + " of the songs, and they were not converted";

					//Join all the error messages together
					displayError(parser.errorList.join("<br/>"), errorTitle);
				}

			});
	}

	function _updateSongCount(songsToAdd){
		songCount += songsToAdd;

		//re-save the cookie with the new count
		_cookie._create(songCountCookieName, songCount, cookieDuration);

		if(showDonationNag && songCount > donationNagThreshhold){
			$donationNag.show();
			$("#total-song-count").text(songCount);
		}
	}

	function _resetUI(){
		$areaBegin.hide();
		$areaDisplay.fadeIn(fadeSpeed);
		$dropMore.fadeIn(fadeSpeed);
		$output.empty();

		//Empty out the UI so we can put in new data...
		$parserErrorDisplay
			.empty()
			.hide();
	}

	//Public function used to "fill in" the parser's error display requirement
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