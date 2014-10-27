<?php
	require_once('includes/Export.php');
	
	$exp=new Export();
	$dir=$exp->outputDirectory;
	
	$ageLimit=3600; //1 hour in seconds
	
	//Loop though the directory and remove an file older than the limit
	if ($songsDir = opendir($dir)) {
		$now =explode(".",microtime(true));
		while (false !== ($file = readdir($songsDir))) {
			if ($file != "." && $file != ".." && $file != ".DS_Store" && $file != "Thumbs.db"){
				$fileTime = explode(".",$file);
				if(is_numeric($fileTime[0])){
					$timeDiff =  $now[0] - $fileTime[0];
					if($timeDiff > $ageLimit){
						unlink($dir.$file);
						//echo $dir.$file."<br />";
					}
				}
			}
		}
		closedir($songsDir);
	}
?>