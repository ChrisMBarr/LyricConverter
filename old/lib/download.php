<?php
	require('includes/Functions.php');
	$exp = new Export();
	$ssp = new SongShowPlus();
	$pp = new ProPresenter();

	$type=$_GET['t'];
	$extention=$ssp->fileExtTxt;
	if($type==$pp->fileExt){
		$extention = $pp->fileExt;
	}
	$newFileName=stripslashes($_GET['n']).".".$extention;
	$filePath = $exp->outputDirectory.$_GET['f'];
	$exp->Download($filePath,$newFileName);
?>