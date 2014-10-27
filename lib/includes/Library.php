<?
class RegexLibrary{
	//basic pattern for most text
	public $stdTextRegex="\w\s,\.\(\)\-_=+\"':;!@#$%^&*{}\[\]\\|<>\/?`~";
	//invisible characters (non-printing)
	public $invisibles='\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F';
	//public $invisibles='[:cntrl:]';

	public function cleanCharacters($input){
		return preg_replace('/['.$this->invisibles.']*/', "", $input);
	}
	
	public function englishOnly($input){
		return preg_replace('/^['.$this->invisibles.']*$/u', "", $input);
	}
}

class Messages{
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error Messages
	public $NoFilesUploaded = "No files were uploaded!";
	public function ErrorUploadingFile($filename=""){
		$msg="";
		if(empty($filename)){
			$msg="There was an error uploading one of the files!";
		}else{
			$msg="There was an error uploading <strong> ".$filename."</strong>!";
		}
		return $msg;
	}
	public function IncorrectFileType($filename,$acceptedExtenstion){
		return 'The file  "'.$filename.'" is not the right file type!';
	}
	public $StranglyFormatted = "There was a problem converting this song!\n\nWhen I tried to convert the original file I couldn't tell the different song parts apart. The next slide has all the lyrics I could find in the song, and you'll have to sort them out yourself.\n\nSorry about that!   (I feel terrible...really)\n\n:(";
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
?>