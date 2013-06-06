var parser = (function(){

	//Init some vars to be used within this scope
	var $dropArea;
	var $beginTutorial;
	var $errorContainer;
	var $output;
	var $outputSelection;

	function _init(){
		//Fill in the variables
		$dropArea = $("#drop-area");
		$errorContainer = $("#error-display");
		$output = $("#js-output");
		$outputSelection = $("#js-output-selection");
		$beginTutorial = $("#begin");

		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Windows Phone|Zune/i.test(navigator.userAgent) ) {
			displayError("Sorry, SongParserJS this cannot be used on mobile devices!","Unsupported Browser!");
			$dropArea.hide();
			$outputSelection.hide();
		}else if(Modernizr.draganddrop && window.FileReader){
			//If the browser does not nativly support Base64 encode/decode,
			//load in a file to add this support
			Modernizr.load({
				test: window.atob && window.btoa,
				nope: "scripts/plugins/base64.js"
			});

			//Init the drag-n-drop feature
			_fileDragAndDrop();

			//Hard-set the sidebar width, then affix it to the page
			//var $sidebar = $("#sidebar");
			//$sidebar.width($sidebar.width()).affix();
		}else{
			//no drag-n-drop support
			displayError("Sorry, you won't be able to use SongParserJS<br />because your browser does not support file Drag-N-Drop!<br/><br/>Try using a modern browser like <a href='www.google.com/chrome'>Google Chrome</a> instead!","Unsupported Browser!");
			$dropArea.hide();
			$outputSelection.hide();
		}
	}

	function _fileDragAndDrop(){
		$dropArea.fileDragAndDrop(function(fileCollection){
			_resetUI();

			var errors=[];
			var songList = [];

			$.each(fileCollection, function(i, fileObj){
				var data = fileObj.data;
				var fullFileName = fileObj.name;

				try{
					//Find the file extention
					var fileParts = fullFileName.split(".");
					var fileName = fileParts[0];
					var fileExt = fileParts.slice(-1)[0].toLowerCase();

					//Test the file extension with the test function registered with each format type
					//When one matches, use that formats convert function
					var convertFn;
					$.each(parser.formats,function(format, formatObj){
						if(formatObj.testExtension(fileExt)){
							convertFn = formatObj.convert;
							return false;
						}
					});

					//Make sure the convert function exists...
					if($.isFunction(convertFn)){
						//Browsers will add some unneeded text to the base64 encoding. Remove it.
						var encodedSongData = data.replace(/^data:.*;base64,/,"");
						var decodedSongData = utilities.decode(encodedSongData);

						//Pass the decoded song date to the convert function
						//We will get back a normalized version of the song content for the supported file type
						songList.push({
							name: fileName,
							data: convertFn(decodedSongData, fileName)
						});

					}else{
						errors.push("The file <strong>"+fullFileName+"</strong> cannot be parsed because <strong>."+fileExt.toUpperCase()+"</strong> files are not supported!")
					}
				}catch(ex){
					errors.push("There was an error reading the file <strong>"+fullFileName+"</strong>");
				}
			});

			if(songList.length){
				//Pass the final song data to the selected output type
				parser.outputs[$outputSelection.val()]($output, songList);
			}
				
			if(errors.length){
				displayError(errors.join("<br/>"), "Error!");
			}

		});
	}

	function _resetUI(){
		//Empty out the UI so we can put in new data...
		$errorContainer.empty().hide();
		$output.empty();
		$beginTutorial.hide();
	}
	
	//==========================
	//PUBLIC FUNCTIONS BELOW
	//==========================
	var utilities = {
		decode: function(str){
			var decoded = window.atob( str );
			try{
				return decodeURIComponent(escape(decoded));
			}catch(ex){
				return decoded;
			}
		},
		encode:function(str){
			return window.btoa(unescape(encodeURIComponent( str )));
		}
	}

	function displayError(msg, title){
		var htmlString = "";
		if(title && title.length){
			htmlString += "<h3>"+title+"</h3>";
		}
		htmlString += "<p>"+msg+"</p>";
		$errorContainer.show().html(htmlString);
	}

	//==========================
	//PAGE LOAD
	//==========================
	$(_init);

	return {
		utilities: utilities,
		displayError: displayError,
		formats:{}, //Filled in by other files
		outputs:{}, //Filled in by other files
		resetUI:{} //Filled in by other files
	}
})();