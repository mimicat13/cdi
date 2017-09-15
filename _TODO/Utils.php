<?php

/*
	'modules\database\classes\kohana\database\query\builder\where.php'
	->where_arr($column, $op, $arr)
		
	ORM::factory('Modelname')
		->where('xxx', '=', xxx)
		->where_arr('yyy', '=', array(aaa, bbb, ccc))
		->find_all();
*/

class Helper_Utils {
	
	private static $repl_src		= array(" ", "ā","č","ē","ģ","ī","ķ","ļ","ņ","š","ū","ž","õ","ä","Ö","ü","Ą","Ę","Ė","Ų", "Ā","Č","Ē","Ģ","Ī","Ķ","Ļ","Ņ","Š","Ū","Ž","Õ","Ä","ö","Ü","ą","ę","ė","ų", 'ё','ж','ц','ч','ш','щ','ю','я','Ё','Ж','Ц','Ч','Ш','Щ','Ю','Я','А','Б','В','Г','Д','Е','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ъ','Ы','Ь','Э','а','б','в','г','д','е','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ъ','ы','ь','э', "\\", "/", "@", "#", "$", "%", "!", "~", "`", "&", "^", "*", "(", ")", "+", "=", ":", ";", "|", "\"", ",");
	private static $repl_dst		= array("-", "a","c","e","g","i","k","l","n","s","u","z","o","a","o","u","a","e","e","u", "a","c","e","g","i","k","l","n","s","u","z","o","a","o","u","a","e","e","u", 'yo','zh','tc','ch','sh','sh','yu','ya','YO','ZH','TC','CH','SH','SH','YU','YA','A','B','V','G','D','E','Z','I','J','K','L','M','N','O','P','R','S','T','U','F','H','_','I','_','E','a','b','v','g','d','e','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','','i','','e',  '_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_',);
	public static function url_friendly($str){
		$i				= 0;
		foreach(self::$repl_src as $rp){
			$str			= str_replace($rp, self::$repl_dst[$i], $str);
			$i++;
		}
		return $str;
	}	
	
	public static function truncate($text, $chars = 32) {
		if(strlen($text) >  $chars){
			$text		= strip_tags($text)." ";
			$text		= mb_substr($text, 0, $chars);
			$text		= mb_substr($text, 0, mb_strrpos($text,' '));
			$text		= $text."...";
		}
		return $text;
	}
	
	public static function admin_anchor_edit($url){
		return HTML::anchor(
					$url, 
					'<i class="entypo-pencil"></i>Edit Item', 
					array('class' => 'btn btn-default btn-sm btn-icon icon-left' )
			);		
	}
	public static function admin_anchor_delete($url, $reload = false){
		return HTML::anchor(
					$url,
					'<i class="entypo-cancel"></i>Delete', 
					array('data-action' => 'delete', 'data-reload' => $reload == 'reload' ? 'true' : 'false', 'class' => 'btn btn-danger btn-sm btn-icon icon-left' )
			);
	}
	
	public static function admin_status_icon($icon_id){
		
		$labels = array(
			1 => 'Hidden',
			2 => 'Draft',
			3 => 'Active'
		);
		
		$icons = array(
			1 => 'default',
			2 => 'primary',
			3 => 'success'
		);
		return '<div style="margin-left:0;" class="label label-'.$icons[$icon_id].'">'.$labels[$icon_id].'</div>';
	}
	
	public static function admin_custom_anchor($url, $text, $add_class = '', $ico = 'entypo-link'){
		return '<a href="'.$url.'" target="_self" class="btn btn-default btn-sm btn-icon icon-left '.$add_class.'" >'.$text.'<i class="'.$ico.'"></i></a>';
	}
	
	//public static function admin_custom_button($url, $text, $add_class = '', $ico = 'entypo-link'){
	//	return '<div href="'.$url.'" target="_self" class="btn btn-default btn-sm btn-icon icon-left '.$add_class.'" >'.$text.'<i class="'.$ico.'"></i></div>';
	//}
	
	public static function admin_custom_button($text, $add_class = '', $ico = 'entypo-link', $data = ''){
		return '<div '.$data.' target="_self" class="btn btn-default btn-sm btn-icon icon-left '.$add_class.'" >'.$text.'<i class="'.$ico.'"></i></div>';
	}
	
	public static function is_number($var){
		if ($var == (string) (float) $var) {
			return (bool) is_numeric($var);
		}
		if ($var >= 0 && is_string($var) && !is_float($var)) {
			return (bool) ctype_digit($var);
		}
		return (bool) is_numeric($var);
	}

	public static function format_mailto($str){
		return eregi_replace('([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})','<a href="mailto:\\1">\\1</a>', $str);
	}
	
	public static function force_download($file){
		$file_name			= $file;
		$mime				= 'application/force-download';
		header('Pragma: public'); 	// required
		header('Expires: 0');		// no cache
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Cache-Control: private',false);
		header('Content-Type: '.$mime);
		header('Content-Disposition: attachment; filename="'.basename($file_name).'"');
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: ' . filesize($file_name));
		header('Connection: close');
		readfile($file_name);		// push it out
		exit();
	}
	
	public static function save_to_csv($aDATA, $name = 'download'){
		/* aDATA STRUC:
			$aDATA = array(
					'Title 0' => array('dat0', 'dat2', 'dat1'),
					'Title 1' => array('dat0', 'dat2', 'dat1'),
					'Title 2' => array('dat0', 'dat2', 'dat1')
				);
		*/
		//ini_set("display_errors",		0);
		error_reporting(E_ERROR | E_WARNING /* | E_PARSE*/);
		//error_reporting(E_ALL);
		
		ini_set("auto_detect_line_endings", true);
		
		$data				= array();
		$data[0]			= array();
		$data[1]			= array();
		foreach($aDATA as $key => $value){
			array_push($data[0], $key);
			array_push($data[1], '');
			
			$i			= 2;
			foreach($value as $val){
				if(!$data[$i]){
					$data[$i] = array();
				}
				array_push($data[$i], $val);
				$i++;
			}
		}
		
		$delimiter			= ';';
		header('Content-Encoding: UTF-8');
		header('Content-Type: text/csv;charset=UTF-8');
		header('Content-Disposition: attachment; filename='.$name.'.csv');
		header('Pragma: no-cache');
		header("Expires: 0");
		echo "\xEF\xBB\xBF"; // UTF-8 BOM
		$outstream			= fopen("php://output", "w");
		foreach($data as $result){
		    fputcsv($outstream, $result, $delimiter);
		}
		fclose($outstream);		
	}
	
	public static function send_mail($email, $html, $subject = '', $from = '', $to = '' ){
		try {
			$mail			= new PHPMailer;
			$mail->CharSet		= 'UTF-8';
			$mail->Subject		= $subject;
			//$mail->IsQmail();
			$mail->isSendmail();
			$mail->MsgHTML($html);
			$mail->AddAddress($email);

			$mail->SetFrom(	$from );
			$mail->AddReplyTo( $to );

			if(!$mail->Send()){
				echo  'email:error: '. $mail->ErrorInfo;
			} else {
				return 'email:ok';
			}
		} catch(PDOException $e) {
			return 'email:exception:'.$e;
		}	
	}
	
	function unique_multidim_array($array, $key) {
		$temp_array	= array();
		$i		= 0;
		$key_array	= array();
		foreach($array as $val) {
			if (!in_array($val[$key], $key_array)) {
				$key_array[$i]	= $val[$key];
				$temp_array[$i]	= $val;
			}
			$i++;
		}
		return $temp_array;
	} 		
	
	public static function dir_list($dir, $with_files = false) {
		$contents			= array();
		foreach (scandir($dir) as $node) {
			# Skip link to current and parent folder
			if ($node == '.')  continue;
			if ($node == '..') continue;
			# Check if it's a node or a folder
			if (is_dir($dir . DIRECTORY_SEPARATOR . $node)) {
				# Add directory recursively, be sure to pass a valid path
				# to the function, not just the folder's name
				$contents[$node] = self::dir_list($dir . DIRECTORY_SEPARATOR . $node, $with_files);
			} else {
				# Add node, the keys will be updated automatically
				if($with_files){
					$contents[] = $node;
				}
			}
		}
		return $contents;
	}	
	
	public static function dir_content($sz_root = '', $b_dirs = false){
		$aRET				= array();
		foreach (scandir(DOCROOT.$sz_root) as $node) {
			# Skip link to current and parent folder
			if ($node == '.')  continue;
			if ($node == '..') continue;
			# Check if it's a node or a folder
			if (!$b_dirs) {
				if(!is_dir(DOCROOT.$sz_root . DIRECTORY_SEPARATOR . $node)){
					array_push($aRET, basename($node));
				}
			} else {
				if(is_dir(DOCROOT.$sz_root . DIRECTORY_SEPARATOR . $node)){
					array_push($aRET, basename($node));
				}
			}
		}
		return $aRET;
	}
	
	public static function admin_filemanager_opener($input_id, $value='', $text = "Open", $label = "External File"){
		$url				= APP_URL_BASE."assets/cms/js/filemanager/dialog.php?type=2&amp;field_id=".$input_id."&amp;relative_url=1";
		
		$szHTML				=  '<label for="dl_file" class="control-label col-sm-2">'.$label.'</label>';
		$szHTML				.= '<div class="col-sm-5">' ;
		$szHTML				.=	'<input id="'.$input_id.'" value="'.$value.'" type="text" name="'.$input_id.'" class="form-control">' ;
		$szHTML				.=	'<a href="'.$url.'" class="btn iframe-btn btn-default btn-sm btn-icon icon-left '.$input_id.'" style="margin-top:5px;" >'.$text.'<i class="entypo-link"></i></a>';
		$szHTML				.= '</div>' ;
		
		$szHTML				.= '<script>';
		$szHTML				.=	'$(document).ready(function(){' ;
		$szHTML				.=		'$(".'.$input_id.'").fancybox({';
		$szHTML				.=			'"width"	: 800,' ;
		$szHTML				.=			'"height"	: 600,' ;
		$szHTML				.=			'"type"		: "iframe",' ;
		$szHTML				.=			'"autoScale"	: false' ;
		$szHTML				.=		'});';
		$szHTML				.=	'});';	
		
		$szHTML				.=	'function responsive_filemanager_callback(field_id){';
		$szHTML				.=		'var url=$("#"+field_id).val();';
		$szHTML				.=		'parent.$.fancybox.close();';
		$szHTML				.=	'};';
		
		$szHTML				.= '</script>';
		
		echo $szHTML;
	}
	
/*
	$nodeList			= new DOMDocument();
	$nodeList->loadHTML((mb_convert_encoding($this->section->textdoc->content, 'HTML-ENTITIES', 'UTF-8')));
	$body				= $nodeList->getElementsByTagName( 'body' )->item( 0 );
	foreach( $body->childNodes as $child ){
		$val			= '';
		if($child->hasChildNodes()){
			$val		= Helper_Utils::DOMDocument_innerHTML($child);
		} else {
			$val		= $child->textContent;
		}
		if($child->nodeName != '#text'){
			array_push(
					$paragraphs,
					array(
						'DOM' => $child->nodeName,
						'VAL' => $val
					)
				);
		}
	}
	 */
	public static function DOMDocument_innerHTML( $contentdiv ) {
		$r					= '';
		$elements				= $contentdiv->childNodes;
		foreach( $elements as $element ) { 
			if ( $element->nodeType == XML_TEXT_NODE ) {
				$text			= $element->nodeValue;
				// IIRC the next line was for working around a
				// WordPress bug
				//$text = str_replace( '<', '&lt;', $text );
				$r			.= $text;
			}	 
			// FIXME we should return comments as well
			elseif ( $element->nodeType == XML_COMMENT_NODE ) {
				$r			.= '';
			} else {
				$r			.= '<';
				$r			.= $element->nodeName;
				if ( $element->hasAttributes() ) { 
					$attributes	= $element->attributes;
					foreach ( $attributes as $attribute )
						$r	.= " {$attribute->nodeName}='{$attribute->nodeValue}'" ;
				}	 
				$r			.= '>';
				$r			.= self::DOMDocument_innerHTML( $element );
				$r			.= "</{$element->nodeName}>";
			}	 
		}	 
		return $r;
	}
	
	public static function is_ajax(){
		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			return true;
		}
		return false;
	}

	public static function formatSizeUnits($bytes){
		if ($bytes >= 1073741824){
		    $bytes = number_format($bytes / 1073741824, 2) . ' GB';
		}elseif ($bytes >= 1048576){
		    $bytes = number_format($bytes / 1048576, 2) . ' MB';
		}elseif ($bytes >= 1024){
		    $bytes = number_format($bytes / 1024, 2) . ' KB';
		}elseif ($bytes > 1){
		    $bytes = $bytes . ' bytes';
		}elseif ($bytes == 1){
		    $bytes = $bytes . ' byte';
		}else{
		    $bytes = '0 bytes';
		}
		return $bytes;
	}	
	
	public static function add_css($name){
		if(file_exists(DOCROOT.$name.'.css')){
			echo '<link href="'.APP_URL_BASE.$name.'.css?t='.filemtime(DOCROOT.$name.'.css').'" type="text/css" rel="stylesheet" />'.PHP_EOL;
		}
	}
	
	public static function add_js($name){
		if(file_exists(DOCROOT.$name.'.js')){
			echo '<script src="'.APP_URL_BASE.$name.'.js?t='.filemtime(DOCROOT.$name.'.js').'" type="text/javascript"></script>'.PHP_EOL;
		}
	}
	
	public static function add_css_fix(){
		// fix_lv
		if(file_exists(DOCROOT.'assets/css/fix/fix_'.APP_LANG.'.css')){
			echo '<link href="'.APP_URL_BASE.'assets/css/fix/fix_'.APP_LANG.'.css?t='.filemtime(DOCROOT.'assets/css/fix/fix_'.APP_LANG.'.css').'" type="text/css" rel="stylesheet" />'.PHP_EOL;
		}
		
		//fix_tablet
		if(file_exists(DOCROOT.'assets/css/fix/fix_'.APP_DEVICE.'.css')){
			echo '<link href="'.APP_URL_BASE.'assets/css/fix/fix_'.APP_DEVICE.'.css?t='.filemtime(DOCROOT.'assets/css/fix/fix_'.APP_DEVICE.'.css').'" type="text/css" rel="stylesheet" />'.PHP_EOL;
		}
		
		//fix_tablet_lv
		if(file_exists(DOCROOT.'assets/css/fix/fix_'.APP_DEVICE.'_'.APP_LANG.'.css')){
			echo '<link href="'.APP_URL_BASE.'assets/css/fix/fix_'.APP_DEVICE.'_'.APP_LANG.'.css?t='.filemtime(DOCROOT.'assets/css/fix/fix_'.APP_DEVICE.'_'.APP_LANG.'.css').'" rel="stylesheet" />'.PHP_EOL;
		}
		
		//fix_firefox
		if(file_exists(DOCROOT.'assets/css/fix/fix_'.APP_BROWSER.'.css')){
			echo '<link href="'.APP_URL_BASE.'assets/css/fix/fix_'.APP_BROWSER.'.css?t='.filemtime(DOCROOT.'assets/css/fix/fix_'.APP_BROWSER.'.css').'" type="text/css" rel="stylesheet" />'.PHP_EOL;
		}
	}		
	
	public static function crawlerDetect(){
		$USER_AGENT		= $_SERVER['HTTP_USER_AGENT'];
		
		$crawlers = array(
			array('Google', 'Google'),
			array('msnbot', 'MSN'),
			array('Rambler', 'Rambler'),
			array('Yahoo', 'Yahoo'),
			array('AbachoBOT', 'AbachoBOT'),
			array('accoona', 'Accoona'),
			array('AcoiRobot', 'AcoiRobot'),
			array('ASPSeek', 'ASPSeek'),
			array('CrocCrawler', 'CrocCrawler'),
			array('Dumbot', 'Dumbot'),
			array('FAST-WebCrawler', 'FAST-WebCrawler'),
			array('GeonaBot', 'GeonaBot'),
			array('Gigabot', 'Gigabot'),
			array('Lycos', 'Lycos spider'),
			array('MSRBOT', 'MSRBOT'),
			array('Scooter', 'Altavista robot'),
			array('AltaVista', 'Altavista robot'),
			array('IDBot', 'ID-Search Bot'),
			array('eStyle', 'eStyle Bot'),
			array('Scrubby', 'Scrubby robot')
			);
 
		foreach ($crawlers as $c){
			if (stristr($USER_AGENT, $c[0])){
				return($c[1]);
			}
		}
 
		return false;		
	}	
	
	private static function encrypt($decrypted, $password, $salt='!kQm*fF3pXe1Kbm%9') {
		// Build a 256-bit $key which is a SHA256 hash of $salt and $password.
		$key				= hash('SHA256', $salt . $password, true);
		// Build $iv and $iv_base64. We use a block size of 128 bits (AES compliant) and CBC mode.
		// (Note: ECB mode is inadequate as IV is not used.)
		srand(); 
		$iv				= mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC), MCRYPT_RAND);
		if (strlen($iv_base64 = rtrim(base64_encode($iv), '=')) != 22) return false;
		// Encrypt $decrypted and an MD5 of $decrypted using $key.
		// MD5 is fine to use here because it's just to verify successful decryption.
		$encrypted			= base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $decrypted . md5($decrypted), MCRYPT_MODE_CBC, $iv));
		// We're done!
		return $iv_base64 . $encrypted;
	}

	private static function decrypt($encrypted, $password, $salt='!kQm*fF3pXe1Kbm%9') {
		// Build a 256-bit $key which is a SHA256 hash of $salt and $password.
		$key				= hash('SHA256', $salt . $password, true);
		// Retrieve $iv which is the first 22 characters plus ==, base64_decoded.
		$iv				= base64_decode(substr($encrypted, 0, 22) . '==');
		// Remove $iv from $encrypted.
		$encrypted			= substr($encrypted, 22);
		// Decrypt the data. rtrim won't corrupt the data because the last 32 characters are the md5 hash;
		// thus any \0 character has to be padding.
		$decrypted			= rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, base64_decode($encrypted), MCRYPT_MODE_CBC, $iv), "\0\4");
		// Retrieve $hash which is the last 32 characters of $decrypted.
		$hash				= substr($decrypted, -32);
		// Remove the last 32 characters from $decrypted.
		$decrypted			= substr($decrypted, 0, -32);
		// Integrity check. If this fails, either the data is corrupted, or the password/salt was incorrect.
		if (md5($decrypted) != $hash) return false;
		// Yay!
		return $decrypted;
	}

	public static function passcrypt($pass, $bEncrypt){
		$inner_pass			= 'mi0MI_CaT-13!bcksTG';

		if($bEncrypt){
			return self::encrypt($pass, $inner_pass);
		} else {
			return self::decrypt($pass, $inner_pass);
		}
	}	
	
	/* $dom_name		- canvas dom ID
	 * $key			- google API key
	 * $aCRDS		- marker coordinates
	 *				0 - lang
	 *				1 - lat
	 *				2 - id
	 * $marker_edit_url	- admin URL to open on marker click (e.g:  'mapplaces/edit/' on click will be used as: 'mapplaces/edit/id')
	 */
	public static function admin_GMAP($dom_name, $key, $aCRDS, $marker_edit_url){
		$config				= Kohana::$config->load('gmap.default');
		$styles				= $config['styles'];
		$zoom				= $config['zoom'];
		$zoom_single			= $config['zoom_single'];
		$scrollzoom			= $config['scrollzoom'] ? 'true':'false';
		$aINITCRD			= array(57.2741475, 24.4156825);
		
		echo '<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='.$key.'&sensor=false&language='.APP_LANG.'"></script>';
		
		echo '<script>';
		echo '$(document).ready(function(){';
		echo	'var image	= "'.APP_URL_BASE.'assets/img/gmap_marker.png";';
		echo	'var styles	= ['.$styles.'];';
		
		echo	'var mapOptions	= {';
		echo			'center: new google.maps.LatLng('.$aINITCRD[0].','.$aINITCRD[1].'),';
		echo			'zoom: '.$zoom.',';
		echo			'disableDefaultUI: true,';
		echo			'mapTypeId: google.maps.MapTypeId.ROADMAP';
		echo	'};';
		
		echo	'var map	= new google.maps.Map(document.getElementById("'.$dom_name.'"),mapOptions);';
		
		echo	'var bounds	= new google.maps.LatLngBounds();';
		
		$iter				= 0;
		foreach($aCRDS as $crd){
			echo 'var myLatLng'.$iter.'		= new google.maps.LatLng('.$crd[0].', '.$crd[1].');';
			echo 'var beachMarker'.$iter.'		= new google.maps.Marker({';
			echo 							'position: myLatLng'.$iter.',';
			echo 							'map: map,';
			echo 							'icon: "'.APP_URL_BASE.'/assets/uploads/mapplaces/thumb/'.$crd[3].'",';
			echo 							'_id: '.$crd[2].',';
			echo 							'});';
			
			if($marker_edit_url){
				echo 'google.maps.event.addListener(beachMarker'.$iter.', "click", function(e){';
				echo 					'window.location.href = "'.$marker_edit_url.'" + beachMarker'.$iter.'._id;';
				echo 				'});';
			}
			
			echo 'bounds.extend(beachMarker'.$iter.'.position);';
			$iter++;
		}
		
		if($config['use']){
			echo 'map.setOptions({styles: styles});';
		}
		
		echo 'map.fitBounds(bounds);';
		
		echo '});';
		echo '</script>';
	}
	/*
	<div style="border: 1px solid #bdbdbd;padding: 10px 10px 28px 10px;">
		<div class="insert-input">
			<div id="map_canvas0" style="background-color: #eee;border: 1px solid #bdbdbd;height: 431px;margin-top: 20px;width: 720px;margin-left: auto;margin-right: auto;overflow: hidden;position: relative;box-sizing: border-box;"></div>
		</div>
	</div>
	*/
	
	public static function public_GMAP($dom_name, $aMARKERS, $key){
		
	
		echo '<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='.$key.'&language='.APP_LANG.'"></script>';
				
		echo '<script>';
		
		$config				= Kohana::$config->load('gmap.default');
		$styles				= $config['styles'];
		$zoom				= $config['zoom'];
		$max_zoom			= $config['max_zoom'];
		$scrollzoom			= $config['scrollzoom'] ? 'true':'false';
		$aINITCRD			= array(57.2741475, 24.4156825);
		

		echo 'google.maps.event.addDomListener(window, "load", g_initialize);';
		echo 'var map				= null;';
		echo 'var infowindow			= null;';
		echo 'var aMDATA			= new Array();';

		echo 'function g_initialize(){';
			echo 	'var styles		= ['.$styles.'];';
			echo 	'var mapOptions		= {';
			echo 					'center			: new google.maps.LatLng('.$aINITCRD[0].', '.$aINITCRD[1].' ),';
			echo 					'zoom			: '.$zoom.',';
			echo 					'disableDefaultUI	: true,';
			echo 					'mapTypeId		: google.maps.MapTypeId.ROADMAP,';
			echo 					'scrollwheel		: '.$scrollzoom;
			echo 				'};';

			echo 	'map			= new google.maps.Map(document.getElementById("map_canvas"), mapOptions);';
			echo 	'var bounds		= new google.maps.LatLngBounds();';
			echo 	'infowindow		= new google.maps.InfoWindow({content: "", maxWidth: 300});';

			$i			= 0;
			foreach($aMARKERS as $crd){
				$lanlat		= explode('#', $crd->coords);
				if(count($lanlat) != 2){
					$lanlat	= array('57.2741475', '24.4156825');;
				}	
			
				echo	'aMDATA['.$i.']			= new Object();';
				echo	'aMDATA['.$i.']._i		= '.$i.';';
				echo	'aMDATA['.$i.']._id		= "'.$crd->id.'";';
				echo	'aMDATA['.$i.']._cat_id	= parseInt("'.$crd->category_id.'");';
				echo	'aMDATA['.$i.']._title		= "'.$crd->title.'";';
				echo	'aMDATA['.$i.']._lan		= "'.$lanlat[0].'";';
				echo	'aMDATA['.$i.']._lat		= "'.$lanlat[1].'";';
				echo	'aMDATA['.$i.']._image		= "'.$crd->image.'";';

				echo	'aMDATA['.$i.']._mk		= new google.maps.Marker({';
				echo						'position : new google.maps.LatLng('.$lanlat[0].', '.$lanlat[1].'),';
				echo						'map	 : map,';
				echo						'icon	 : common.url_base + "assets/uploads/mapplaces/'.$crd->image.'",';
				echo						'animation: google.maps.Animation.DROP,';
				echo						'_i	 :'.$i;
				echo					'});';
				echo	'bounds.extend(aMDATA['.$i.']._mk.position);';
				echo	'gmap_marker_handler(aMDATA['.$i.']._mk);';
			
				$i++;
			}
			

			if($config['use']){
			echo 'map.setOptions({styles: styles});';
			}

			echo 'google.maps.event.addDomListener(window, "resize", function() {';
			echo 	'var center	= map.getCenter();';
			echo 	'google.maps.event.trigger(map, "resize");';
			echo 	'map.setCenter(center);';
			echo 	'var max_zoom		= parseInt("'.$max_zoom.'");';
			echo 	'if (map.getZoom() > max_zoom) {';
			echo 		'map.setZoom(max_zoom);';
			echo 	'}';
			echo '});';

			//echo 'map.fitBounds(bounds);';

			echo '$("#map_canvas").bind("vclick", function(){';
			echo 	'map.setOptions({scrollwheel:true});';
			echo '});';

			echo 'function gmap_marker_handler(marker){';
			echo 	'google.maps.event.addListener(marker, "click", function(e) {';
					//console.log(aMDATA[marker._i]._id, aMDATA[marker._i]._cat_id, aMDATA[marker._i]._title);
			echo 	'});';
			echo 	'google.maps.event.addListener(marker, "mouseover", function() {';
					//var szHTML		= '<div class="gmap-iw-cnt">';
					//szHTML			+=	'<div class="lf-gmap-iw-ttl">' + city + '</div>' ;
					//szHTML			+=	'<div class="lf-gmap-iw-dsc">' + title + '</div>';
					//szHTML			+= '</div>';
					//infowindow.setContent(szHTML);
					//infowindow.close();
					//infowindow.open(map, marker);
			echo 	'});';
			echo 	'google.maps.event.addListener(marker, "mouseout", function() {';
					//infowindow.close();
			echo 	'});';
			echo '}';
		echo '}';

		echo 'function g_filter(aFILTER){';
			echo 	'var bounds		= new google.maps.LatLngBounds();';

			echo 	'var l			= aMDATA.length;';
			echo 	'if(aFILTER.length == 0){';
			echo 		'for(var i = 0; i < l; i++){';
			echo 			'aMDATA[i]._mk.setVisible(true);';
			echo 			'bounds.extend(aMDATA[i]._mk.position);';
			echo 		'}';
			echo 	'} else {';
			echo 		'for(var i = 0; i < l; i++){';
			echo 			'aMDATA[i]._mk.setVisible(false);';
			echo 		'}';

			echo 		'for(var i = 0; i < l; i++){';
			echo 			'if( aFILTER[aMDATA[i]._cat_id]  ){';
			echo 				'aMDATA[i]._mk.setVisible(true);';
			echo 				'bounds.extend(aMDATA[i]._mk.position);';
			echo 			'} ';
			echo 		'}';
			echo 	'}';

			echo 	'google.maps.event.addListenerOnce(map, "bounds_changed", function(event) {';
			echo 		'var max_zoom		= parseInt("'.$max_zoom.'");';
			echo 		'if (this.getZoom() > max_zoom) {';
			echo 			'this.setZoom(max_zoom);';
			echo 		'}';
		echo 	'});';

		echo 	'map.fitBounds(bounds);';

		echo 	'map.setOptions({scrollwheel:false});';
		
		echo 	'var max_zoom		= parseInt("'.$max_zoom.'");';
		echo 	'if (map.getZoom() > max_zoom) {';
		echo 		'map.setZoom(max_zoom);';
		echo 	'}';
		
		
		echo '};';
		echo '</script>';
	}
}
?>