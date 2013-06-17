<?php
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Import some junk
	require_once('includes/Functions.php');
	$exp = new Export();
	$msg = new Messages();
	$ssp = new SongShowPlus();
	$pp = new ProPresenter();
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	$test = array();

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//POST Variables
	$uploadPostName="songfiles";
	$DND_EncodedPostName="encodedSongs";
	$DND_PostFileName="fileNames";
	$convertType=$ssp->fileExtTxt;
	//If not defined or is something else, default to text output
	if($_POST["convertType"]==$pp->fileExt){
		$convertType=$pp->fileExt;
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Folder locations and output arrays
	$uploadDir=$exp->uploadDirectory;
	$outputDir=$exp->outputDirectory;
	$validFiles=array();
	$errors=array();
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Generic function to validate that the correct file type was uploaded
	function validateFile($FullFileName,&$outputName){
		global $ssp,$errors,$msg;

		//some basic security...
		//$FullFileName = addslashes($FullFileName);
		
		$FileNameParts=explode(".",$FullFileName);
	 	//the name is all parts of the array except for the last (in case there are multiple dots in the filename)
	 	$Name = "";
	 	for ($i=0; $i < sizeof($FileNameParts)-1; $i++) {
	 		if($i>0) $Name .= ".";
	 		$Name .= $FileNameParts[$i];
	 	}

		//the extension is the last part of this array
		$Extension = strtolower(end($FileNameParts));

		//Save this as the reference var to pass back out
		$outputName = $Name;

		//make sure the file has the correct extention for SSP
		$result = $Extension==$ssp->fileExt;

		//add an error message if needed
		if(!$result) array_push($errors,$msg->IncorrectFileType($FullFileName,$ssp->fileExt));

		return $result;
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Generic function to process the uploaded files
	function ProcessUploads($newFileName,$originalFileName,$fileContents){
		//grab some vars from the global scope
		global $outputDir,$convertType,$pp,$exp,$validFiles;
		
		$converted="";
		if($convertType== $pp->fileExt){
			//Make this export to ProPresenter Format
			$converted = $pp->OutputProPresenter($fileContents,$originalFileName);
		}else{
			//Otherwise, just output plain text
			$converted = $exp->OutputText($fileContents,$originalFileName);
		}
		//Create the file
		$file = fopen($outputDir.$newFileName, "w+"); 
		fwrite($file, $converted); 
		fclose ($file);
		
		//Add the file to the array
		$validFiles[$originalFileName]=$newFileName;
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//Check for files from the standard uploader
	if(!empty($_FILES[$uploadPostName]["name"][0])){
		//Loop through the uploaded files
		foreach($_FILES[$uploadPostName]["name"] as $key => $error){
			//No PHP errors for this file
			if($error == UPLOAD_ERR_OK){
				$test .= "upload OK   -   ";
				$tmp_name = $_FILES[$uploadPostName]["tmp_name"][$key];
				$FileName=$_FILES[$uploadPostName]["name"][$key];
				
				$renamedUpload = microtime(true)."_".$key;
				$FileNameWithoutExtension="";
				$FileIsValid = validateFile($FileName,$FileNameWithoutExtension);

				if($FileIsValid && move_uploaded_file($tmp_name, $uploadDir.$renamedUpload)){
					//extract the file contents
					$content=file_get_contents($uploadDir.$renamedUpload);
					//Pass it off to be converted...

					ProcessUploads($renamedUpload,$FileNameWithoutExtension,$content);
					//remove the original uploaded file from the server
					unlink($uploadDir.$renamedUpload);
				}else{
					//make sure only the correct error shows here
					if($FileIsValid) array_push($errors,$msg->ErrorUploadingFile($FileNameWithoutExtension));
				}
			}else{
				array_push($errors,$msg->ErrorUploadingFile($_FILES[$uploadPostName]["name"][$key]));
			}
		}
	
	//Check for files from the drag-n-drop uploader - make sure they aren't empty and they have the same number of items
	}elseif(!empty($_POST[$DND_PostFileName]) && !empty($_POST[$DND_EncodedPostName]) && count($_POST[$DND_PostFileName])==count($_POST[$DND_EncodedPostName])){
		

		 for ($i=0; $i < count($_POST[$DND_PostFileName]); $i++) { 
		 	$encodedSong = $_POST[$DND_EncodedPostName][$i];
		 	$DecodedSong = base64_decode($encodedSong );
		 	$FileName=$_POST[$DND_PostFileName][$i];

		 	$FileToCreate = microtime(true)."_".$i;
			$FileNameWithoutExtension="";

			//echo $_POST[$DND_EncodedPostName][$i];
			//print_r($DecodedSong);

			if($DecodedSong){
				if(validateFile($FileName,$FileNameWithoutExtension)) ProcessUploads($FileToCreate,$FileNameWithoutExtension,$DecodedSong);
			}else{
				array_push($errors,$msg->ErrorUploadingFile());
			}

			array_push($test, $FileToCreate);
			array_push($test, $FileNameWithoutExtension);
			array_push($test, $encodedSong );
			array_push($test, $DecodedSong);
		 }
	}else{
		if(sizeof($validFiles)>0) array_push($errors,$msg->ErrorUploadingFile());
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//If no files were uploaded or none were valid, add the error
	if(sizeof($validFiles)<1) array_push($errors,$msg->NoFilesUploaded);
	
	//Output some JSON
	$finalOutput=array(
		"songs"		=>	$validFiles,
		"type"		=>	$convertType,
		"errors"	=>	$errors//,
		//"debug"	=> $test
	);
	//PHP 5.2.x or lower
	echo json_encode((object)$finalOutput);
	//PHP 5.3 or higher
	//echo json_encode($finalOutput,JSON_FORCE_OBJECT);
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
?>