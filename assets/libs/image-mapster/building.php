<script>
	function utl_number_format(number,decimals,dec_point,thousands_sep) {
		number		= number*1;//makes sure `number` is numeric value
		var str		= number.toFixed(decimals?decimals:0).toString().split('.');
		var parts	= [];
		for ( var i=str[0].length; i>0; i-=3 ) {
		    parts.unshift(str[0].substring(Math.max(0,i-3),i));
		}
		str[0]		= parts.join(thousands_sep?thousands_sep:',');
		return str.join(dec_point?dec_point:'.');
	}	
	
	var building		= new Array();
	var building_idx	= new Array();
	var selected_floor	= '';
	<? 
	$i = 0;
	foreach($building_data as $bld){ 
	?>
	building[<?=$i;?>]		= new Object();
	
	<? if($bld['active']){ ?>
		selected_floor		= '<?=$bld['link'];?>';
	<? } ?>
	
	
	building[<?=$i;?>]._flats	= new Array();
		<? 
		$j = 0;
		foreach($bld['flats'] as $flat){ 
		?>
			
		var price_formatted	= utl_number_format('<?=$flat['price'];?>', 2, '.', ' ');
		var aTMP		= price_formatted.split('.');
		if(aTMP[1] == '00'){
			price_formatted	= aTMP[0];
		}
			
			
		building[<?=$i;?>]._flats.push({
				key	: '<?=$flat['link'];?>',
				statuss	: "<?=$flat['statuss'];?>",
				num	: "<?=$flat['num'];?>",
				area	: "<?=$flat['area'];?>",
				rooms	: "<?=$flat['rooms'];?>",
				price	: price_formatted
			});
			
		building_idx['<?=$flat['link'];?>'] = {
							floor: <?=$i;?>,
							flat : <?=$j++;?>
							};
		<? } ?>
	<? 
	$i++;
	} ?>
</script>

<div class="lp-building">
	<div class="lp-building__inner">
		<div class="lp-building__floors">
			
			<div class="floors floors-base">
				<div class="floors floors-base--ali">
					<? if(!APP_IE9ORLESS){ ?>
					<div class="floors-base-verttext"><?=l('building-stavi');?></div>
					<? } ?>
				</div>
				<div class="floors-base-vertline"></div>
				
				<div class="floors-base-circles absolute">
					<? 
					$i = 0;
					foreach($building_data as $bld){ ?>
					<span class='pulse-button pulse-button--inactive circle circle-<?=$i;?> absolute <?=(APP_DEVICE == 'pc' ? 'button-action' : '');?> button-action-hover' data-action="watch-circle" data-spec="<?=$bld['link'];?>"><?=$bld['num'];?>.</span>
					<? 
					$i++;
					} ?>
				</div>
				
				<div class="floors-base__map">
					<div class="map map__building">
						<div class="building-content">
							<map name="building">
								<? foreach($building_data as $bld){ ?>
								<area href="#" shape="poly" name="<?=$bld['link'];?>"  coords="<?=$bld['region'];?>">
								<? } ?>
							</map>
							<img id="building" class="building-content-img" usemap="#building" src="<?=APP_URL_BASE;?>assets/uploads/mainpage/<?=$mainpage->flats_image_building;?>">
							
							<? 
							$i = 0;
							foreach($building_data as $bld){ ?>
							<div class="lp-button building-content-openbutton building-content-openbutton-<?=$i;?> button-action button-action-hover absolute" data-action="watch" data-spec="<?=$bld['link'];?>"><?=l('building-watch');?></div>
							<? 
							$i++;
							} ?>
						</div>
						
						<h1 class="map__building--title"><?=$mainpage->flats_subtitle;?></h1>
					</div>
					
					<div class="map map__floor">
						<div class="floor-content relative">
							<? 
							$i = 0;
							foreach($building_data as $bld){ ?>
							<div class="floor-map absolute" data-name="<?=$bld['link'];?>" data-i="<?=$i;?>">
								<span class="floor-content__big-floor">
								<!-- BIG PART -->
								<map name="floor-<?=$i;?>">
								<? foreach($bld['flats'] as $flat){ ?>
								<area href="#" shape="poly" name="<?=$flat['link'];?>"  coords="<?=$flat['region'];?>">
								<? } ?>
								</map>
								<img id="floor-<?=$i;?>" class="building-content-img" usemap="#floor-<?=$i;?>" src="<?=APP_URL_BASE;?>assets/uploads/floor/<?=$bld['image'];?>">
								
								<? 
								$j		= 0;
								foreach($bld['flats'] as $flat){ 
									$status			= 'sold';
									switch($flat['statuss']){
										case 0: $status = 'free'; break;
										case 1: $status = 'reserved'; break;
									}
									$aHOT_POS	= explode(',', $flat['hotspot']);
								?>
									<div class="lp-hotspot lp-hotspot--<?=$status;?> absolute button-action button-action-hover" data-action="open" data-spec="<?=$flat['link'];?>" data-ix="<?=$aHOT_POS[0]?>" data-iy="<?=$aHOT_POS[1]?>" style="left:<?=$aHOT_POS[0]?>px;top:<?=$aHOT_POS[1]?>px;"><?=$flat['num'];?></div>
								<? 
								$j++;
								} ?>
								
								<h1 class="map__floor--title absolute"><?=$bld['title'];?></h1>
								<div class="map__floor--sea absolute"><?=l('floor-sea');?></div>
								<div class="map__floor--inner absolute"><?=l('floor-inner');?></div>
								<img class="map__floor--compass absolute" src="<?=APP_URL_BASE;?>assets/img/compass.svg" alt="">
								<div class="floor-legend absolute">
									<span class="floor-legend-dot floor-legend--free"></span>
									<span class="floor-legend--text"><?=l('legend-free');?></span>
									<span class="floor-legend-dot floor-legend--reserved"></span>
									<span class="floor-legend--text"><?=l('legend-reserved');?></span>
									<span class="floor-legend-dot floor-legend--sold"></span>
									<span class="floor-legend--text"><?=l('legend-sold');?></span>
								</div>
								<div class="lp-button lp-button--back floor-content--back absolute button-action" data-action="back"><?=l('back');?></div>
								</span>
								
								<!-- SMALL PART -->
								
								<span class="floor-content__small-floor">
									<div class="small-floor absolute" data-name="<?=$bld['link'];?>">
										<div class="lp-button lp-button--back floor-content--back-floor absolute button-action" data-action="back"><?=l('back');?></div>
										<h1 class="small-floor--title absolute"><?=$bld['title'];?></h1>
										<div class="small-floor-scroller">
											
											<div class="flat-line-header">
												<div class="flat-line-header-content">
													<div class="flat-line-header-data flat-line-header-data-num"><?=l('flat-small-nr');?></div>
													<div class="flat-line-header-data flat-line-header-data-rooms"><?=l('flat-small-rooms');?></div>
													<div class="flat-line-header-data flat-line-header-data-area"><?=l('flat-small-area');?></div>
													<div class="flat-line-header-data flat-line-header-data-price"><?=l('flat-small-price');?></div>
												</div>
											</div>
										<? 
										$j				= 0;
										foreach($bld['flats'] as $flat){ 
										?>
											<div class="flat-line">
												<div class="flat-line-content">
													<div class="flat-line-data-border">
														<div class="flat-line-data flat-line-data-num"><?=$flat['num'];?></div>
														<div class="flat-line-data flat-line-data-rooms"><?=$flat['rooms'];?></div>
														<div class="flat-line-data flat-line-data-area"><?=$flat['area'];?></div>
														<div class="flat-line-data flat-line-data-price"><?=$flat['price'];?></div>
													</div>
													
													<?
													switch($flat['statuss']){
														case 0:
														?>
														<div class="flat-line-button flat-line-button--free button-action" data-action="open" data-spec="<?=$flat['link'];?>"><?=l('legend-free');?></div>
														<?
														break;
														case 1:
														?>
														<div class="flat-line-button flat-line-button--reserved button-action" data-action="open" data-spec="<?=$flat['link'];?>"><?=l('legend-reserved');?></div>
														<?
														break;
														default:
														?>
														<div class="flat-line-button flat-line-button--sold button-action" data-action="open" data-spec="<?=$flat['link'];?>"><?=l('legend-sold');?></div>
														<?
													}
													?>
												</div>
											</div>
										<?
										$j++;
										} ?>
										</div>
									</div>
								</span>
							</div>
							<? 
							$i++;
							} ?>
							
							<div class="lp-tooltip">
								<div class="lp-tooltip-title"><?=l('flat-num');?> <span id="pop-flat-num"></span></div>
								<div class="lp-tooltip-hr"></div>
								<table class="lp-tooltip-table">
									<tbody>
										<tr>
											<td><?=l('tooltip-area');?>:</td>
											<td class="lp-tooltip-table--bold"><span id="pop-flat-area"></span> m2</td>
										</tr>
										<tr>
											<td><?=l('tooltip-rooms');?>:</td>
											<td class="lp-tooltip-table--bold"><span id="pop-flat-rooms"></span></td>
										</tr>
										<tr>
											<td><?=l('tooltip-price');?>:</td>
											<td class="lp-tooltip-table--bold"><span id="pop-flat-price"></span> €</td>
										</tr>
									</tbody>
								</table>
							</div>							
						</div>
					</div>
					
					<div class="map map__flat">
						<div class="flat-content relative map__flat-printarea">
							<h1 class="map__flat--title relative"><?=l('flat-num');?></h1>
							
							<div class="col-md-7- flat-content-pad relative">
								<div class="flat-content-gallery-outer relative">
									<ul id="flat-image-gallery" class="flat-content-gallery-container relative">
									</ul>
								</div>
							</div>
							
							<div class="col-md-5- row- flat-content-info relative">
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key"><?=l('flat-desc-floor');?>:</div>
									<div class="flat-content-infoblock-value"><span id="flat-desc-floor"></span>.</div>
								</div>
								
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key"><?=l('flat-desc-area');?>:</div>
									<div class="flat-content-infoblock-value"><span id="flat-desc-area"></span> m<sup>2</sup></div>
								</div>
								
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key"><?=l('flat-desc-balcony');?>:</div>
									<div class="flat-content-infoblock-value"><span id="flat-desc-balcony"></span> m<sup>2</sup></div>
								</div>
								
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key"><?=l('flat-desc-rooms');?>:</div>
									<div id="flat-desc-rooms" class="flat-content-infoblock-value"></div>
								</div>
								
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key"><?=l('flat-desc-statuss');?>:</div>
									<div id="flat-desc-statuss" class="flat-content-infoblock-value"></div>
								</div>
								
								<div class="flat-content-infoblock">
									<div class="flat-content-infoblock-key flat-content-infoblock-key--price"><?=l('flat-desc-price');?>:</div>
									<div class=" flat-content-infoblock-value--price"><span id="flat-desc-statuss-price"></span> €</div>
								</div>
								
								
								<button id="subscribe-flat" class="lp-button lp-button--green button-action" data-action="subscribe-flat" data-spec=""><?=l('apply-for-viewing');?></button>
							</div>
							
							<div class="lp-button lp-button--back flat-content--back absolute button-action" data-action="back"><?=l('back');?></div>
						</div>
						
						<img class="map__flat-print button-action absolute" data-action="print" data-spec="" src="<?=APP_URL_BASE;?>assets/img/print.svg" alt="">
					</div>
				</div>
			</div>
			
		</div>
	</div>
</div>

<script>
	$(document).ready(function(){
		mps_switcher.init(selected_floor);
	});
</script>