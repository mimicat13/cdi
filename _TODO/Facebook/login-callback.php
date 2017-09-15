<?php
session_start();

include('../config.php');

require_once __DIR__ . '/autoload.php';
$fb						= new Facebook\Facebook([
								'app_id' => FAUTH_ID,
								'app_secret' => FAUTH_SECRET,
								'default_graph_version' => 'v2.5',
							]);


$helper = $fb->getRedirectLoginHelper();
try {
  $accessToken = $helper->getAccessToken();
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  // When Graph returns an error
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  // When validation fails or other local issues
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}

if (isset($accessToken)) {
	// Logged in!
	$_SESSION['facebook_access_token'] = (string) $accessToken;

	// Now you can redirect to another page and use the
	// access token from $_SESSION['facebook_access_token']
	
	try {
		// Returns a `Facebook\FacebookResponse` object
		$response		= $fb->get('/me?fields=id,name', (string) $accessToken);
		$user			= $response->getGraphUser();
		
		$_SESSION['user_id']	= $user['id'];
		$_SESSION['network']	= 'facebook';
		$_SESSION['user_pic']	= 'https://graph.facebook.com/'.$user['id'].'/picture';
		$_SESSION['user_url']	= 'https://www.facebook.com/'.$user['id'];
		$_SESSION['user_name']	= $user['name'];
		
		
	} catch(Facebook\Exceptions\FacebookResponseException $e) {
		echo 'Graph returned an error: ' . $e->getMessage();
		exit;
	} catch(Facebook\Exceptions\FacebookSDKException $e) {
		echo 'Facebook SDK returned an error: ' . $e->getMessage();
		exit;
	}	
}

header('Location: '.BASIC_URL);
