var soc = {
	update_twitter: function(score){
		var szTwitter				= String(common.TW_REZULT).split('@#@').join(score);
		$('#twitter_share').attr('href', szTwitter);
	},
	
	share: function(social, score){
		switch(social){
			case 'facebook':{
				var szDESC		= String(common.FB_DESC).split('@#@').join(score);
					
				FB.ui({
					method:		'feed',
					name:		common.FB_TITLE,
					link:		common.FB_LINK,
					picture:	common.FB_PIC,
					description:	szDESC
					},
					function(response) {
						if(response && response.post_id !== 'null'){
							soc.responce('facebook');
						}
					}
				);
			}
			break;

			case 'tw':{}break;

			case 'draugiem':{
				var szDESC		= String(common.DR_TEXT).split('@#@').join(score);
					
				window.open(
					'https://www.draugiem.lv/say/ext/add.php?title=' + encodeURIComponent( common.DR_TITLE ) +
					'&text=' + encodeURIComponent( szDESC ) +
					'&link=' + encodeURIComponent( common.DR_URL + '?xxx' ) +
					'&titlePrefix=' + encodeURIComponent(common.DR_ORANGE_TITLE) +
					'&callback=' + common.DR_RESPONCE,
					'',
					'location=1,status=1,scrollbars=0,resizable=0,width=640,height=480'
				);
			}
			break;
		}
	},
	responce: function(soc){
		console.log('soc.responce(' + soc + ')');
	}	
};