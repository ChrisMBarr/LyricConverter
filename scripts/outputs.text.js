/*=====================================================
 * OUTPUT for converting to Text format
=======================================================*/

(function(){
	var THIS_OUTPUT = 'text';
	var FILE_EXTENSION = ".txt";

	//Extend the outputs object on the parser to allow for HTML output
	parser.outputs[THIS_OUTPUT] = function ($container, songList) {

		//Loop through and convert each file and add the 
		var convertedFileContents=[];
		var errorFiles = [];
		$.each(songList, function(i, song) {
			try{
				convertedFileContents.push({
					name: song.name,
					data: _makeTextFile(song.data)
				});
			}catch(ex){
				errorFiles.push(song.name);
			}
		});

		//Display any errors if we have them
		if(errorFiles.length){
			parser.displayError(errorFiles.join(", "), "Error converting the following " + errorFiles.length + " songs!");
		}

		_displaySuccessHtml($container, convertedFileContents);
	}

	//===================================
	//PRIVATE FUNCTIONS
	//===================================
	function _makeTextFile(songData){
		
		var txtFile = "Title: " + songData.title;

		//Loop through the song info attributes
		for (var i = 0; i < songData.info.length; i++) {
			var info = songData.info[i];
			if(info.name && info.value){
				txtFile += "\r\n";
				txtFile += info.name + ": " + info.value;
			}
		}

		txtFile += "\r\n\r\n";

		//Add the song lyrics
		for (var i = 0; i < songData.slides.length; i++) {
			var slide = songData.slides[i];
			
			//Skip blank slides for text files
			if(slide.title.length > 0 || slide.lyrics.length > 0){
				txtFile += slide.title;
				txtFile += "\r\n";
				txtFile += slide.lyrics;
				
				//Add line breaks afterwards, but not for the last slide
				if(i < songData.slides.length-1){
					txtFile += "\r\n\r\n";
				}
			}
		};

		return txtFile;

	}

	function _displaySuccessHtml($container, convertedFileContents){
		//Display any successes if we have them
		if(convertedFileContents.length > 0){
			//Make some unique ID's we can select on later
			var downloadZipId = "btn-"+THIS_OUTPUT+"-download-zip";
			var downloadFilesId = "btn-"+THIS_OUTPUT+"-download-files";

			//Build up some HTML to write out
			var finalHtml = "<h1>Converted " + convertedFileContents.length + " Song File" + (convertedFileContents.length>1?"s":"") + "!</h1>";
			if(convertedFileContents.length > 1){
				finalHtml += "<button id='"+downloadZipId+"' type='button' class='btn btn-large btn-primary'>Download as .zip</button>";	
				finalHtml += " or <button id='"+downloadFilesId+"' type='button' class='btn'>Download "+convertedFileContents.length + " individual files</button>";
			}else{
				finalHtml += "<button id='"+downloadFilesId+"' type='button' class='btn btn-large btn-primary'>Download file</button>";
			}
			
			//Write the HTML to the page
			$container.html(finalHtml);

			//Add click events to each button we added above
			$("#"+downloadZipId).on("click",function(){
				
				//Create a new .ZIP archive
				var zip = new JSZip();

				//Go through and add each fiel to the zip
				$.each(convertedFileContents, function(i, convertedSong) {
					zip.file(convertedSong.name + FILE_EXTENSION, convertedSong.data)
				});

				//Generate the zip file contents
				var zipContent = zip.generate({type:"blob"});
				//Download it!
				saveAs(zipContent, "converted files.zip");
			});

			$("#"+downloadFilesId).on("click",function(){
				$.each(convertedFileContents, function(i, convertedSong) {
					var fileBlob = new Blob([convertedSong.data], {type: "text/xml;charset=utf-8"});
					saveAs(fileBlob, convertedSong.name + FILE_EXTENSION);
				});
			});
		}
	}
})();