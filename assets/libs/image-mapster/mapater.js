/**********************************************************************************************************/
function CMPS(imageMPS, opts, context, mode){
	this.imageMPS			= $(imageMPS);
	this.mode			= mode;
		
	this.imageMPS.mapster({
			fillColor	: opts.fillColor || 'FFFFFF',
			fillOpacity	: opts.fillOpacity || 0.3,
			
			stroke		: opts.stroke || false,
			strokeColor	: opts.strokeColor || 'FFFFFF',
			strokeOpacity	: opts.strokeOpacity || 0.8,
			strokeWidth	: opts.strokeWidth || 2,
			
			areas		: opts.areas || [],
			
			singleSelect	: true,
			mapKey		: 'name',
			listKey		: 'name',  
			
			fadeDuration	: 150,
			
			isSelectable	: false,
			
			noFade		: false,	/*new: added by mimicat*/
			context		: context,	/*new: added by mimicat*/
			permanentHover	: true,		/*new: added by mimicat*/
			
			onClick: function (e) {
				e.options.context.click(e.key);
			},
			onMouseover: function(e){
				e.options.context.over(e.key);
			},
			onMouseout: function(e){
				e.options.context.out(e.key);
			},
		});
	
	// resize will be called only once at the very end of rezise
	this.final_resize		= utl_debounce(function(w) {
		if(this.mode == 'floor'){
			if(w < 1210){
				if(w > 992){
					var new_width			= $('.map__building').children('.building-content').width();

					if($.isNumeric(new_width) && new_width != 0){
						this.imageMPS.mapster('resize', new_width, 0, 100);

						var perc		= (1086-new_width)/1086*100;
						var wh			= math_clamp(1086, 866, 32, 24, new_width);
						var fnt			= math_clamp(1086, 866, 16, 13, new_width);
						$('.lp-hotspot').css('width', wh + 'px');
						$('.lp-hotspot').css('height', wh + 'px');
						$('.lp-hotspot').css('line-height', wh + 'px');
						$('.lp-hotspot').css('font-size', fnt + 'px');

						$('.lp-hotspot').each(function(i, dom){
							var init_x	= parseInt($(dom).data('ix'));
							var init_y	= parseInt($(dom).data('iy'));

							var x		= init_x - (init_x / 100) * perc;
							$(dom).css('left',  Math.round(x) + 'px');

							var y		= init_y - (init_y / 100) * perc;
							$(dom).css('top',  Math.round(y) + 'px');
						});
					}
				}
			} else {
				this.imageMPS.mapster('resize', 1086, 650, 100);
				
				$('.lp-hotspot').each(function(i, dom){
					var init_x			= parseInt($(dom).data('ix'));
					var init_y			= parseInt($(dom).data('iy'));
					$(dom).css('left',  init_x + 'px');
					$(dom).css('top',  init_y + 'px');
				});
			}
		} else {
			if(w < 1100){
				this.imageMPS.mapster('resize', 0, 750, 100);
			} else {
				this.imageMPS.mapster('resize', 1086, 650, 100);
			}
		}
	}, 250);
};
CMPS.prototype.resize = function(w) {
	this.final_resize(w);
};
CMPS.prototype.hilight = function(key) {
	this.imageMPS.mapster('highlight', key);
};

/**********************************************************************************************************/
var mps_building = {
	cmps		: null,
	lastHovered	: null,
	buttons_hover_speed	: 150,
	
	
	init: function(selected_floor){
		mps_building.cmps	= new CMPS('#building', {fillColor:'ffffff', strokeColor:'ffffff', stroke:true}, mps_building, 'building');
		
		if(selected_floor !== ''){
			mps_building.hilight(selected_floor);
		}
	},
	
	resize: function(w){
		if(mps_building.cmps){ mps_building.cmps.resize(w); }
	},
	
	hilight: function(key){
		//mps_building.cmps.hilight(false); //!!!
		mps_building.cmps.hilight(key);
		//button & circle
		
		//$('.building-content-openbutton[data-spec="'+mps_building.lastHovered+'"]').delay(1).hide()
		$('.building-content-openbutton[data-spec="'+mps_building.lastHovered+'"]').stop(true,false).fadeOut(mps_building.buttons_hover_speed)
		if(mps_switcher.state == mps_switcher.STATE_BUILDING){
			$('.circle[data-spec="'+mps_building.lastHovered+'"]').addClass('pulse-button--inactive');
		}
		
		//$('.building-content-openbutton[data-spec="'+mps_building.lastHovered+'"]').delay(1).hide()
		$('.building-content-openbutton[data-spec="'+mps_building.lastHovered+'"]').stop(true,false).fadeOut(mps_building.buttons_hover_speed)
		if(mps_switcher.state == mps_switcher.STATE_BUILDING){
			$('.circle[data-spec="'+mps_building.lastHovered+'"]').addClass('pulse-button--inactive');
		}
		
		//$('.building-content-openbutton[data-spec="' + key + '"]').stop(true, false).fadeIn(0);
		$('.building-content-openbutton[data-spec="' + key + '"]').stop(true, false).fadeIn(mps_building.buttons_hover_speed);
		$('.circle[data-spec="' + key + '"]').removeClass('pulse-button--inactive');
		
		mps_building.lastHovered = key;
	},
	
	dehilight_under: function(){
		mps_building.cmps.hilight(false);
	},
	
	click: function(key){
		mps_switcher.watch(key);
	},
	
	over: function(data){
		//$('.building-content-openbutton[data-spec="'+data+'"]').delay(1).hide()
		//$('.building-content-openbutton[data-spec="'+data+'"]').stop(true,false).fadeOut(mps_building.buttons_hover_speed)
		if(mps_switcher.state == mps_switcher.STATE_BUILDING){
			$('.circle[data-spec="'+data+'"]').addClass('pulse-button--inactive');
		}
		
		//button & circle
		//$('.building-content-openbutton[data-spec="' + mps_building.lastHovered + '"]').hide();
		$('.building-content-openbutton[data-spec="' + mps_building.lastHovered + '"]').stop(true,false).fadeOut(mps_building.buttons_hover_speed)
		//$('.building-content-openbutton[data-spec="' + data + '"]').show()
		$('.building-content-openbutton[data-spec="' + data + '"]').stop(true,false).fadeIn(mps_building.buttons_hover_speed);
		
		$('.circle[data-spec="' + mps_building.lastHovered + '"]').addClass('pulse-button--inactive');
		$('.circle[data-spec="' + data + '"]').removeClass('pulse-button--inactive');
		mps_building.lastHovered = data;
	},
	
	out: function(data){
		//mps_building.cmps.hilight(false); //!!!
		//button & circle
		/*/
		$('.building-content-openbutton[data-spec="'+data+'"]').delay(1).hide()
		if(mps_switcher.state == mps_switcher.STATE_BUILDING){
			$('.circle[data-spec="'+data+'"]').addClass('pulse-button--inactive');
		}
		/**/
	},
	
	over_circle: function(spec){
		mps_building.cmps.hilight(false); //!!!
		mps_building.hilight(spec);
	},
	
	out_circle: function(data){
		//mps_building.cmps.hilight(false); //!!!
		/*/
		$('.building-content-openbutton[data-spec="'+data+'"]').delay(1).hide()
		if(mps_switcher.state == mps_switcher.STATE_BUILDING){
			$('.circle[data-spec="'+data+'"]').addClass('pulse-button--inactive');
		}
		/**/
	}
};

/**********************************************************************************************************/
var mps_floors = {
	aFLOORS		: new Array(),
	lastHovered	: null,
	popped		: false,
	curr_flat	: 0,
	
	init: function(){
		for(var i = 0; i < 5; i++){
			var aAREAS				= new Array();
			var l					= building[i]._flats.length;
			for(var j = 0; j < l; j++){
				var m_fillColor			= 'ffffff';
				var m_fillOpacity		= 0.4;
				
				switch(building[i]._flats[j].statuss){
					case '0': // free
						m_fillColor	= '45A847';
					break;
					
					case '1': // reserved
						m_fillColor	= 'ffd9b7';
						m_fillOpacity	= 0.8;
					break;
				}
				
				aAREAS.push({
						key		: building[i]._flats[j].key,
						staticState	: true, 
						selected	: true, 
						highlight	: false,
						isDeselectable	: false,
						fillColor	: m_fillColor,
						fillOpacity	: m_fillOpacity
					});
			}
			
			mps_floors.aFLOORS[i]			= new Object();
			mps_floors.aFLOORS[i].cmps		= new CMPS('#floor-' + i, {areas:aAREAS}, mps_floors, 'floor');
		}
	},
	
	resize: function(w){
		var l		= mps_floors.aFLOORS.length;
		for(var i = 0; i < l; i++){
			if(mps_floors.aFLOORS[i].cmps){ mps_floors.aFLOORS[i].cmps.resize(w); }
		}
	},
	
	click: function(key){
		mps_switcher.watch(key);
	},
	
	hilight: function(data){
		$('.lp-hotspot[data-spec="' + data + '"]').addClass('lp-hotspot--active');
		mps_floors.popuper(data, true);
	},
	
	over: function(data){
		mps_floors.popuper(data, true);
		$('.lp-hotspot[data-spec="' + mps_floors.lastHovered + '"]').removeClass('lp-hotspot--active');
		$('.lp-hotspot[data-spec="' + data + '"]').addClass('lp-hotspot--active');
		mps_floors.lastHovered = data;
	},
	
	out: function(data){
		if(mps_switcher.state == mps_switcher.STATE_FLOOR){
			$('.lp-hotspot[data-spec="'+data+'"]').removeClass('lp-hotspot--active');
		}
		mps_floors.popuper(false);
	},
	
	popuper: utl_debounce(function(data) {
		if(common.width > 992){
			if(data){
				if(mps_floors.curr_flat !== data){
					mps_floors.curr_flat	= data;
					
					var idx			= building_idx[data];
					var flat		= building[idx.floor]._flats[idx.flat];
					
					$('#pop-flat-num').text(flat.num);
					$('#pop-flat-area').text(flat.area);
					$('#pop-flat-rooms').text(flat.rooms);
					$('#pop-flat-price').text(flat.price);
				}
				
				if(!mps_floors.popped){
					mps_floors.popped	= true;
					$('.lp-tooltip').stop(true, false).fadeIn(400);
				}
			} else {
				if(mps_floors.popped){
					mps_floors.popped	= false;
					$('.lp-tooltip').stop(true, false).fadeOut(400);
				}
			}
		} else {
			if(mps_floors.popped){
				mps_floors.popped	= false;
				$('.lp-tooltip').stop(true, false).fadeOut(400);
			}
		}
	}, 100)
}

/**********************************************************************************************************/
var mps_switcher = {
	/* 650px, 750px, 1348px, 1348px */
	
	STATE_BUILDING		: 0,
	STATE_FLOOR		: 1,
	STATE_FLAT		: 2,
	
	state			: 0,
	small_flas_list_height	: 750,
	lslider			: null,
	lslider_images_cnt	: 0,
	
	init: function(selected_floor){
		mps_building.init(selected_floor);
		mps_floors.init();
		
		if(common.device == 'pc'){
			$('.floor-content').mousemove(function( event ) {
				if(mps_switcher.state == mps_switcher.STATE_FLOOR && common.width > 992){
					var x	= event.pageX - $(this).offset().left - 104;
					var y	= event.pageY - $(this).offset().top - 156;

					if(y  < 0){
						y	= y + 190;
						if( !$('.lp-tooltip ').hasClass('lp-tooltip--bottom')){
							$('.lp-tooltip ').addClass('lp-tooltip--bottom')
						}
					} else {
						if( $('.lp-tooltip ').hasClass('lp-tooltip--bottom')){
							$('.lp-tooltip ').removeClass('lp-tooltip--bottom')
						}
					}

					$('.lp-tooltip').css('left', x + 'px');
					$('.lp-tooltip').css('top', y + 'px');
				}
			});
		}
		
		$('body').on('vclick', '.flat-content-pad-go--left', function(){
				if( !$(this).hasClass('lp-gallery-dir--inactive') ){
					if(mps_switcher.lslider){
						mps_switcher.lslider.goToPrevSlide(); 
					}
				}
			});
		$('body').on('vclick', '.flat-content-pad-go--right', function(){
				if( !$(this).hasClass('lp-gallery-dir--inactive') ){
					if(mps_switcher.lslider){
						mps_switcher.lslider.goToNextSlide(); 
					}
				}
			});
	},
	
	resize: function(w){
		mps_building.resize(w);
		mps_floors.resize(w);
		
		if(common.width > 992){
			if(common.width > 1100){
				$('.lp-building__inner').css('height', '650px');
			} else {
				$('.lp-building__inner').css('height', '750px');
			}
		} else {
			$('.lp-building__inner').css('height', '750px');
			
			if(mps_switcher.state == mps_switcher.STATE_FLOOR){
				$('.lp-building__inner').css('height', (mps_switcher.small_flas_list_height + 250) + 'px');
			} else if(mps_switcher.state == mps_switcher.STATE_FLAT){
				
				if(common.width <= 768){
					$('.lp-building__inner').css('height', '1348px'); // small flat container height
				} else {
					$('.lp-building__inner').css('height', '1348px'); 
				}
			}
		}
		
		var pager_height	= $('.flat-content-gallery-outer').children('.lSSlideOuter').children('.lSPager').height();
		var earr_height		= $('.flat-content-pad-go').height();
		var arr_bottom		= Math.round(pager_height * 0.5 - earr_height * 0.5);
		$('.flat-content-pad-go').css('bottom', arr_bottom + 'px');
	},
	
	/*NEW*/
	switch_key		: null,
	switch: function(key){
		console.log('switch: ', key);
		
		//hide flat
		//mps_switcher.ret(mps_switcher.STATE_FLAT);
		url_path.flat_url		= '';
		$('#u-flat').val('');
		if(common.width <= 992){
			$('.lp-building__inner').css('height', (mps_switcher.small_flas_list_height + 220) + 'px');
		} else {
			if(common.width > 1100){
				$('.lp-building__inner').css('height', '650px');
			} else {
				$('.lp-building__inner').css('height', '750px');
			}
		}
		$('.map__flat').stop(true, false).fadeOut(300, function(){
			$('.flat-content').transition({opacity:0}, 0);
			//clear gallery
			if(mps_switcher.lslider){
				mps_switcher.lslider.destroy();
			}
			$('#flat-image-gallery').empty();
			$('.flat-content-pad').children('.flat-content-pad-go').remove();
		});
		
		
		//hide curr floor
		url_path.floor_url		= '';
		if(common.width > 1100){
			$('.lp-building__inner').css('height', '650px');
		} else {
			$('.lp-building__inner').css('height', '750px');
		}
		
		mps_switcher.switch_key		= key;
		$('.circle').each(function(i, dom){
			var spec		= $(dom).data('spec');
			if(spec == mps_switcher.switch_key ){
				$(dom).removeClass('pulse-button--inactive');
				$(dom).addClass('pulse-button--static');
			} else {
				$(dom).addClass('pulse-button--inactive');
				$(dom).removeClass('pulse-button--static');
			}
		});
		
		$('.map__floor').stop(true, false).fadeOut(300, function(){
			$('.floor-map').hide();
			
			//show needed floor
			mps_switcher.state		= mps_switcher.STATE_BUILDING;
			mps_switcher.watch(mps_switcher.switch_key);
		});
		
		//reset path
		url_path.set_path(false);
	},
	/*NEW*/
	hilight_under: function(key, bHilight){
		if(bHilight){
			$('.circle[data-spec="'+key+'"]').removeClass('pulse-button--inactive');
		} else {
			if(!$('.circle[data-spec="'+key+'"]').hasClass("pulse-button--static")){
				$('.circle[data-spec="'+key+'"]').addClass('pulse-button--inactive');
			}
		}
	},
	
	watch: function(key, change_url){
		change_url		= change_url || true;
		
		switch(mps_switcher.state){
			case mps_switcher.STATE_BUILDING:
				if($('.floor-map[data-name="' + key + '"]').length == 0){
					change_url			= false;
					break;
				}
				
				url_path.floor_url			= key;
				
				//set exact floor inside to visible then:
				$('.floor-map[data-name="' + key + '"]').show();
				$('.map__floor').stop(true, false).fadeIn(300);
				mps_switcher.state			= mps_switcher.STATE_FLOOR;
				
				//make small container visible @ one moment to detect inner components height
				var small_ref				= $('.floor-map[data-name="'+key+'"]').children('.floor-content__small-floor');
				small_ref.addClass('lp-visible');
				mps_switcher.small_flas_list_height	= $('.small-floor[data-name="'+key+'"]').children('.small-floor-scroller').height();
				small_ref.removeClass('lp-visible');
				
				if(common.width <= 992){
					$('.lp-building__inner').css('height', (mps_switcher.small_flas_list_height + 250) + 'px');
				}
				
				$('.circle').each(function(i, dom){
					if( !$(dom).hasClass('pulse-button--inactive') ){
						$(dom).addClass('pulse-button--static');
					}
				});
			break;
			
			case mps_switcher.STATE_FLOOR:
				url_path.flat_url			= key;
				
				//set exact flat inside to visible then:
				if(common.width <= 992){
					if(common.width <= 768){
						$('.lp-building__inner').css('height', '1348px'); // small flat container height
					} else {
						$('.lp-building__inner').css('height', '1348px'); 
					}
				} else {
					if(common.width > 1100){
						$('.lp-building__inner').css('height', '650px');
					} else {
						$('.lp-building__inner').css('height', '750px');
					}
				}
				mps_switcher.state	= mps_switcher.STATE_FLAT;
				
				$('.map__flat').stop(true, false).fadeIn(300);

				$.ajax({
					type		: "POST",
					url		: common.url_base + common.lang +'/actions/flat',
					data: {	
						flat	: key,
					}
				}).done(function( msg ) {
					if(msg['status'] == 'ok'){
						$('.map__flat--title').text(msg['data']['title']);
						
						// vertical height FIX for iPad (plugin does not expand vertically if image has auto height)
						var device_h_fix	= '';
						if(common.device == 'tablet'){
							device_h_fix	= 'style="min-height:388px;"';
							//$('.lSSlideOuter .lSPager.lSGallery li.active a img').css('min-height', '72px');
						}
						
						//build gallery html
						var szHTML	= '';
						szHTML		+= '<li data-thumb="' + common.url_base + 'assets/uploads/flat/thumb/' + msg['data']['image'] + '" data-src="' + common.url_base + 'assets/uploads/flat/' + msg['data']['image'] + '">';
						szHTML		+=	'<div style="border:1px solid #d4d4d4">';
						szHTML		+=		'<img src="' + common.url_base + 'assets/uploads/flat/medium/' + msg['data']['image'] + '" ' + device_h_fix + ' />';
						szHTML		+=	'</div>';
						szHTML		+= '</li>';
						
						var path	= common.url_base + 'assets/uploads/galleries/'
						mps_switcher.lslider_images_cnt = 1;
						
						if(msg['data']['gallery']['images']){
							var l		= msg['data']['gallery']['images'].length;
							for(var i = 0; i < l; i++){
								szHTML	+= '<li data-thumb="' + path + 'thumb/' + msg['data']['gallery']['images'][i] + '" data-src="' + path + msg['data']['gallery']['images'][i] + '">';
								szHTML	+=	'<div style="border:1px solid #d4d4d4">';
								szHTML	+=		'<img src="' + path + 'medium/' + msg['data']['gallery']['images'][i] + '" ' + device_h_fix + ' />';
								szHTML	+=	'</div>';
								szHTML	+= '</li>';
							}
							
							mps_switcher.lslider_images_cnt = l + 1;
						}
						
						$('#flat-image-gallery').css('opacity', 0);
						
						$('#flat-image-gallery').append(szHTML)

						if(mps_switcher.lslider_images_cnt > 1){
							szHTML		= '';
							szHTML		+= '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 18" class="flat-content-pad-dir lp-gallery-dir--left flat-content-pad-go flat-content-pad-go--left flat-content-pad-go--inactive" style="bottom: 28px; opacity: 1;"><path class="lp-svg-filler" fill="#bfbfbf" d="M11.63 15.69L3.37 9l8.26-6.69c.37-.44.3-1.09-.13-1.46a1.04 1.04 0 0 0-1.46.14l-8.8 7.35a1.03 1.03 0 0 0 0 1.32l8.8 7.36a1.04 1.04 0 0 0 1.59-1.33z"></path></svg>';
							szHTML		+= '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="18" viewBox="0 0 11 18" class="flat-content-pad-dir lp-gallery-dir--right flat-content-pad-go flat-content-pad-go--right " style="bottom: 28px; opacity: 1;"><path class="lp-svg-filler" fill="#bfbfbf" d="M.25 15.28L8.6 8.5.25 1.72A1.05 1.05 0 0 1 1.85.38l8.91 7.45a1.06 1.06 0 0 1 0 1.34l-8.91 7.45c-.37.45-1.02.51-1.47.14a1.06 1.06 0 0 1-.13-1.48z"></path></svg>';
							$('.flat-content-pad').append(szHTML);
						}
						
						mps_switcher.lslider = $('#flat-image-gallery').lightSlider({
							gallery			: true,
							item			: 1,
							thumbItem		: 5,
							slideMargin		: 0,
							enableDrag		: false,
							currentPagerPosition	:'middle',
							useCSS			: false,
							
							onSliderLoad: function(el) {
								$('#flat-image-gallery').transition({opacity:1}, 400, function(){
									if(mps_switcher.lslider_images_cnt > 1){
										//$(window).resize();
										$('.flat-content-pad-dir').stop(true, false).transition({opacity:1}, 600);
									}
								});
								
								el.lightGallery({
									selector: '#flat-image-gallery .lslide'
								});
							},
							
							onBeforeSlide: function (el) {
								var curr	= mps_switcher.lslider.getCurrentSlideCount();
								if(curr == 1){
									$('.flat-content-pad-go--left').addClass('flat-content-pad-go--inactive');
								} else {
									$('.flat-content-pad-go--left').removeClass('flat-content-pad-go--inactive');
								}
								if(curr == mps_switcher.lslider_images_cnt){
									$('.flat-content-pad-go--right').addClass('flat-content-pad-go--inactive');
								} else {
									$('.flat-content-pad-go--right').removeClass('flat-content-pad-go--inactive');
								}
							},							
						});
						
						$('#flat-desc-floor').text(msg['data']['floor']);
						$('#flat-desc-area').text(msg['data']['area']);
						$('#flat-desc-balcony').text(msg['data']['balcony']);
						$('#flat-desc-rooms').text(msg['data']['rooms']);
						
						var status_id		= parseInt(msg['data']['statuss'], 10);
						var status_str		= locale.legend[status_id];
						$('#flat-desc-statuss').text(status_str);
						$('#flat-desc-statuss').removeClass('status-0');
						$('#flat-desc-statuss').removeClass('status-1');
						$('#flat-desc-statuss').removeClass('status-2');
						$('#flat-desc-statuss').addClass('status-' + msg['data']['statuss']);
						
						var price_formatted	= utl_number_format(msg['data']['price'], 2, '.', ' ');
						var aTMP		= price_formatted.split('.');
						if(aTMP[1] == '00'){
							price_formatted	= aTMP[0];
						}
						$('#flat-desc-statuss-price').text(price_formatted);
						
						if(status_id == 0){
							$('#subscribe-flat').data('spec', msg['data']['num']);
							$('#subscribe-flat').show();
						} else {
							$('#subscribe-flat').hide();
						}
						
						$('.flat-content').transition({opacity:1}, 400, function(){
							$('.map__floor').hide();
						});
					} else {
						toastr.warning("Server error, please try again!", "error");
					}
				}).fail(function() {
					toastr.warning("Server error, please try again!", "error");
				}).always(function() {
				});					
			break;
		}
		
		if(change_url){
			url_path.set_path(true);
		}
	},
	
	ret: function(custom_state){
		
		switch(mps_switcher.state){
			case mps_switcher.STATE_FLOOR:
				url_path.floor_url		= '';
				
				$('.map__floor').stop(true, false).fadeOut(300, function(){
					$('.floor-map').hide();
				});
					
				mps_switcher.state	= mps_switcher.STATE_BUILDING;
				
				if(common.width > 1100){
					$('.lp-building__inner').css('height', '650px');
				} else {
					$('.lp-building__inner').css('height', '750px');
				}
				
				$('.circle').removeClass('pulse-button--static');
			break;
			
			case mps_switcher.STATE_FLAT:
				url_path.flat_url		= '';
				
				$('#u-flat').val('');
				
				if(common.width <= 992){
					$('.lp-building__inner').css('height', (mps_switcher.small_flas_list_height + 220) + 'px');
				} else {
					if(common.width > 1100){
						$('.lp-building__inner').css('height', '650px');
					} else {
						$('.lp-building__inner').css('height', '750px');
					}
				}
				
				$('.map__floor').show();
				$('.map__flat').stop(true, false).fadeOut(300, function(){
					$('.flat-content').transition({opacity:0}, 0);
					
					//clear gallery
					if(mps_switcher.lslider){
						mps_switcher.lslider.destroy();
					}
					$('#flat-image-gallery').empty();
					
					$('.flat-content-pad').children('.flat-content-pad-go').remove();
				});
				mps_switcher.state	= mps_switcher.STATE_FLOOR;
			break;
		}
		
		url_path.set_path(false);
	},
	
	watch_url: function(){
		if(url_path.floor_url != ''){
			mps_switcher.state		= mps_switcher.STATE_BUILDING;
			mps_switcher.watch(url_path.floor_url, false);
			
			$('.circle').each(function(i, dom){
				var spec		= $(dom).data('spec');
				if(spec == url_path.floor_url ){
					$(dom).addClass('pulse-button--static');
				} else {
					$(dom).addClass('pulse-button--inactive');
				}
			});
			
			if(url_path.flat_url != ''){
				//console.log('OPEN:FLAT:', url_path.flat_url);
				mps_switcher.state	= mps_switcher.STATE_FLOOR;
				mps_switcher.watch(url_path.flat_url, false);
			}
		}
	}
};

/**********************************************************************************************************/
var url_path = {
	floor_url				: '',
	flat_url				: '',
	full_path				: '',
	
	lock_hash				: false,
	
	//invoked @ unimportant init
	init: function(){
		if(common.history_api){
			var aTMP		= String(common.uri).split('/');
		} else {
			if(window.location.hash != ''){
				var clear_hash	= String(window.location.hash).split('#');
				var aTMP	= String('/' + clear_hash[1] ).split('/');
			} else {
				var aTMP	= ['',''];
			}
		}
		
		url_path.floor_url		= aTMP[1];
		url_path.full_path		= aTMP[1];
		if(aTMP.length == 3){
			url_path.flat_url	= aTMP[2];
			url_path.full_path	= url_path.full_path + '/' + aTMP[2];
		}
		
		if(aTMP.length > 1){
			mps_switcher.watch_url();
		}
		
		if(common.history_api){
			window.onpopstate		= function( event ){
				if(mps_switcher.state > mps_switcher.STATE_BUILDING){
					mps_switcher.ret();
				} else {
					window.location.href = common.url_base + common.lang + '/';
				}
			}
		} else {
			window.onhashchange		= function(){
				if(url_path.lock_hash){
					url_path.lock_hash = false;
				} else {
					if(mps_switcher.state > mps_switcher.STATE_BUILDING){
						mps_switcher.ret();
						url_path.lock_hash = false;
					} else {
						window.location.href = common.url_base + common.lang + '/';
					}
				}
			}
		}
	},
	
	set_path: function(lock){
		url_path.full_path		= '';
		
		if(url_path.floor_url != '' && url_path.floor_url != undefined){
			url_path.full_path	+= url_path.floor_url;
			mps_building.over(url_path.floor_url);
		}
		
		if(url_path.flat_url != '' && url_path.flat_url != undefined){
			url_path.full_path	+= '/' + url_path.flat_url;
		}
		
		if(common.history_api){
			var combined_url	= common.url_base + common.lang + '/' + url_path.full_path;
			var stateObj		= { 
							name: "liepasnams",
							href: combined_url
						};
			window.history.pushState(stateObj, "liepasnams" , combined_url);
		} else {
			var combined_url	= url_path.full_path;
			url_path.lock_hash	= true;
			window.location.hash	= combined_url;
		}
	}
};
