<?php
class ProPresenter{
	public $fileExt = "pro4";

	public function Parse($input,$filename=""){

		require("rtf.php");
		
		$xml = simplexml_load_string($input); 
		$slides = $xml -> slides -> RVDisplaySlide;

		//pull out the text from each slide
		$finalArray= array();
		foreach ($slides as $thisSlide) {
			$encodedRtfData = current($thisSlide -> displayElements -> RVTextElement['RTFData']);
			$decodedRtfData = base64_decode($encodedRtfData);

			//$decodedRtfData = str_replace('\n', 'LINEBREAK', $decodedRtfData);

			//$slideText = $decodedRtfData;
			$slideText = @rtf2text($decodedRtfData);


			// $r = new rtf( $decodedRtfData);
			// $r->output( "html");
			// @$r->parse();
			// if( count( $r->err) == 0) // no errors detected
			// $slideText = $r->out;

			array_push($finalArray, $slideText);
		}

		return $finalArray;
	}
	
	public function OutputProPresenter($input,$filename="", &$hasError = false){
		$ssp = new SongShowPlus();
		$song = $ssp->Parse($input,$filename);

		$hasError = $song['parseStatus'] == "parse error";
		
		$FinalOutput="";
		
		//Get the text or output an empty string
		//Remove all quotes from text so it doesn't mess up the XML formatting
		$author = (array_key_exists('Author',$song['info']))? 			str_replace('"','',$song['info']['Author']):"";
		$artist = (array_key_exists('Artist',$song['info']))? 			str_replace('"','',$song['info']['Artist']):"";
		$copyright = (array_key_exists('Copyright', $song['info']))?	str_replace('"','',$song['info']['Copyright']):"";
		$year = (array_key_exists('Year',$song['info']))? 				str_replace('"','',$song['info']['Year']):"";
		$ccli = (array_key_exists('CCLI',$song['info']))? 				str_replace('"','',$song['info']['CCLI']):"";
		$title = (array_key_exists('Title',$song['info']))? 			str_replace('"','',$song['info']['Title']):"";
		$keywords = (array_key_exists('keywords',$song))? 				str_replace('"','',implode(", ",$song['keywords'])) :"";
		
		
		$PPBegin='<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0" creatorCode="1349676880" lastDateUsed="'.Date("Y-m-d")."T".Date("G:i:s").'" usedCount="0" category="Song" resourcesDirectory="" backgroundColor="0 0 0 1" drawingBackgroundColor="0" notes="'.$keywords.'" artist="'.$artist.'" author="'.$author.'" album="" CCLIDisplay="0" CCLIArtistCredits="" CCLISongTitle="'.$title.'" CCLIPublisher="'.$copyright.'" CCLICopyrightInfo="'.$year.'" CCLILicenseNumber="'.$ccli.'"><slides containerClass="NSMutableArray">';
		
		$PPEnd='</slides><timeline timeOffSet="0" selectedMediaTrackIndex="0" unitOfMeasure="60" duration="0" loop="0"><timeCues containerClass="NSMutableArray"></timeCues><mediaTracks containerClass="NSMutableArray"></mediaTracks></timeline><bibleReference containerClass="NSMutableDictionary"></bibleReference></RVPresentationDocument>';
		
		
		//insert the beginning XML
		$FinalOutput.=$PPBegin;
		
		$i=0;
		
		//Insert a beginning blank slide
		$FinalOutput.=$this->_makeBlankSlide($i);
		
		//Go through each song part and add a slide for it
		foreach($song["lyrics"] as $slide){
			$i++;
			$FinalOutput.=$this->_makeSlide($i,$slide["title"],$slide["words"]);
		}
		
		//Insert a ending blank slide
		$FinalOutput.=$this->_makeBlankSlide($i+1);
		
		//insert the ending XML
		$FinalOutput.=$PPEnd;
		
		return $FinalOutput;
	}
	
	private function _generateUniqueID(){
		//Native PP ID Example: 26AAF905-8F45-4252-BFAB-4C10CCFE1476
		//This will produce something like: 14d9bd2fec55ff
		return uniqid(true);
	}
	
	private function _makeBlankSlide($order){
		return '<RVDisplaySlide backgroundColor="0 0 0 0" enabled="1" highlightColor="0 0 0 0" hotKey="" label="" notes="" slideType="1" sort_index="'.$order.'" UUID="'.$this->_generateUniqueID().'" drawingBackgroundColor="0" serialization-array-index="'.$order.'"><cues containerClass="NSMutableArray"></cues><displayElements containerClass="NSMutableArray"></displayElements></RVDisplaySlide>';
	}
	
	private function _makeSlide($order, $label, $text){
		//Returns white Helvetica text in RTF format and then Base64 encoded
		$FakeRTF="{\\rtf1\ansi\ansicpg1252\cocoartf1038\cocoasubrtf320
{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}
{\\colortbl;\\red255\\green255\blue255;}
\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\qc\pardirnatural

\\f0\\fs96 \cf1 ".str_replace("\n","\\\n",$text)."}";


		$slideXML = '<RVDisplaySlide backgroundColor="0 0 0 0" enabled="1" highlightColor="0 0 0 0" hotKey="" label="'.$label.'" notes="" slideType="1" sort_index="'.$order.'" UUID="'.$this->_generateUniqueID().'" drawingBackgroundColor="0" serialization-array-index="'.$order.'">
		<cues containerClass="NSMutableArray"></cues>
		<displayElements containerClass="NSMutableArray">
			<RVTextElement displayDelay="0" displayName="Default" locked="0" persistent="0" typeID="0" fromTemplate="0" bezelRadius="0" drawingFill="0" drawingShadow="0" drawingStroke="0" fillColor="1 1 1 1" rotation="0" source="" adjustsHeightToFit="0" verticalAlignment="0" RTFData="'.base64_encode($FakeRTF).'" serialization-array-index="0">
				<_-RVRect3D-_position x="20" y="20" z="0" width="984" height="728"></_-RVRect3D-_position>
				<_-D-_serializedShadow containerClass="NSMutableDictionary">
					<NSCFNumber serialization-native-value="5" serialization-dictionary-key="shadowBlurRadius"></NSCFNumber>
					<NSCalibratedRGBColor serialization-native-value="0 0 0 0.5" serialization-dictionary-key="shadowColor"></NSCalibratedRGBColor>
					<NSCFString serialization-native-value="{3.53553, -3.53553}" serialization-dictionary-key="shadowOffset"></NSCFString>
				</_-D-_serializedShadow>
				<stroke containerClass="NSMutableDictionary">
					<NSCachedRGBColor serialization-native-value="0 0 0 1" serialization-dictionary-key="RVShapeElementStrokeColorKey"></NSCachedRGBColor>
					<NSCFNumber serialization-native-value="1" serialization-dictionary-key="RVShapeElementStrokeWidthKey"></NSCFNumber>
				</stroke>
			</RVTextElement>
		</displayElements>
	</RVDisplaySlide>';
	
		//Nicelyformatted - for debugging!
		//return $slideXML;
		
		//return the XML without line breaks or tabs
		return str_replace("\n","",str_replace("\t","",$slideXML));
	}
	
}
?>