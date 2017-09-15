<?php
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	//DOCROOT

	define('APP_URL_BASE',		$this->config->item('base_url'));
	define('APP_PROTOCOL',		(!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) ? 'https://' : 'http://');
	define('APP_FULL_URL',		$_SERVER["REQUEST_URI"]);

	define('APP_LANG',		'lv'); /*TODO*/
	
	$CI				=& get_instance();
	$CI->load->library('utils');
	$CI->load->library('mobiledetect');
	$CI->load->library('browser');
	
	define('APP_DEVICE',		$CI->mobiledetect->detect_device());
	
	$browser_name			= $CI->utils->url_friendly(strtolower($CI->browser->getBrowser()));
	$browser_ver			= (int)$CI->browser->getVersion();
	define('APP_BROWSER',		$browser_name);
	define('APP_BROWSER_VER',	$browser_ver);
	define('APP_IE9ORLESS',		$browser_name == 'internet-explorer' && $browser_ver <= 9);
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta content="IE=edge" http-equiv="X-UA-Compatible">
		
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="format-detection" content="telephone=no">
		<meta name="description" content="<?php echo isset($description) ? $description : '';?>">
		<meta name="keywords" content="<?php echo isset($keywords) ? $keywords : '';?>">
		<meta name="author" content="">
		
		<title><?php echo isset($title) ? $title : '';?></title>
		
		<?php
		/*
		<meta property="fb:app_id"	content="XXX" />
		<meta property="og:title"	content="<?=isset($title) ? $title : '';?>" />
		<meta property="og:type"	content="website" />
		<meta property="og:url"		content="<?=URL::site(null, 'http')?>" />
		<meta property="og:image"	content="<?=URL::site(null, 'http')?>assets/img/i1600x859.png" />
		<meta property="og:description" content="<?=isset($description) ? $description : '';?>" />

		<meta name="dr:say:title"	content="<?=isset($title) ? $title : '';?>" />
		<meta name="dr:say:img"		content="<?=URL::site(null, 'http')?>assets/img/i1600x859.png" />
		*/
		?>
		
		<link rel="shortcut icon" href="<?php echo APP_URL_BASE;?>assets/img/favicon.ico" type="image/x-icon" />
		<link rel="icon" href="<?php echo APP_URL_BASE;?>assets/img/favicon.ico" type="image/x-icon" />

		<script>
			var common = {
				docroot:	'<?php echo str_replace(DIRECTORY_SEPARATOR, '/', DOCROOT);?>',
				protocol:	'<?php echo APP_PROTOCOL;?>',
				url_base:	'<?php echo APP_URL_BASE;?>',
				url_full:	'<?php echo APP_FULL_URL;?>',
				lang:		'<?php echo APP_LANG;?>',
				device:		'<?php echo APP_DEVICE;?>'
				browser:	'<?php echo APP_BROWSER;?>',
				browser_ver:	'<?php echo APP_BROWSER_VER;?>',
				is_ie9orless:	<?php echo (APP_IE9ORLESS ? "true" : "false");?>,
				history_api:	(typeof history.pushState !== 'undefined'),
				hash:		''			
			};
		</script>
		
		<?php /* ?>
		<?php if(Helper_Utils::crawlerDetect() && APP_IE9ORLESS){ ?>
		<script>
			if(window.location.hash != ''){
				// in case of crowler - feed him a real address
				// convert: projectname.lv#page/id
				// to: projectname.lv/page/id
				window.location.href = common.url_base + common.lang + "/" + String(window.location.hash).split('#')[1];
			}
		</script>
		<?php } ?>
		
		<?php if(APP_DEVICE == 'pc' && !APP_IE9ORLESS) { ?>
		<script>
			//prevent autojump to hash on pc if browser no ie9 or less
			common.hash			= '';
			if(window.location.hash != ''){
				var aTMP		= String(window.location.hash).split('#');
				if(aTMP.length == 2){
					common.hash	= aTMP[1];
				}
				window.location.hash	= "";
			}
		</script>
		<?php } ?>
		
		<?php */ ?>
		
		<?php
		$CI->utils->add_css('assets/css/style.before.min');
		$CI->utils->add_js('assets/js/main.before.min');
		?>
		
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->		
		
		<meta http-equiv='x-dns-prefetch-control' content='on'>
		<link rel='dns-prefetch' href='http://projectname.lv'>
		<link rel='dns-prefetch' href='http://projectname.ru'>
		<link rel='dns-prefetch' href='http://projectname.en'>
	</head>
	
	<body>
		<?php echo $content; ?>
		
		<?php
		$CI->utils->add_css('assets/css/style.after.min');
		$CI->utils->add_js('assets/js/main.after.min');
		$CI->utils->add_css_fix();
		?>
	</body>
</html>
