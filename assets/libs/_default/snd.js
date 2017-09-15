var snd = {
	bSound						: null,
	aSOUNDS						: null,
	bLoaded						: null,
	
	init: function(){
		snd.bSound				= true;
		snd.aSOUNDS				= new Array();
		snd.bLoaded				= false;
	},
	
	add: function(szID, szPath){
		snd.aSOUNDS[szID]			= document.getElementById(szPath);
		 
	},
	
	play: function(szID){
		snd.aSOUNDS[szID].play();
	},
		
	pause: function(szID){
		snd.aSOUNDS[szID].pause();
	},
	
	onoff: function(){
		snd.bSound				= !snd.bSound;
		
		for(var o in snd.aSOUNDS){
			if(snd.bSound){
				snd.aSOUNDS[o].play();
			} else {
				snd.aSOUNDS[o].pause();
			}
		}
	}
};