var cookie = {
        set: function(cname, cvalue, exdays){
		var d		= new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var exp		= "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + exp;
        },
        setExp: function(cname,cvalue,expires){
		var d		= new Date(expires);
		var exp		= "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + exp;
        },
        get: function(cname){
		var name	= cname + "=";
		var ca		= document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
			var c	= ca[i].trim();
			if (c.indexOf(name)===0) return c.substring(name.length,c.length);
		}
		return "";
        }
};
//cookie.set('lb_age_legal', 'yes', 7);
//if (cookie.get('lb_age_legal') == 'yes'){