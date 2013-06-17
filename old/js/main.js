(function() {

	var speed = 500;
	var trans = "easeOutExpo";
	var bouncyTrans = "easeInOutBack";
	var currentNav = "selected";
	var fileDropElement = null;
	var $navItems = null;
	var totalFiles = 0;
	var maxFiles = 30;

	//Immediately!
	_loadFont();


	//Page Load
	$(function(){
		//Apply Uniform
		$("select, input, button").uniform();

		//Fill in the text for the max number of files
		$("#maxUploadWarning").children("strong").text(maxFiles);
		
		//Start the navigation animations
		_navigaiton._setup();

		//Start the file uloader stuff
		_forms._setup();

		$(".donate-submit").click(function(){
			$(this).parents("form").first().submit();

			return false;
		});
	});

	function _loadFont(){
		WebFontConfig = {google: { families: [ 'Ubuntu:regular,500' ] }};
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	}

	var _navigaiton = {
		_setup : function(){
			//click the nav items
			$navItems=$("aside nav a");
			$navItems.click(function (e){
				_navigaiton._update($(this), bouncyTrans);
				//e.preventDefault();
				//return false;
			});

			//animate each nav item in 
			$navItems
				.css("margin-right","-150px")
				.each(function(i,el){
					setTimeout(function(){
						$(el).animate({
							"margin-right":0
						},800, bouncyTrans);
					},150*i);
				});

			//On page load wait 1/2 a second, then select the nav item based on the URL hash
			setTimeout(function(){
				var $selectedItem = $navItems.filter("[href='"+document.location.hash+"']");
				var $firstItem = $navItems.first();
				
				//use the hash item uness it's the first item. Otherwise just use the first item
				var $whichItem =(document.location.hash.length >1 && $selectedItem.length > 0 && $selectedItem[0]!=$firstItem[0])?$selectedItem:$firstItem ;
				_navigaiton._update($whichItem, bouncyTrans, "easeOutElastic");
			},500);
		},
		_update : function($pointAt, myTransition, arrowTrans){
			if(!arrowTrans) arrowTrans=myTransition;
			//fade the clicked element to the selected color
			$pointAt.animate({
				color:"#3ea8b2"
			},speed,function(){
				//add the correct class
				$pointAt.addClass(currentNav)
			});
			
			//Remove the class from the other elements and fade them to the unselected color
			$pointAt
				.siblings()
				.removeClass(currentNav)
				.animate({
					color:"#111111"
				}, speed);
			
			//move the pointer (select by the class so we can trigger this from JS)
			$("#nav-pointer").animate({
				top:$pointAt.offset().top-3
			},speed*2,arrowTrans);
			
			//780 is the width of the content
			$("#contentFX").animate({
				left:parseInt("-"+($pointAt.index()*780))
			},speed*2,myTransition);
		}
	}

	var _forms = {
		_setup:function(){
			//select the file drop element
			fileDropElement= $("#upload-drop");

			//ajax form submission
			$('#uploadForm').iframePostForm({
				post:function (){
					//clear out previous data and hide
					$("#outputSongs,#outputErrors").hide();
				},
				complete:function (response){
					//clear the file input
					$("#upload").val("");
					//$.uniform.update("#upload");
					
					$("#errorMessages,#downloadLinks").empty();
					var data = $.parseJSON(response);
					
					
					// if(window.console){
					// 	console.log(response);
					// 	console.log(data);
					// }
					
					
					//Make the links for the song file downloads			
					var makeLinks="";
					var songCount=0;
					$.each(data.songs,function(songName,converted){
						songCount++;
						var prettyFileName = songName.replace(/\\'/g, "'");
						//if(window.console) console.log(songName," - ",converted);
						makeLinks+="<a class=icon_"+data.type+" href=\"lib/download.php?f="+converted+"&t="+data.type+"&n="+songName+"\">"+prettyFileName+"</a>";
					});
					if(songCount>0){
						//clear out anything that was previously there and write the new HTML
						$("#downloadLinks").html(makeLinks);
						$("#outputSongs").slideDown({
							duration:speed,
							easing:trans
						});
					}
					
					//Output any errors from the server
					
					var errors="";
					var errorCount=0;
					$.each(data.errors,function(num,msg){
						errorCount++;
						errors+="<li>"+msg+"</li>";
					});
					if(errorCount>0){
						//clear out anything that was previously there and write the new HTML
						$("#errorMessages").html("<ul>"+errors+"</ul>");
						$("#outputErrors").slideDown({
							duration:speed,
							easing:trans
						});

						//we have errors AND songs. So, hide the return button in this one
						if(songCount>0) $("#outputErrors").find("button, .button").hide()
					}
					
					//hide the form
					if(songCount >0 || errorCount>0){
						$("#uploadForm").slideUp({
							duration:speed,
							easing:trans
						});
					}
				}
			});

			//Back to the upload form
			$("#outputSongs, #outputErrors").find("button").click(function(){
				//reset the text in the upload control
				$("#upload").siblings(".filename").text($.uniform.options.fileDefaultText);

				$("#file-list ul").empty();
				totalFiles = 0;

				_checkUploadedFileCount();
				
				$("#uploadForm").slideDown({
					duration:speed,
					easing:trans
				});
				$("#outputSongs,#outputErrors").slideUp({
					duration:speed,
					easing:trans,
					complete:function(){
						//Show the error message return button again just in case if it was hidden
						$("#outputErrors").find("button, .button").show()
					}
				});
			});

			
			fileDropElement = document.getElementById("drop-area");
			if(Modernizr.draganddrop && window.FileReader){
				//can't bind these events with jQuery!
				fileDropElement.addEventListener('dragenter', _forms._dragEvents._enter, false);
				fileDropElement.addEventListener('dragover', _forms._dragEvents._exit, false);
				fileDropElement.addEventListener('dragover', _forms._dragEvents._over, false);
				fileDropElement.addEventListener('drop', _forms._dragEvents._drop, false);
				
				//manual switch for the normal uploader
				$("#upload-switch").click(function(){
					$("#upload-drop").hide();
					$("#upload-standard").show();
				});
			}else{
				//no drag-n-drop support, show the standard uploader instead
				$("#upload-drop").hide();
				$("#upload-standard").show();
			}
			
		},
		_dragEvents:{
			_exitTimer:null,
			_enter:function(ev){
				$(fileDropElement).addClass("over")
				ev.stopPropagation();
				ev.preventDefault();
			},
			_exit:function(ev){
				clearTimeout(_forms._dragEvents._exitTimer);
				_forms._dragEvents._exitTimer=setTimeout(function(){
					$(fileDropElement).removeClass("over");
				},50);
				ev.stopPropagation();
				ev.preventDefault();
			},
			_over:function(ev){
				$(fileDropElement).addClass("over")
				ev.stopPropagation();
				ev.preventDefault();
			},
			_drop:function(ev){
				$(fileDropElement).removeClass("over")
				ev.stopPropagation();
				ev.preventDefault();
				var files = ev.dataTransfer.files;
				// Only call the handler if 1 or more files was dropped.
				if (files.length > 0){
					var newTotal = files.length + totalFiles;
					var moreThanCanBeAdded = files.length + totalFiles > maxFiles;

					//Don't add more than the max at one time
					var filesToAdd =files.length;

					if(moreThanCanBeAdded){
						filesToAdd = maxFiles - totalFiles;
					}

					_checkUploadedFileCount(moreThanCanBeAdded);

					 //Loop through the files we can add!
					 for (var i = 0; i < filesToAdd; i++) {
					 	_forms._handleFiles(files[i]);
					 }

					 
				}
			}
		},
		_handleFiles:function(file) {
			var reader = new FileReader();

			if(reader.addEventListener) {
				// Firefox, Chrome
				reader.addEventListener('loadend', function(ev){
					_forms._handleReaderLoadEnd(ev, file.name);
				}, false);
			} else {
				// Safari
				reader.onloadend = function(ev){
					_forms._handleReaderLoadEnd(ev, file.name);
				};
			}
			// begin the read operation
			//reader.readAsBinaryString(file);
			reader.readAsDataURL(file);
		},
		_handleReaderLoadEnd:function(ev, fullFileName) {
			//console.log(ev)
			if(ev.target.result.length>1){
				totalFiles++;
				var fileExt = /(\.)[^\.]*$/.exec(fullFileName)[0];
				var fileName=fullFileName.replace(fileExt,"");
				
				//Browsers will add some unneeded text to the base64 encoding that messes up the server code.  Remove it.
				var encodedSong = ev.target.result.replace("application/octet-stream;","").replace(/data:?;?base64,?/,"");

				//create a hidden input with the Base64 encoded data as it's value
				var fileListItem='\
				<li class="file" style="display:none;">\
					<a href="javascript:{};" title="Remove File">X</a>\
					'+fileName+'<small>'+fileExt+'</small>\
					<input type="hidden" name="fileNames[]" value="'+fullFileName+'" />\
					<input type="hidden" name="encodedSongs[]" value="'+encodedSong+'" />\
				</li>';

				//add it to the HTML, and add a click event
				$("#file-list ul").append(fileListItem).children(":last").show(speed,trans).find("a:last").click(function(){
					$(this).parent().hide(speed,trans,function(){
						totalFiles--;
						$(this).remove();

						_checkUploadedFileCount(totalFiles > maxFiles);
					});

				});
				
				_checkUploadedFileCount();
			}
		}
	}

	function _checkUploadedFileCount(shouldShowWarning){
		$("#fileCount").text(totalFiles);
		if(shouldShowWarning !== undefined){
			if(shouldShowWarning){
				$("#maxUploadWarning").slideDown(speed, trans);
			}else{
				$("#maxUploadWarning").slideUp(speed, trans);
			}
		}
	}

})();