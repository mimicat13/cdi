$(document).ready(function(){

	app.preinit();

	$(window).resize(function(){
		app.resize(utl_clientWindowSize());
	});
	$(window).resize();
		
	$(window).scroll(function(){
		app.scroll(utl_getScrollTop());
	});
	$(window).scroll();
	
	app.init();
});

$(window).load(function(){
	app.unimportant_init();
});

var app = {
	bTriblockInited	: false,
	scroll_old	: 0,
	
	resize: function(aWH){
		common.width		= aWH[0];
		common.height		= aWH[1];
		//console.log(aWH);
		
		app.recalc_gallery();
		mps_switcher.resize(common.width);
	},
	
	recalc_gallery: function(){
		if(common.slider_ready === true){
			var plate_width		= '99%';
			if(common.height < 874 && common.height < common.width  && common.width > 826){
				plate_width	= common.height + 'px';
			}
			if(common.width < 826){
				plate_width	= '100%';
			}
			$('.lp-gallery__pop-plate').css('width', plate_width);

			var pager_height	= $('.lSPager').height();
			var earr_height		= $('.lp-gallery-go').height();

			var arr_bottom		= Math.round(pager_height * 0.5 - earr_height * 0.5);

			$('.lp-gallery-go').css('bottom', arr_bottom + 'px');
		}
	},
	
	scroll: function(offs){
		
		//do menu smaller and change font color
		//if(offs > 400 && common.width > 1100){
		if(offs > 40 && common.width > 1100){
			if(!$('.lp-menu-container').hasClass('lp-menu-container--smaller')){
				$('.lp-menu-href').addClass('a--small');
				$('.lp-menu-container__info').addClass('lp-menu-container__info--active');
				$('.lp-leftbar img').addClass('img--smaller');
				
				$('.lp-menu-container')
					.addClass('lp-menu-container--smaller')
					.addClass('lp-menu-container--ease')
					.delay(200).queue(function(){
						$(this).dequeue();
						$(this).addClass('lp-menu-container--ease-trans');
					});
			}
			
			//if scroll goes up - show menu
			if(app.scroll_old > offs){
				if( !$('.lp-menu-container--ease').hasClass('lp-menu-container--ease-open') ){
					$('.lp-menu-container--ease').addClass('lp-menu-container--ease-open');
				}
			} else {//if scroll goes down - hide it
				if( $('.lp-menu-container--ease').hasClass('lp-menu-container--ease-open') ){
					$('.lp-menu-container--ease').removeClass('lp-menu-container--ease-open');
				}
			}				
			
		} else {
			if($('.lp-menu-container').hasClass('lp-menu-container--smaller')){
				$('.lp-menu-href').removeClass('a--small');
				$('.lp-menu-container__info').removeClass('lp-menu-container__info--active');
				$('.lp-leftbar img').removeClass('img--smaller');
				
				$('.lp-menu-container')
					.removeClass('lp-menu-container--ease-trans')
					.removeClass('lp-menu-container--ease')
					.removeClass('lp-menu-container--ease-open')
					.removeClass('lp-menu-container--smaller');
			}
		}
		
		//segment spy for meny hilight
		var footer_height		= $('.lp-segment-footer').height();
		var footer_offset		= $('.lp-segment-footer').offset().top + footer_height - footer_height / 6;
		var footer_reached		= false;
		if(footer_offset < offs + common.height){
			footer_reached		= true;
		}
		
		//all segments except footer
		for(var i = 1; i < 5; i++){
			if($('.lp-segment-' + i).length == 0) continue;
			
			var u_offs		= 150;
			var d_offs		= 150;
			if(i == 0){
				u_offs		= 0;
			}
			
			var element_offset	= $('.lp-segment-' + i).offset().top;
			var element_height	= $('.lp-segment-' + i).height();
			
			if( element_offset <= offs + u_offs && element_offset + element_height > offs + d_offs ){
				if(!footer_reached){
					//highlight only if footer not reached
					$('.lp-menu-' + i).addClass('menu-active');
				} else {
					$('.lp-menu-' + i).removeClass('menu-active');
				}
			} else {
				$('.lp-menu-' + i).removeClass('menu-active');
			}
			
			
			//fade in sections on scroll only on pc
			if(common.device == 'pc'){
				var u_offs_section	= common.height - common.height / 4;
				var d_offs_section	= common.height - common.height / 2;
				if(	element_offset <= offs + u_offs_section 
					&& 
					element_offset + element_height > offs + d_offs_section ){
					if(!$('.lp-segment-' + i).hasClass('lp-segment--activated')){
						$('.lp-segment-' + i).addClass('lp-segment--activated');
					}
				}
			}
		}
		if(footer_reached){
			if( !$('.lp-menu-5').hasClass('menu-active') ){
				$('.lp-menu-5').addClass('menu-active');
			}
		} else {
			if( $('.lp-menu-5').hasClass('menu-active') ){
				$('.lp-menu-5').removeClass('menu-active');
			}
		}
		
		
		if(common.device != 'pc'){
			//about segment 4 icons: on devices - show instantly
			$('.lp-front-about--ani-0').css('opacity',1).css('margin-top','0px');
			$('.lp-front-about--ani-1').css('opacity',1).css('margin-top','0px');
			$('.lp-front-about--ani-2').css('opacity',1).css('margin-top','0px');
			$('.lp-front-about--ani-3').css('opacity',1).css('margin-top','0px');
			
		} else {
			//about segment 4 icons: on pc - show one-by-one with delay
			if(!app.bTriblockInited){
				var element				= $('.lp-front-about--ani-0');
				if(element.length > 0){
					//get vertical position
					var pageBottom			= offs + $(window).height();
					var elementTop			= $(element).offset().top;
					var elementBottom		= elementTop + $(element).height();

					if ((elementTop <= pageBottom) && (elementBottom >= offs)){
						app.bTriblockInited	= true;
						$('.lp-front-about--ani-0').delay(100).transition({opacity:1, marginTop:'0px'}, 800);
						$('.lp-front-about--ani-1').delay(300).transition({opacity:1, marginTop:'0px'}, 800);
						$('.lp-front-about--ani-2').delay(500).transition({opacity:1, marginTop:'0px'}, 800);
						$('.lp-front-about--ani-3').delay(700).transition({opacity:1, marginTop:'0px'}, 800);
					}
				}
			}
		}
		
		app.scroll_old			= offs;
	},
	
	unimportant_init: function(){
		console.log('app:unimportant_init');
		
		//show building title after all is loaded (delayed)
		$('.map__building--title').transition({marginTop:0, opacity:1}, 1200, 'easeOutQuint');
		
		url_path.init();
		$(window).resize();
	},	
	
	preinit: function(){
		console.log('app:preinit');
		
		// popup close cross hover zoom animation
		if(common.device == 'pc'){
			$('.lf-form-pop-close').hover(
				function(){
					$(this).stop(true, false).transition({opacity: 0.9, scale:0.9}, 300);
				},
				function(){
					$(this).stop(true, false).transition({opacity: 1, scale:1}, 300);
				}
			);
			$('.lp-gallery__pop-close').hover(
				function(){
					$(this).stop(true, false).transition({opacity: 0.9, scale:0.9}, 300);
				},
				function(){
					$(this).stop(true, false).transition({opacity: 1, scale:1}, 300);
				}
			);
		}
		
		//rebuild swg to svg code
		//$('.img-2-svg').each(function(i, dom){
		//	utl_buildSVG(dom);
		//});
		
		//for(var i = 0; i < 4; i++){
			//$('.lp-main-projabout-' + i).css('opacity','0').css('margin-top','30px');
		//}
		 
		//menu hover
		$('.lp-menu-href').bind('vclick', function(){ 
			if(common.type !== 'index'){ return; }
			
			var scroll			= $(this).data('scroll');
			
			//scroll on pc & jump on device
			if(common.device != 'pc'){
				window.location.hash	= '#' + scroll;
			} else {
				$('html, body').scrollTo( $('#' + scroll), 400, {offset: {top:-70} });
			}
			
			$('.hamburger').removeClass('is-active');
			$('.hamburger-opener').hide();
			$('.lp-menu-container-mobile').removeClass('lp-menu-container-mobile--opened');
		});
		
		//hamburger clicks
		$('.hamburger').bind('vclick', function(){
			if( $(this).hasClass('is-active') ){
				$(this).removeClass('is-active');
				$('.hamburger-opener').hide();
				$('.lp-menu-container-mobile').removeClass('lp-menu-container-mobile--opened');
				
				$('.lp-menu-container-mobile__help--opened').hide();
				$('.lp-menu-container-mobile__help--closed').show();
			} else {
				$(this).addClass('is-active');
				$('.hamburger-opener').show();
				$('.lp-menu-container-mobile').addClass('lp-menu-container-mobile--opened');
				
				$('.lp-menu-container-mobile__help--opened').show();
				$('.lp-menu-container-mobile__help--closed').hide();
			}
		});
		
		/*
		if(common.type == 'index'){
			
			[].slice.call(document.querySelectorAll('.fx-grid--effect-altair > .fx-grid__item')).forEach(function(stackEl) {
				new PolarisFx(stackEl);
			});
		}
		/**/
		
		// gallery close by: cross & fade background
		$('.lp-gallery__pop-fade').bind('vclick', function(){
			$('.lp-gallery__pop-inner').transition({opacity:0}, 300, function(){
				$('.lp-gallery__pop-inner').empty();
				common.slider.destroy();
				common.slider_ready = false;
			});
			$('.lp-gallery__pop').removeClass('lp-gallery__pop--visible');
		});
		$('.lp-gallery__pop-close').bind('vclick', function(){
			$('.lp-gallery__pop-inner').transition({opacity:0}, 300, function(){
				$('.lp-gallery__pop-inner').empty();
				common.slider.destroy();
				common.slider_ready = false;
			});
			$('.lp-gallery__pop').removeClass('lp-gallery__pop--visible');
		});

		//dynamic click on gallery left/right buttons
		$('body').on('vclick', '.lp-gallery-go--left', function(){
				if( !$(this).hasClass('lp-gallery-dir--inactive') ){
					if(common.slider){
						common.slider.goToPrevSlide(); 
					}
				}
			});
		$('body').on('vclick', '.lp-gallery-go--right', function(){
				if( !$(this).hasClass('lp-gallery-dir--inactive') ){
					if(common.slider){
						common.slider.goToNextSlide(); 
					}
				}
			});
		
		//gallery left/right swipe on device
		$(".lp-gallery__pop-plate").swipe( {
			preventDefaultEvents: false,
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				if(common.device != 'pc'){
					if(direction == 'left'){
						if(common.slider){
							common.slider.goToNextSlide(); 
						}
					}
					if(direction == 'right'){
						if(common.slider){
							common.slider.goToPrevSlide(); 
						}
					}
				}
			}
		});
		//flat gallery left/right swipe on device
		$(".flat-content-pad").swipe( {
			preventDefaultEvents: false,
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				if(common.device != 'pc'){
					if(direction == 'left'){
						if(mps_switcher.lslider){
							mps_switcher.lslider.goToNextSlide(); 
						}
					}
					if(direction == 'right'){
						if(mps_switcher.lslider){
							mps_switcher.lslider.goToPrevSlide(); 
						}
					}
				}
			}
		});
			
		//info plate on google map click
		$('.lp-place__map-close').bind('vclick', function(){
			if(!$(this).hasClass('lp-place__map-close--closed')){
				$(this).addClass('lp-place__map-close--closed');
				$(this).stop(true, false).transition({rotate:'45deg'}, 400);
				
				$('.lp-place__map-pop').addClass('lp-place__map-pop--closed');
			} else {
				$(this).removeClass('lp-place__map-close--closed');
				$(this).stop(true, false).transition({rotate:'0deg'}, 400);
				
				$('.lp-place__map-pop').removeClass('lp-place__map-pop--closed');
			}
		});

		//disable checkbock default click reaction (we set it on global click on filter plate)
		$('.filter-checkbox').click(function(e){
			if(typeof Event.prototype.preventDefault === 'undefined') {
				Element.prototype.preventDefault = function (e, callback) {
					this.returnValue = false;
				};
			} else {
				e.preventDefault();
				return false;
			}
		});

		//mobile filter dropdown opener
		$('.filter-item-opener').bind('vclick', function(){
			if( $('.filter-item-drop').hasClass('filter-item-drop--opened') ){
				$('.filter-item-drop').removeClass('filter-item-drop--opened')	
				$('.filter-item-opener').removeClass('filter-item-border');
				$('.filter-item-arrow').transition({rotate:'0deg'});
			} else {
				$('.filter-item-drop').addClass('filter-item-drop--opened');
				$('.filter-item-opener').addClass('filter-item-border');
				$('.filter-item-arrow').transition({rotate:'180deg'});
			}
		});

		$('.lf-form-pop-fade').click(function(){
			$('.lf-form-pop-close').click();
		});
		$('.lf-form-pop-close').click(function(){
			$('.lf-form-pop').removeClass('lf-form-pop--visible');
		});
		$('.form-content-fields-input').focus(function(){
			if( $('.form-content-rezult').hasClass('form-content-rezult--opened') ){
				$('.form-content-rezult').removeClass('form-content-rezult--opened');
			}
			if( $(this).hasClass('form-content-fields-input--error') ){
				$(this).removeClass('form-content-fields-input--error')
			}
			if( $('.form-error').hasClass('form-error--visible') ){
				$('.form-error').removeClass('form-error--visible');
			}
		});
		$('#form-submit').submit(function(e){
			e.preventDefault();
			
			$.ajax({
				type		: "POST",
				url		: common.url_base + common.lang +'/actions/subscribe',
				data: {	
					'u-name'	: $('#u-name').val(),
					'u-phone'	: $('#u-phone').val(),
					'u-email'	: $('#u-email').val(),
					'u-message'	: $('#u-message').val(),
					'u-flat'	: $('#u-flat').val(),
					'salt'		: $('#salt').val()
				}
			}).done(function( msg ) {
				switch(msg['status']){
					case 'ok':
						$('#u-name').val('');
						$('#u-phone').val('');
						$('#u-email').val('');
						$('#u-message').val('');
						$('.form-content-rezult').addClass('form-content-rezult--opened');
					break;
					
					case 'fail':
						for(var o in msg['errors']){
							$('#' + o).addClass('form-content-fields-input--error');
						}
						$('.form-error').addClass('form-error--visible');
						
						if(common.device != 'pc'){
							$('.form-content-fields').scrollTop( 0 );
						}
					break;
					
					case 'bot':
					break;
				}
				
			}).fail(function() {
				// show err - try again
			}).always(function() {
				// always do something after
			});				
		});

		// hoevr actions
		$('.button-action-hover').hover(
			function(){
				var action		= $(this).data('action');
				var spec		= $(this).data('spec');
				
				switch(action){
					case 'watch':
						if(mps_switcher.state > mps_switcher.STATE_BUILDING){
							mps_switcher.hilight_under(spec, true);
							mps_building.dehilight_under();
						} else {
							mps_building.hilight(spec);
						}
					break;
					
					case 'watch-circle':
						if(mps_switcher.state > mps_switcher.STATE_BUILDING){
							mps_switcher.hilight_under(spec, true);
						} else {
							mps_building.over_circle(spec);
							
					}
					break;

					case 'open':
						if(common.device == 'pc'){
							mps_floors.hilight(spec);
						}
					break;
				}
			},
			function(){
				var action		= $(this).data('action');
				var spec		= $(this).data('spec');
				
				switch(action){
					case 'watch-circle':
					case 'watch':
						if(mps_switcher.state > mps_switcher.STATE_BUILDING){
							mps_switcher.hilight_under(spec, false);
							mps_building.dehilight_under();
						} else {
							if( $(this).hasClass('pulse-button') ){
								mps_building.out_circle(spec);
							}
						}
					break;


					case 'open':
						if(common.device == 'pc'){
							mps_floors.out(spec);
							mps_floors.hilight(false);
						}
					break;
				}
			}
		);

		$('.button-action').bind('vclick', function(){
			var action		= $(this).data('action');
			var spec		= $(this).data('spec');
			
			//console.log(action, spec, mps_switcher.state == mps_switcher.STATE_FLOOR);
			
			switch(action){
				case 'print':
					window.print();
				break;
				
				case 'watch-circle':
				case 'watch':
					if(mps_switcher.state > mps_switcher.STATE_BUILDING){
						mps_switcher.switch(spec);
					} else {
						mps_switcher.watch(spec);
					}
				break;
			
				case 'open':
					mps_switcher.watch(spec);
				break;
				
				case 'back':
					mps_switcher.ret();
				break;

				case 'subscribe-header':
					$('.lf-form-pop').addClass('lf-form-pop--visible');
				break;
				
				case 'subscribe-flat':
					$('#u-flat').val(spec);
					$('.lf-form-pop').addClass('lf-form-pop--visible');
				break;
				
				case 'open-gallery':
					$.ajax({
						type		: "POST",
						url		: common.url_base + common.lang + '/actions/gallery',
						data: {	
							id	: spec
						}
					}).done(function( msg ) {
						//generate pop gallery
						common.slider_ready = true;
						app.recalc_gallery();
						common.slider_ready = false;
						
						var szHTML	= '';
						szHTML		+= '<ul id="imageGallery">';
						
						var path	= common.url_base + 'assets/uploads/galleries/'
						
						var l		= msg['data']['images'].length;
						
						$('.lp-gallery__pop-title--name').text(msg['data']['title']);
						$('.lp-gallery__pop-title--cnt').text('1/' + l);
						
						for(var i = 0; i < l; i++){
							szHTML	+=	'<li class="lSSlide-item" data-thumb="' + path + 'thumb/' + msg['data']['images'][i]['file'] + '" data-src="' + path + msg['data']['images'][i]['file'] + '">';
							szHTML	+=		'<img class="lSSlide-item-img" src="' + path + msg['data']['images'][i]['file'] + '" />';
							szHTML	+=	'</li>';
						}
						
						szHTML		+= '</ul>';
						
						// create custom navi LR
						// USE:
						//	$('.lSPrev').click();
						//	$('.lSNext').click();
						//szHTML		+= '<img class="lp-gallery-dir lp-gallery-dir--left lp-gallery-go lp-gallery-go--left app-absolute lp-gallery-dir--inactive" src="'+common.url_base+'assets/img/gall-arr-l.svg" alt="">';
						//szHTML		+= '<img class="lp-gallery-dir lp-gallery-dir--right lp-gallery-go lp-gallery-go--right app-absolute" src="'+common.url_base+'assets/img/gall-arr-r.svg" alt="">';
						szHTML		+= '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 18" class="lp-gallery-dir lp-gallery-dir--left lp-gallery-go lp-gallery-go--left app-absolute lp-gallery-dir--inactive" style="opacity: 1; bottom: 30px;"><path class="lp-svg-filler" fill="#bfbfbf" d="M11.63 15.69L3.37 9l8.26-6.69c.37-.44.3-1.09-.13-1.46a1.04 1.04 0 0 0-1.46.14l-8.8 7.35a1.03 1.03 0 0 0 0 1.32l8.8 7.36a1.04 1.04 0 0 0 1.59-1.33z"></path></svg>';
						szHTML		+= '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="18" viewBox="0 0 11 18" class="lp-gallery-dir lp-gallery-dir--right lp-gallery-go lp-gallery-go--right app-absolute" style="opacity: 1; bottom: 30px;"><path class="lp-svg-filler" fill="#bfbfbf" d="M.25 15.28L8.6 8.5.25 1.72A1.05 1.05 0 0 1 1.85.38l8.91 7.45a1.06 1.06 0 0 1 0 1.34l-8.91 7.45c-.37.45-1.02.51-1.47.14a1.06 1.06 0 0 1-.13-1.48z"></path></svg>';
						
						// to prevent flickering: make it with minimal opacity
						$('.lp-gallery__pop-inner').append(szHTML);
						$('.lp-gallery__pop-inner').css('opacity', 0.01);
						
						//utl_buildSVG( $('.lp-gallery-go--left') );
						//utl_buildSVG( $('.lp-gallery-go--right') );
						
						common.slider_images_cnt	= l;
						common.slider = $('#imageGallery').lightSlider({
										gallery			: true,
										item			: 1,
										thumbItem		: 8,
										slideMargin		: 0,
										enableDrag		: false,
										currentPagerPosition	: 'middle',
										useCSS			: false,
										
										onSliderLoad: function(el) {
											$('.lp-gallery__pop-inner').transition({opacity:1}, 300, function(){
												$('.lp-gallery-dir').stop(true, false).transition({opacity:1}, 600, function(){
													common.slider_ready = true;
													app.recalc_gallery();
												});
											});
										},
										
										onBeforeSlide: function (el) {
											var curr	= common.slider.getCurrentSlideCount();
											
											if(curr == 1){
												$('.lp-gallery-go--left').addClass('lp-gallery-dir--inactive');
											} else {
												$('.lp-gallery-go--left').removeClass('lp-gallery-dir--inactive');
											}
											
											if(curr == common.slider_images_cnt){
												$('.lp-gallery-go--right').addClass('lp-gallery-dir--inactive');
											} else {
												$('.lp-gallery-go--right').removeClass('lp-gallery-dir--inactive');
											}
										},
										
										responsive : [ 
												{
													breakpoint:640,
													settings: {
														thumbItem:5,
													}
												}
											]										
									});
									
						$('.lp-gallery__pop').addClass('lp-gallery__pop--visible');
					}).fail(function() {
					}).always(function() {
					});						
				break;
				
				case 'filter-cbox-small':
				case 'filter-cbox':
					var aSELECTED			= new Array();
					
					if(spec == 'all'){
						// deselect all rest & select 'all'
						$('.filter-checkbox').each(function(i, dom){
							var curr_spec	= $(dom).data('spec');

							if(curr_spec != 'all'){
								$(dom).prop('checked', false);
								$('.filter-item[data-spec="'+curr_spec+'"]').removeClass('filter-item--selected');
							} else {
								$(dom).prop('checked', true);
								$('.filter-item[data-spec="'+curr_spec+'"]').addClass('filter-item--selected');
							}
						});
						
						$('.filter-item-checkbox').each(function(i, dom){
							var curr_spec	= $(dom).data('spec');

							if(curr_spec != 'all'){
								$(dom).prop('checked', false);
							} else {
								$(dom).prop('checked', true);
							}
						});							
					} else {
						//deselect all
						//big
						$('.filter-item[data-spec="all"]').removeClass('filter-item--selected');						
						$('.filter-checkbox[data-spec="all"]').prop('checked', false);
						//small
						$('.filter-item-checkbox[data-spec="all"]').prop('checked', false);
						
						
						//select/deselect current
						//big
						if( $('.filter-item[data-spec="'+spec+'"]').hasClass('filter-item--selected') ){
							$('.filter-checkbox[data-spec="'+spec+'"]').prop('checked', false);
							$('.filter-item[data-spec="'+spec+'"]').removeClass('filter-item--selected');
						} else {
							$('.filter-checkbox[data-spec="'+spec+'"]').prop('checked', true);
							$('.filter-item[data-spec="'+spec+'"]').addClass('filter-item--selected');
						}
						//small
						if( $('.filter-item-checkbox[data-spec="'+spec+'"]').prop('checked') ){
							$('.filter-item-checkbox[data-spec="'+spec+'"]').prop('checked', false);
						} else {
							$('.filter-item-checkbox[data-spec="'+spec+'"]').prop('checked', true);
						}
						
						//gather checked
						//big
						$('.filter-checkbox').each(function(i, dom){
							var curr_spec	= $(dom).data('spec');
							
							if(curr_spec != 'all'){
								if($(dom).prop('checked')){
									aSELECTED[curr_spec] = true;
								}
							}
						});
						//small
						$('.filter-item-checkbox').each(function(i, dom){
							var curr_spec	= $(dom).data('spec');
							
							if(curr_spec != 'all'){
								if($(dom).prop('checked')){
									aSELECTED[curr_spec] = true;
								}
							}
						});						
						
						//if no checked gathered - select 'all'
						if(aSELECTED.length == 0){
							$('.filter-checkbox[data-spec="all"]').prop('checked', true);
							$('.filter-item[data-spec="all"]').addClass('filter-item--selected');
							
							//small
							$('.filter-item-checkbox[data-spec="all"]').prop('checked', true);
						}
					}
					
					g_filter(aSELECTED);					
				break;
			}
		});
		
		$(window).scroll();
	},
	
	init: function(){
		console.log('app:init');
		//...
	}
};