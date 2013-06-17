<?php
	//include some codez
	require('lib/includes/Functions.php');

	//initiate some classes
	$ssp = new SongShowPlus();
	$pp = new ProPresenter();
?>
<section id="section_convert" class="grid_10 alpha omega">
	<header>
		<div  class="grid_8 push_1 alpha">
			<h2>Convert</h2>
			<h3>SongShow Plus files to ProPresenter 4 or plain text</h3>
		</div>
		<div class="clear"></div>
		<hr />
	</header>
	<form id="uploadForm" action="lib/Process.php" method="POST" enctype="multipart/form-data">
		<div class="step-label grid_1 alpha">
				step <span>1</span>
		</div>
		<div class="step grid_9 omega">
			<div id="upload-drop">
				<div  class="grid_5 alpha">
					<div id="drop-area">
						Drag SongShow Plus Files Here
						<small>(no really, you can just drag them into your browser!) </small>
					</div>
				</div>
				<div id="file-list" class="grid_4 omega">
					<ul></ul>
					<strong><span id="fileCount">0</span> files</strong>
				</div>
				<div class="clear"></div>
				<a id="upload-switch" href="javascript:{};">&hellip;or just use the standard uploader</a>

				<div id="maxUploadWarning">
					Sorry, you can't upload more than <strong>0</strong> files at once!
					<br />
					<small>(My little server can't handle more than that!)</small>
				</div>

			</div>
			<div id="upload-standard">
				<label for="upload">Upload some SongShowPlus files</label>
				<input id="upload" name="songfiles[]" type="file" multiple />
			</div>
		</div>

		<div class="clear"></div>
		<hr />

		<div class="step-label grid_1 alpha">
				step <span>2</span>
		</div>
		<div class="step grid_8 omega">
			<label for="convertType">Please convert these files into</label>
			<select name="convertType" id="convertType">
				<option value="<? echo $pp->fileExt; ?>">ProPresenter 4 Files</option>
				<option value="<? echo $ssp->fileExtTxt; ?>">Plain Text Files</option>
			</select>
		</div>

		<div class="clear"></div>
		<hr />
		
		<div class="step-label grid_1 alpha">
				step <span>3</span>
		</div>
		<div class="step grid_8 omega">
			<input id="submit" value="Convert 'Em!" type="submit"/>
		</div>

		<div class="clear"></div>
		<hr />
	</form>

	<div class="step grid_8 push_1 alpha omega">
		<div id="outputSongs">
			<button class="push_2">Convert some more?</button>
			<h3>Done! Click to download them.</h3>
			<div id="downloadLinks"></div>
		</div>

		<div id="outputErrors">
			<button class="push_2">Try again?</button>
			<h3 class="alert">Errors:</h3>
			<div id="errorMessages"></div>
		</div>
	</div>

</section>