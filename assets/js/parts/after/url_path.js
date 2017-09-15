var url_path = {
	lock_hash				: false,
	
	//invoked @ unimportant init
	init: function(){
		if(common.history_api){
			if(window.onpopstate){
				window.onpopstate	= function( event ){
					// in case we need to jump somwhere:
					//window.location.href = common.url_base + common.lang + '/' + ...;
				}
			}
		} else {
			window.onhashchange		= function(){
				if(url_path.lock_hash){
					url_path.lock_hash = false;
				} else {
					// in case we need to jump somwhere:
					//window.location.href = common.url_base + common.lang + '/' + ...;
				}
			}
		}
	},
	
	set_path: function(new_path){
		if(common.history_api){
			var combined_url	= common.url_base + common.lang + '/' + new_path;
			var stateObj		= { 
							name: "projectname",
							href: combined_url
						};
			window.history.pushState(stateObj, "projectname" , combined_url);
		} else {
			var combined_url	= new_path;
			url_path.lock_hash	= true;
			window.location.hash	= combined_url;
		}
	}
};