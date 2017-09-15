<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

	public function index()
	{
		$this->load->helper('utils');
		
		//$this->load->library('phpmailer');
		//$this->phpmailer->send_mail('pavels@digibrand.lv', 'test body content', 'test subject', 'noreply@digibrand.lv');
		
		$library_vars		= array(
						'type' => 'large',
						'color' => 'red'
					);
		$this->load->library('utils', $library_vars);
		
		$page_vars		= array(
						'util_value' => fooutil(),
						'lib_value' => '@'
					);
		
		$global_vars		= array(
						'content' => $this->load->view('main', $page_vars, TRUE)
					);
		$this->load->view('global', $global_vars );		
	}
}
