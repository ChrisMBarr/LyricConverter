<?php
class SongShowPlus{
	public $fileExt = "sbsong";
	public $fileExtTxt = "txt";
	
	public function Parse($input,$filename=""){
		$noProperties=explode("<Properties>",$input);
		//split up the song file sections
		$sections = explode("%",$noProperties[0]);
		//establish an empty song array
		$songArr=array(
			"info" => array(),
			"lyrics" => array(),
			"keywords"=>array(),
			"parseStatus" => 'success'
		);
		
		//get some regexes
		$regex = new RegexLibrary();
		
		//get the song info
		$this->_getSongInfo($sections[0],$songArr,$regex);
		
		//Get the lyrics and keywords
		$this->_getSongContents($sections,$songArr,$regex);

		//if the song title is empty, just use the file name here
		if(empty($songArr['info']['Title'])) $songArr['info']['Title']=str_replace(".".$this->fileExt,"",$filename);

		return $songArr;
	}
	
	//Return the info about the song: Title, Artist, Author, Copyright, Year, and CCLI number
	private function _getSongInfo($input,&$output,&$regex){
		//remove line breaks
		$removeLineBreaks=str_replace("\n","",str_replace("\r","",$input));

		$r_i = $regex->invisibles;
		$r_t = $regex->stdTextRegex;
		//the complex regex pattern o_0
		
		//$p_begin="(?:(.{9,10}(?:0707)?(?:[".$r_i."]){9,10})?)";
		
		$p_begin="(&?(([".$r_i."]){0,10}([0-9]){0,4}([".$r_i."]){0,10})?)";

		$p_title="(?P<title>(?:[".$r_t."])*)[".$r_i."]";
		$p_artist="(?P<artist>(?:[".$r_t."])*)";
		$p_author="(\|\s(?P<author>(?:[".$r_t."\|])*))?[".$r_i."]{10}";
		$p_copyright="(?P<copyright>(?:[".$r_t."])*).{20}";
		$p_ccli="(?P<ccli>(?:[0-9])*)";
		$pattern="/".$p_begin.$p_title."{9,10}".$p_artist.$p_author.$p_copyright.$p_ccli."/";
		//perform the search
		preg_match($pattern,$removeLineBreaks,$matches);
		
		
		//Some files are dumb, so we have to re-parse in a different way
		if($matches["artist"]="0707"){
			$matches["artist"]="";
			//split into an array on all the invisible characters
			$temp=preg_split("/[".$r_i."]+/",$removeLineBreaks,0, PREG_SPLIT_NO_EMPTY);
			
			$validCount=0;
			for($i=0;$i<sizeof($temp);$i++){
				$me = $temp[$i];
				if(strlen($me)>1 && $me!="0707"){
					$validCount++;
					if($validCount==1){
						$matches["title"]=$me;
					}else if(stristr($me,"copyright") || stristr($me,"©")){
						$matches["copyright"]=trim($me);
					}elseif(is_numeric(trim($me))){
						$matches["ccli"]=trim($me);
					}
				}
			}
		}
		
		//search the copyright info for the year
		if(!empty($matches['copyright'])){
			preg_match("/[0-9]{4}([\-\s][0-9]{4})?/",$matches['copyright'],$year);
			if(sizeof($year)<1)$year[0]="";
			$copyrightWithoutYear = trim(str_replace($year[0],"",$matches['copyright']));
		}
		
		//return an array with only the relevant information
		
		if(!empty($matches['title'])) 		$output["info"]["Title"]=		$regex->cleanCharacters($matches['title']);
		if(!empty($matches['artist'])) 		$output["info"]["Artist"]=		$regex->cleanCharacters($matches['artist']);
		if(!empty($matches['author'])) 		$output["info"]["Author"]=		$regex->cleanCharacters($matches['author']);
		if(!empty($matches['copyright'])) 	$output["info"]["Copyright"]=	$regex->cleanCharacters($copyrightWithoutYear);
		if(!empty($year[0])) 				$output["info"]["Year"]=		$regex->cleanCharacters($year[0]);
		if(!empty($matches['ccli'])) 		$output["info"]["CCLI"]=		$regex->cleanCharacters($matches['ccli']);
		
		//Some of these end with $ signs, so lets remove them
		foreach($output["info"] as $infoTitle => $infoData){
			$output["info"][$infoTitle] = rtrim($infoData,"$");
		}
		
		//$output["info"]=$matches;
	}
	
	//Return the Lyrics and keywords
	private function _getSongContents($input,&$output,&$regex){
		//unique string to replace line breaks with
		$lb = "{~LINEBREAK~}";
		//empty array to store lyrics in
		$lyrics=array();
		
		$r_i = $regex->invisibles;
		$r_t = $regex->stdTextRegex;
			
		//loop through and get each song section (skip the first item becasue that's the song info)
		for($i=1;$i<sizeof($input);$i++){
			$removeLineBreaks = str_replace("\n",$lb,str_replace("\r","\n",$input[$i]));
			
			preg_match("/([".$r_i."])+(.){1}([".$r_i."])+(?P<sectionName>([".$r_t."])+)([".$r_i."]){1}([^".$r_i."]){1}(?P<song>(.)*)/mi",$removeLineBreaks,$matches);
			
			//converts double line breaks into single line breaks
			if(!empty($matches["song"])){
				$normalizedSong = trim(str_replace("\n\n","\n",str_replace($lb,"\n",$matches["song"])));
				//Add it to the array of lyrics if it's not empty - remove any } characters so it doesn't pre-maturely end the RTF file!
				if(!empty($normalizedSong)){
					$lyrics[$i]["title"]=trim(ucfirst(str_replace($lb,"",$matches["sectionName"])));
					$lyrics[$i]["words"]=str_replace("}","",$normalizedSong);
				}
			}
		}
		$keywords=array();
		//get the last section
		$rawKeywords = end($lyrics);
		//grab the keywords out of this section if there are any
		//All keywords seem to begin with at last 4 invisible characters
		$findKeywords=preg_split("/[".$r_i."]+/",$rawKeywords["words"]);
		//add the keywords to the song
		//skip the first keyword item because it is the actual lyrics of this section
		for($k=1;$k<sizeof($findKeywords);$k++){
			$word=trim(str_replace("\t","",str_replace("\n","",$findKeywords[$k])));
			if(stristr($word,"<Prop")) break;
			$word = $regex->englishOnly($word);
			if(!empty($word) && strlen($word)>1) $keywords[$k-1] = $word;
			
		}
		
		//remove the <Properties> XML nodes if they exist
		$lastKeyword = end($keywords);
		if(strpos($lastKeyword["words"],"<Prop")>0){
			//remove the last keyword
			array_pop($keywords);
			//split the string up at the XML nodea
			$removeProps = explode("<Propert",$lastKeyword);
			//take the first part of that array and split it up on the invisible character dividers
			$removeOddChars = preg_split("/[".$r_i."]+/",$removeProps[0]);
			//add the first part of this array (containing only the keyword) back into the keywords array
			array_push($keywords,($removeOddChars[0]));
		}
		
		$lastArrKey = end(array_keys($lyrics));
		//last section contained lyrics AND keywords.  Remove it...
		array_pop($lyrics);
		//add only the lyrics back in, which is actually the first part of the keywords array
		$lyrics[$lastArrKey]["title"]=$rawKeywords["title"];
		$lyrics[$lastArrKey]["words"] = trim($findKeywords[0]);
		
		//pass the song lyrics back out
		$output["lyrics"]=$lyrics;
		$output["keywords"]=$keywords;

		//some songs are't divided correctly, just dump all the lyrics into a single item since we can't tell anything apart
		if(count($output['lyrics'])==1 && empty($output['lyrics'][0]["words"]) ){
			$output['parseStatus'] = 'parse error';
			$msg= new Messages();
			//remove the first array item since it's blank
			array_pop($output['lyrics']);
			//add an array item that explains what happened to this song
			$output['lyrics'][0]["title"]='Conversion Error!';
			$output['lyrics'][0]["words"]=$msg->StranglyFormatted;
			//dump the song file contents into an item - remove any } characters so it doesn't pre-maturely end the RTF file!
			$output['lyrics'][1]["title"]='All Song Lyrics';
			$output['lyrics'][1]["words"]=str_replace("}","",$regex->cleanCharacters($input[0]));
		}

		//print_r($output);
	}
}
?>