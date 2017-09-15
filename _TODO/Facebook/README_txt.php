<?php

include('config.php');
	DEFINE("FAUTH_ID",		"XXX");
	DEFINE("FAUTH_SECRET",		"XXX");
	DEFINE("REDIRECT_URI",		"https://www.rimi.lv/iepirksanasspele/Facebook/login-callback.php");




require_once __DIR__ . '/Facebook/autoload.php';
$fb						= new Facebook\Facebook([
								'app_id' => FAUTH_ID,
								'app_secret' => FAUTH_SECRET,
								'default_graph_version' => 'v2.5',
							]);
$helper						= $fb->getRedirectLoginHelper();
$permissions					= ['email','public_profile']; // optional
$loginUrl					= $helper->getLoginUrl(REDIRECT_URI, $permissions);


