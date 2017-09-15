$(document).ready(function(){

	app.preinit();

	$(window).on('resize', function(){
		app.resize(utl_clientWindowSize());
	});
	$(window).resize();
		
	$(window).on('scroll', function(){
		app.scroll(utl_getScrollTop());
	});
	$(window).scroll();
	
	app.init();
});

$(window).on('load', function(){ 
	
	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			app.visibility('hidden');
		} else {
			app.visibility('visible');
		}
		if (document.visibilityState === 'unloaded') {
			app.visibility('unloaded');
		}	
	});
	
	app.unimportant_init();
});

var app = {
	visibility: function(mode){
		console.log('app:visibility', mode);
	},
	
	resize: function(aWH){
		console.log('app:resize:',aWH[0]);
	},
	
	scroll: function(offs){
		console.log('app:scroll:',offs);
	},
	
	unimportant_init: function(){
		console.log('app:unimportant_init');
		
		url_path.init();
		
		//if no ie9 or less and has hash - scroll to hash
		if(common.hash != '' && !common.is_ie9orless && common.device == 'pc'){
			$('html, body').animate({
				scrollTop: $("#" + common.hash).offset().top
			}, 1000, 'swing', function () {});			
		}
	},	
	
	preinit: function(){
		console.log('app:preinit');
	},
	
	init: function(){
		console.log('app:init');
	}
};