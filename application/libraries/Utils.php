<?php
class Utils {
	protected $CI;

	public function __construct($params = NULL)
	{
		$this->CI =& get_instance();
	}

	private static $repl_src		= array(" ", "ā","č","ē","ģ","ī","ķ","ļ","ņ","š","ū","ž","õ","ä","Ö","ü","Ą","Ę","Ė","Ų", "Ā","Č","Ē","Ģ","Ī","Ķ","Ļ","Ņ","Š","Ū","Ž","Õ","Ä","ö","Ü","ą","ę","ė","ų", 'ё','ж','ц','ч','ш','щ','ю','я','Ё','Ж','Ц','Ч','Ш','Щ','Ю','Я','А','Б','В','Г','Д','Е','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ъ','Ы','Ь','Э','а','б','в','г','д','е','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ъ','ы','ь','э', "\\", "/", "@", "#", "$", "%", "!", "~", "`", "&", "^", "*", "(", ")", "+", "=", ":", ";", "|", "\"", ",");
	private static $repl_dst		= array("-", "a","c","e","g","i","k","l","n","s","u","z","o","a","o","u","a","e","e","u", "a","c","e","g","i","k","l","n","s","u","z","o","a","o","u","a","e","e","u", 'yo','zh','tc','ch','sh','sh','yu','ya','YO','ZH','TC','CH','SH','SH','YU','YA','A','B','V','G','D','E','Z','I','J','K','L','M','N','O','P','R','S','T','U','F','H','_','I','_','E','a','b','v','g','d','e','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','','i','','e',  '_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_',);
	public function url_friendly($str){
		$i				= 0;
		foreach(self::$repl_src as $rp){
			$str			= str_replace($rp, self::$repl_dst[$i], $str);
			$i++;
		}
		return $str;
	}
	
	public function truncate($text, $chars = 32) {
		if(strlen($text) >  $chars){
			$text			= strip_tags($text)." ";
			$text			= mb_substr($text, 0, $chars);
			$text			= mb_substr($text, 0, mb_strrpos($text,' '));
			$text			= $text."...";
		}
		return $text;
	}
	
	public function is_number($var){
		if ($var == (string) (float) $var) {
			return (bool) is_numeric($var);
		}
		if ($var >= 0 && is_string($var) && !is_float($var)) {
			return (bool) ctype_digit($var);
		}
		return (bool) is_numeric($var);
	}

	public function format_mailto($str){
		return eregi_replace('([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})','<a href="mailto:\\1">\\1</a>', $str);
	}
	
	public function force_download($file){
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
	
	public function save_to_csv($aDATA, $name = 'download'){
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
	
	public function unique_multidim_array($array, $key) {
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
	
	public function dir_list($dir, $with_files = false) {
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
	
	public function dir_content($sz_root = '', $b_dirs = false){
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
	public function DOMDocument_innerHTML( $contentdiv ) {
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
	
	public function is_ajax(){
		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			return true;
		}
		return false;
	}

	public function formatSizeUnits($bytes){
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
	
	public function crawlerDetect(){
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
	
	public function  sendData($url, $data) {
		$ch 			= curl_init($url);

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$result 		= curl_exec($ch);
		$curl_error_code 	= curl_errno($ch);
		curl_close($ch);

		return $result;
	}
	
	public function add_css($name){
		if(file_exists(DOCROOT.$name.'.css')){
			echo '<link href="'.APP_URL_BASE.$name.'.css?t='.filemtime(DOCROOT.$name.'.css').'" type="text/css" rel="stylesheet" />'.PHP_EOL;
		}
	}
	
	public function add_js($name){
		if(file_exists(DOCROOT.$name.'.js')){
			echo '<script src="'.APP_URL_BASE.$name.'.js?t='.filemtime(DOCROOT.$name.'.js').'" type="text/javascript"></script>'.PHP_EOL;
		}
	}
	
	public function add_css_fix(){
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
	
	/*/
	private static function encrypt($decrypted, $password, $salt='!kQm*fF3pXe1Kbm%9') {
		// Build a 256-bit $key which is a SHA256 hash of $salt and $password.
		$key = hash('SHA256', $salt . $password, true);
		// Build $iv and $iv_base64.  We use a block size of 128 bits (AES compliant) and CBC mode.  
		// (Note: ECB mode is inadequate as IV is not used.)
		srand(); $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC), MCRYPT_RAND);
		if (strlen($iv_base64 = rtrim(base64_encode($iv), '=')) != 22) return false;
		// Encrypt $decrypted and an MD5 of $decrypted using $key.  
		// MD5 is fine to use here because it's just to verify successful decryption.
		$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $decrypted . md5($decrypted), MCRYPT_MODE_CBC, $iv));
		// We're done!
		return $iv_base64 . $encrypted;
	}

	private static function decrypt($encrypted, $password, $salt='!kQm*fF3pXe1Kbm%9') {
		// Build a 256-bit $key which is a SHA256 hash of $salt and $password.
		$key = hash('SHA256', $salt . $password, true);
		// Retrieve $iv which is the first 22 characters plus ==, base64_decoded.
		$iv = base64_decode(substr($encrypted, 0, 22) . '==');
		// Remove $iv from $encrypted.
		$encrypted = substr($encrypted, 22);
		// Decrypt the data.  rtrim won't corrupt the data because the last 32 characters are the md5 hash; 
		// thus any \0 character has to be padding.
		$decrypted = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, base64_decode($encrypted), MCRYPT_MODE_CBC, $iv), "\0\4");
		// Retrieve $hash which is the last 32 characters of $decrypted.
		$hash = substr($decrypted, -32);
		// Remove the last 32 characters from $decrypted.
		$decrypted = substr($decrypted, 0, -32);
		// Integrity check.  If this fails, either the data is corrupted, or the password/salt was incorrect.
		if (md5($decrypted) != $hash) return false;
		// Yay!
		return $decrypted;
	}	
	
	public static function passcrypt($pass, $bEncrypt){
		$inner_pass		= 'ltc_Sp--orT#';
		
		if($bEncrypt){
			return self::encrypt($pass, $inner_pass);
		} else {
			return self::decrypt($pass, $inner_pass);
		}
	}		
	/**/
}