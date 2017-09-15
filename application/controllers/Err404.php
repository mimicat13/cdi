<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Err404 extends CI_Controller {

	public function index()
	{
		$this->load->view('err404');
	}
}
