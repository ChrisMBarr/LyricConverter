<?
class Export{
	//Returns the nice looking HTML of the song info
	public function OutputText($input,$filename=""){
		$ssp = new SongShowPlus();
		$song = $ssp->Parse($input,$filename);
		$output="";
		
		//Song Info
		foreach($song["info"] as $itemName => $itemData){
			if(!empty($itemData)) $output.= $itemName.": ".$itemData."\n";
		}
		
		//Keywords
		$totalKeys=sizeof($song["keywords"]);
		if($totalKeys>0){
			$k=0;
			$output.="Keywords: ";
			foreach($song["keywords"] as $itemName => $itemData){
				$k++;
				$output.= $itemData;
				if($k<$totalKeys)$output.=", ";
			}
		}
			
		$output.="\n\n\n";
		
		//Lyrics
		foreach($song["lyrics"] as $section){
			$output.= $section["title"]."\n".$section["words"]."\n\n";
		}

		return $output;
	}
	
	//Returns the nice looking HTML of the song info
	public function OutputHtml($input,$filename=""){
		$ssp = new SongShowPlus();
		$song = $ssp->Parse($input,$filename);
		$output="";
		
		//Song Info
		foreach($song["info"] as $itemName => $itemData){
			if(!empty($itemData)) $output.= "<strong>".$itemName.":</strong> ".$itemData."\n<br />\n";
		}
		
		//Keywords
		$totalKeys=sizeof($song["keywords"]);
		if($totalKeys>0){
			$k=0;
			$output.="<strong>Keywords:</strong> ";
			foreach($song["keywords"] as $itemName => $itemData){
				$k++;
				$output.= $itemData;
				if($k<$totalKeys)$output.=", ";
			}
		}
		$output.="<br />\n<br />\n";
		
		//Lyrics
		foreach($song["lyrics"] as $section){
			$output.= "<strong>".$section["title"].":</strong>\n<br />\n".str_replace("\n","<br />\n",$section["words"])."\n<br />\n<br />\n";
		}

		return $output;
	}
	
	//Loop through all the song files in the given directory
	public function DirectoryLoop($path,$mode="text"){
		$ssp = new SongShowPlus();
		$pp = new ProPresenter();
		if ($songsDir = opendir($path)) {

			//Only create directories when actually outputting files!
			if($mode=="pro4"){
				//Try to make an output directory if it doesn't already exist
				$outputPath = $path."_converted";
				if(! $outputDir = @opendir($outputPath)) mkdir($outputPath , 0777);
				if($outputDir) closedir($outputDir);

				$errorPath = $path."_conversionErrors";
				if(! $errorDir = @opendir($errorPath)) mkdir($errorPath , 0777);
				if($errorDir) closedir($errorDir);
			}

			while (false !== ($file = readdir($songsDir))) {
				if ($file != "." && $file != ".." && $file != ".DS_Store" && $file != "Thumbs.db"&& $file != "_converted" && $file != "_conversionErrors") {
					$content=file_get_contents($path."/".$file);
					if($mode=="array"){
						echo "<h3>".$file."</h3>";
						echo "<pre>";
						print_r($ssp->Parse($content,$file));
						echo "</pre>";
					}elseif($mode=="html"){
						echo "<h3>".$file."</h3>";
						echo $this->OutputHtml($content,$file);
					}elseif($mode=="pro4"){
						$hasError;
						$converted = $pp->OutputProPresenter($content, $file, $hasError);
						
						$newFileName = str_replace($ssp->fileExt, $pp->fileExt, $file);

						if($hasError){
							echo "<span style='color:red;'>ERROR! <strong>".$file."</strong> was not converted!</span>";

							$f = fopen($errorPath ."/".$newFileName, "w+") or die("can't open file!"); 
							fwrite($f, $converted); 
							fclose ($f);
						}else{
							echo "<strong style='color:green;'>".$file."</strong> converted to ".$newFileName;

							//Create the file
							$f = fopen($outputPath ."/".$newFileName, "w+") or die("can't open file!"); 
							fwrite($f, $converted); 
							fclose ($f);	
						}

					}else{
						echo "<h3>".$file."</h3>";
						echo "<pre>".$this->OutputText($content,$file)."</pre>";
					}
					echo "<hr />";
				}
			}
			closedir($songsDir);
		}
	}

	public $uploadDirectory="./file_uploads/";
	public $outputDirectory="./file_output/";
	
	public function Download($filePath,$newFileName){
		// required for IE, otherwise Content-disposition is ignored
		if(ini_get('zlib.output_compression')) ini_set('zlib.output_compression', 'Off');

		header("Pragma: public"); // required
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: private",false); // required for certain browsers 
		header("Content-Type: application/force-download");
		// change, added quotes to allow spaces in filenames, by Rajkumar Singh
		header("Content-Disposition: attachment; filename=\"".basename($newFileName)."\";" );
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: ".$this->strBytes(file_get_contents($filePath)));
		//output the file
		readfile($filePath);
		exit();
	}
	
	private function strBytes($str){
		/**
		* Count the number of bytes of a given string.
		* Input string is expected to be ASCII or UTF-8 encoded.
		* Warning: the function doesn't return the number of chars
		* in the string, but the number of bytes.
		* See http://www.cl.cam.ac.uk/~mgk25/unicode.html#utf-8
		* for information on UTF-8.
		*
		* @param string $str The string to compute number of bytes
		*
		* @return The length in bytes of the given string.
		*/

		// STRINGS ARE EXPECTED TO BE IN ASCII OR UTF-8 FORMAT

		// Number of characters in string
		$strlen_var = strlen($str);

		// string bytes counter
		$d = 0;

		/*
		* Iterate over every character in the string,
		* escaping with a slash or encoding to UTF-8 where necessary
		*/
		
		for($c = 0; $c < $strlen_var; ++$c){
			$ord_var_c = ord($str{$c});
			switch(true){
				case(($ord_var_c >= 0x20) && ($ord_var_c <= 0x7F)):
					// characters U-00000000 - U-0000007F (same as ASCII)
					$d++;
					break;
				case(($ord_var_c & 0xE0) == 0xC0):
					// characters U-00000080 - U-000007FF, mask 110XXXXX
					$d+=2;
					break;
				case(($ord_var_c & 0xF0) == 0xE0):
					// characters U-00000800 - U-0000FFFF, mask 1110XXXX
					$d+=3;
					break;
				case(($ord_var_c & 0xF8) == 0xF0):
					// characters U-00010000 - U-001FFFFF, mask 11110XXX
					$d+=4;
					break;
				case(($ord_var_c & 0xFC) == 0xF8):
					// characters U-00200000 - U-03FFFFFF, mask 111110XX
					$d+=5;
					break;
				case(($ord_var_c & 0xFE) == 0xFC):
					// characters U-04000000 - U-7FFFFFFF, mask 1111110X
					$d+=6;
					break;
				default:
					$d++;
			};
		};
		return $d;
	}
}
?>