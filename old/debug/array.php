<?php

//==================
//1 - INITIALIZE
//==================
require_once("../lib/includes/Functions.php");
$pp = new ProPresenter();
$ssp = new SongShowPlus();
$exp = new Export();
$title = "title";
$output = "";


//==================
//2 - SETUP
//==================
//$type = $pp->fileExt;
$dir="_songs/";

$song="Be Near FORMATTED.pro4";


//==================
//3 - PARSE
//==================
if($type == "directory"){
	echo $exp->DirectoryLoop($dir,"pro4");
}else{
	$fileContents=file_get_contents($dir.$song);

	//Do the following for SSP files only
	if(strpos($song, $ssp->fileExt)){
		$title = str_replace(".".$ssp->fileExt, "", $song);

		if($type == $pp->fileExt){
			$output = $pp->OutputProPresenter($fileContents, $song);
		}else if($type == "txt"){
			$output = $exp->OutputText($fileContents, $song);
		}else if($type == "html"){
			$output = $exp->OutputHtml($fileContents, $song);
		}else{ //array
			$output = $ssp->Parse($fileContents, $song);
		}
	}else{ //array
		$title = str_replace( ".".$pp->fileExt, "", $song);
		$output = $pp->Parse($fileContents, $song);
	}
}

//==================
//4 - OUTPUT
//==================
if($output){
	if($title) echo "<h2>".$title."</h2>";
	echo "<pre>";
	print_r($output); 
	echo "</pre>";
}
?>