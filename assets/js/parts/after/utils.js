function utl_isModernBrowser(){
	//this is modern HTML5 browser - load cool scripts
	return 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window;
}

function setup_formfield(DOM){
	DOM.focus(function(){
		var sz_deftxt			= $(this).data('def');
		var sz_name			= $(this).val();
		if( sz_name === '' ||  sz_name === sz_deftxt){
			$(this).val('');
		}
		$(this).removeClass('error-red');
	});
	DOM.blur(function(){
		var sz_deftxt			= $(this).data('def');
		var sz_name			= $(this).val();
		if( sz_name === '' ||  sz_name === sz_deftxt){
			$(this).val(sz_deftxt);
		}
	});
	DOM.val( DOM.data('def') );
}

function utl_clientWindowSize(){
	var tmpW					= window.innerWidth || document.documentElement.clientWidth;
	var tmpH					= window.innerHeight || document.documentElement.clientHeight;
	return [tmpW, tmpH];
}

function utl_getScrollTop(){
        var scrOfY 					= 0;
        if( typeof( window.pageYOffset ) === "number" ){ //Netscape compliant
                scrOfY 					= window.pageYOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) { //DOM compliant
                scrOfY 					= document.body.scrollTop;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) { //IE6 Strict
                scrOfY 					= document.documentElement.scrollTop;
        }
        return scrOfY;
}

function utl_urlParam(szName){
	var results 					= new RegExp('[\\?&]' + szName + '=([^&#]*)').exec(window.location.href);
	if(results === null){
		return null;
	}
	return results[1] || 0;
}

function utl_email(inputEmail){
	//check for spaces
	if (inputEmail.indexOf(" ") > 0){
		return false;
	}
	//bust the email apart into what comes before the @ and what comes after
	var emailArray	 				= inputEmail.split("@");
	
	//make sure there's exactly one @ symbol also make sure there's at least one character before and after the @
	if (emailArray.length !== 2 || emailArray[0].length === 0 || emailArray[1].length === 0) {
		return false;
	}
	
	//bust apart the stuff after the @ apart on any . characters
	var postArray					= emailArray[1].split(".");
	
	//make sure there's at least one . after the @
	if (postArray.length < 2) {
		return false;
	}
	
	//make sure there's at least 1 character in in each segment before, between and after each .
	for (var i = 0; i < postArray.length; i++) {
		if (postArray[i].length < 1) {
			return false;
		}
	}
	
	//get what is left after the last .
	var suffix					= postArray[postArray.length - 1];
	
	//make sure that the segment at the end is either 2 or 3 characters
	if (suffix.length < 2 || suffix.length > 3) {
		return false;
	}
	
	//it passed all tests, it's a valid email
	return true;
}

function utl_delegate(that, thatMethod){
	return function(param) { return thatMethod.call(that, param); };
}

function utl_buildStringWithis(szString, aParams, szDelimiter){
	var szResult					= "";
	var aSTRARR					= szString.split(szDelimiter);
	var l						= aSTRARR.length;
	
	for(var i = 0; i < l; i++){
		var sz	 				= aParams[i];
		if (sz === null){
			sz 				= "";
		}
		szResult 				+= (aSTRARR[i] + " "+sz+" ");
	}
	
	return szResult;
}

function utl_loadPage(url, szDom){
	//url - addr/file.html
	$.post(url, function(data){
		$(szDom).css('opacity', '0');
		$(szDom).html(data);
		$(szDom).animate({opacity:'1'}, 300);
	});
}

function utl_msToTime(miliseconds) {
	var milliseconds	= parseInt((miliseconds%1000)/100)
	var seconds		= parseInt((miliseconds/1000)%60)
        var minutes		= parseInt((miliseconds/(1000*60))%60)
        var hours		= parseInt((miliseconds/(1000*60*60))%24);
	return [hours, minutes, seconds, milliseconds];
}

function utl_msToTimeSZ(miliseconds) {
	var milliseconds	= parseInt((miliseconds%1000)/100)
	var seconds		= parseInt((miliseconds/1000)%60)
        var minutes		= parseInt((miliseconds/(1000*60))%60)
        var hours		= parseInt((miliseconds/(1000*60*60))%24);

	hours			= (hours < 10) ? "0" + hours : hours;
	minutes			= (minutes < 10) ? "0" + minutes : minutes;
	seconds			= (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

/*
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20131010
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func
 */
 
 /*
 callPlayer("whateverID", function() {
    // This function runs once the player is ready ("onYouTubePlayerReady")
    callPlayer("whateverID", "playVideo");
});
// When the player is not ready yet, the function will be queued.
// When the iframe cannot be found, a message is logged in the console.
callPlayer("whateverID", "playVideo");
*/
 
function utl_callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }

    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / 0 = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if (!domReady ||
               iframe && (!iframe.contentWindow || queue && !queue.ready) ||
               (!queue || !queue.ready) && typeof func === 'function') {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function() {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                if (!iframe) {
                    iframe = document.getElementById(frame_id);
                    if (!iframe) return;
                    if (iframe.tagName.toUpperCase() != 'IFRAME') {
                        iframe = iframe.getElementsByTagName('iframe')[0];
                        if (!iframe) return;
                    }
                }
                if (e.source === iframe.contentWindow) {
                    // Assume that the player is ready if we receive a
                    // message from the iframe
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {
        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ?
            w3('message', listener, !1)
        :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}

function utl_buildSVG(szDom){
	var $img		= $(szDom);
	var imgID		= $img.attr('id');
	var imgClass		= $img.attr('class');
	var imgURL		= $img.attr('src');

	$.get(imgURL, function(data) {
		// Get the SVG tag, ignore the rest
		var $svg	= jQuery(data).find('svg');

		// Add replaced image's ID to the new SVG
		if(typeof imgID !== 'undefined') {
		    $svg	= $svg.attr('id', imgID);
		}
		// Add replaced image's classes to the new SVG
		if(typeof imgClass !== 'undefined') {
		    $svg	= $svg.attr('class', imgClass);
		}

		// Remove any invalid XML tags as per http://validator.w3.org
		$svg		= $svg.removeAttr('xmlns:a');

		// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
		if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
		    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
		}

		// Replace image with new SVG
		$img.replaceWith($svg);

	}, 'xml');
};


/*
 in 'system/config/cssjs.php' enable 'nice-file-input' plugin

<form id="frm-img-upload" action='' method="post" enctype="multipart/form-data">
	<input type="text" name="some_text" id="someText" />
	<input type="file" name="file" id="fileToUpload" multiple />
	<input class="c-img-upload" type="submit" value="Upload Image" name="submit" />
</form>
< script>
	$(document).ready(function(){
		var opt = {
			form:		'#frm-img-upload',
			file:		'fileToUpload',
			path:		'<?=G_URL_BASE_FULL.G_LANG;?>/upload_file/',
			target:		'<?=P_ASSETS;?>uploads/',
			md5name:	false,
			loadstart:	function(){
				console.log('upload start');
			},
			progress:	function(perc){
				console.log('upload perc:'+perc);
			},
			error:		function(data){
				console.log('error');
				console.log(data);
			},
			complete:	function(data){
				console.log('upload complete');
				console.log(data);
			}
		}
		utl_create_submitter(opt);
		
		$("input[type=file]").nicefileinput({
			label : 'Select File...'
		});
	});
< /script> */		
function utl_create_submitter(opt) {
	$(opt.form).on('submit',function(e) {
		e.preventDefault();
			
		var filedata		= document.getElementById(opt.file);
		var formdata		= new FormData(this);
		
		var i			= 0;
		var len			= filedata.files.length;
		var file;
		for (i; i < len; i++) {
			file		= filedata.files[i];
			formdata.append("file[]", file);
		}
		formdata.append("json",true);
		
		if(opt.md5name === true){
			formdata.append("use_md5_names", true);
		}
		if(opt.target){
			formdata.append("target_path", opt.target);
		}
		
		$.ajax({
			url		: opt.path,
			type		: "POST",
			data		: formdata,
			contentType	: false,	// The content type used when sending data to the server.
			cache		: false,	// To unable request pages to be cached
			processData	: false,	// To send DOMDocument or non processed data file it is set to false
			context		: opt,
			resetForm	: true,
			beforeSend	: function( xhr ) {
				if(this.loadstart){
				       this.loadstart();
				}
			},
			xhr		: function() {
				var myXhr = $.ajaxSettings.xhr();
				myXhr.upload.subcontext = opt;
				if(myXhr.upload){
					myXhr.upload.addEventListener('progress', function(e){
						if(e.lengthComputable){
							var max		= e.total;
							var current	= e.loaded;
							var perc	= (current * 100)/max;
							if(this.subcontext.progress){
							       this.subcontext.progress(perc);
							}
						}
					}, false);
					myXhr.upload.addEventListener("loadstart", function() {
						//console.log("XHR:loadstart");
					}, false),
					myXhr.upload.addEventListener("load", function() {
						//console.log("XHR:load");
					}, false),
					myXhr.upload.addEventListener("timeout", function() {
						//console.log("XHR:timeout");
					}, false),
					myXhr.upload.addEventListener("loadend", function(e) {
						//console.log("XHR:loadend")
					}, false),
					myXhr.upload.addEventListener("error", function() {
						//console.log("XHR:error");
					}, false);						
					myXhr.upload.addEventListener("abort", function() {
						//console.log("XHR:abort");
					}, false);						
				}					
				return myXhr;
			},
			error		: function(data){
			},
			success		: function(data){
			},
			complete	: function (data) {
			}
		}).done(function(data){
			if(this.complete){
				this.complete(data);
			}
		}).fail(function(data){
			if(this.error){
				this.error(data);
			}
		}).always(function(data){
		});
	});	
}

var utl_validator = {
	isEmail : function(s) {
		return this.test(s, '^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$');
	},

	isAbsUrl : function(s) {
		return this.test(s, '^(news|telnet|nttp|file|http|ftp|https)://[-A-Za-z0-9\\.]+\\/?.*$');
	},

	isSize : function(s) {
		return this.test(s, '^[0-9.]+(%|in|cm|mm|em|ex|pt|pc|px)?$');
	},

	isId : function(s) {
		return this.test(s, '^[A-Za-z_]([A-Za-z0-9_])*$');
	},

	isEmpty : function(s) {
		var nl, i;

		if (s.nodeName == 'SELECT' && s.selectedIndex < 1){
			return true;
		}

		if (s.type == 'checkbox' && !s.checked){
			return true;
		}

		if (s.type == 'radio') {
			for (i=0, nl = s.form.elements; i<nl.length; i++) {
				if (nl[i].type == "radio" && nl[i].name == s.name && nl[i].checked){
					return false;
				}
			}

			return true;
		}

		return new RegExp('^\\s*$').test(s.nodeType == 1 ? s.value : s);
	},

	isNumber : function(s, d) {
		return !isNaN(s.nodeType == 1 ? s.value : s) && (!d || !this.test(s, '^-?[0-9]*\\.[0-9]*$'));
	}
}

function utl_download_asset(szFileName){
	//var szUrlBase			= '<?=G_URL_BASE_FULL.G_LANG;?>/download_file';
	var szParam			= APP_ASSETS + szFileName;
	var szUrl			= szUrlBase + "/?param=" + szParam;

	var newwindow			= window.open(szUrl, 'name', 'height=400,width=750');
	newwindow.focus();
}

function utl_clear_keywords(szKeywords){
	//123abcABC-_*(!@#$%^&*()_-={}[]:\"<>,.?/~`
	szKeywords			= szKeywords.replace(',', " ");		// change , to spaces
	szKeywords			= szKeywords.replace(/[^A-Za-z0-9āĀēĒūŪīĪšŠģĢķĶļĻžŽčČņŅ .]/g, '');// kill everything except chars
	szKeywords			= szKeywords.replace(/\s+/g, " ");		// trim multiple spaces
	szKeywords			= szKeywords.replace(/^\s+|\s+$/g,'');	// trim leading and trailing spaces
	return szKeywords;
}

function utl_quick_html(domID, data){
	// This method is too slow:
	//	$('.ajax-content').html(msg['data']);
	//
	// DOM.innerHTML is much faster than $.append or $.html 
	// but doesn't execute <script> contents so:
	//	in loop:
	//		extract data from <script> as text to variable
	//		create new<script> element via pure javascript
	//		add script text data from variable to new<script>
	//		remove <script> element with content
	//		append created new<script>
	// CONS:
	//	can not handle tags inline javascript
	
	/*var ajax_dom		= document.getElementById('ajax-content');*/
	/*ajax_dom.innerHTML	= msg['data'];*/
	
	var ajax_dom		= document.getElementById(domID);
	ajax_dom.innerHTML	= data;
	/*var aTMP		= $('.ajax-content').children('script');*/
	var aTMP		= $('.'+domID).children('script');
	var l			= aTMP.length;
	for(var i = 0; i < l; i++){
		var script	= document.createElement('script');
		script.text	= $(aTMP[i]).text();
		$(aTMP[i]).remove();
		ajax_dom.appendChild(script);
	}  
}

function utl_get_scrollbar_width() {
    var outer				= document.createElement("div");
    outer.style.visibility		= "hidden";
    outer.style.width			= "100px";
    document.body.appendChild(outer);
    
    var widthNoScroll			= outer.offsetWidth;
    // force Y scrollbar
    outer.style.overflowY		= "scroll";
    
    // add inner div with 100% width - it will strech itself until scrollbar
    var inner				= document.createElement("div");
    inner.style.width			= "100%";
    outer.appendChild(inner);
    
    // 100px - inner element width
    var widthWithScroll			= 100 - inner.offsetWidth;
    
    outer.removeChild(inner);
    document.body.removeChild(outer);
    
    return widthWithScroll;
}  

function utl_buildStringWithis(szString, aParams, szDelimiter){
	var szResult					= "";
	var aSTRARR					= szString.split(szDelimiter);
	var l						= aSTRARR.length;
	
	for(var i = 0; i < l; i++){
		var sz	 				= aParams[i];
		if (sz === null){
			sz 				= "";
		}
		szResult 				+= (aSTRARR[i] + " "+sz+" ");
	}
	
	return szResult;
}


var UTL_PASS_SHORT					= 0;
var UTL_PASS_EQNAME					= 1;
var UTL_PASS_WEAK					= 2;
var UTL_PASS_MEDIUM					= 3;
var UTL_PASS_STRONG					= 4;
function utl_passstrength(password, username){
	var checkRepetition				= function(pLen,str) {
		var res					= "";
		for (var i=0; i<str.length ; i++ ) {
			var repeated			= true;
			for (var j=0;j < pLen && (j+i+pLen) < str.length;j++){
				repeated=repeated && (str.charAt(j+i)==str.charAt(j+i+pLen));
			}
			if (j<pLen){
				repeated		= false;
			}
			if (repeated) {
				i			+= pLen-1;
				repeated		= false;
			} else {
				res			+= str.charAt(i);
			}
		}
		return res;
	};	
	
	var oRet					= new Object();
	oRet.score					= 0;
	oRet.value					= UTL_PASS_MEDIUM;
	//password < 4
	if (password.length < 4 ) { 
		oRet.value				= UTL_PASS_SHORT;
	}
	
	//password == user name
	if (password.toLowerCase()==username.toLowerCase()){
		oRet.value				= UTL_PASS_EQNAME;
	}
		 			    
	//password length
	oRet.score += password.length * 4;
	oRet.score += ( checkRepetition(1,password).length - password.length ) * 1;
	oRet.score += ( checkRepetition(2,password).length - password.length ) * 1;
	oRet.score += ( checkRepetition(3,password).length - password.length ) * 1;
	oRet.score += ( checkRepetition(4,password).length - password.length ) * 1;
		 	
	//password has 3 numbers
	if (password.match(/(.*[0-9].*[0-9].*[0-9])/)){ oRet.score += 5;} 
		 			    
	//password has 2 symbols
	if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){ oRet.score += 5 ;}
		 			    
	//password has Upper and Lower chars
	if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){  oRet.score += 10;} 
		 			    
	//password has number and chars
	if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){  oRet.score += 15;} 
	//
	//password has number and symbol
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)){  oRet.score += 15;} 
		 			    
	//password has char and symbol
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)){oRet.score += 15;}
		 			    
	//password is just a numbers or chars
	if (password.match(/^\w+$/) || password.match(/^\d+$/) ){ oRet.score -= 10;}
		 			    
	//verifying 0 < oRet.score < 100
	if ( oRet.score < 0 ){oRet.score = 0;} 
	if ( oRet.score > 100 ){  oRet.score = 100;} 
		 			    
	if (oRet.score < 34 ){
		oRet.value				= UTL_PASS_WEAK;
	}
	if (oRet.score > 68 ){
		oRet.value				= UTL_PASS_STRONG;
	}
		 			    
	return oRet;
};

function utl_number_format(number,decimals,dec_point,thousands_sep) {
    number  = number*1;//makes sure `number` is numeric value
    var str = number.toFixed(decimals?decimals:0).toString().split('.');
    var parts = [];
    for ( var i=str[0].length; i>0; i-=3 ) {
        parts.unshift(str[0].substring(Math.max(0,i-3),i));
    }
    str[0] = parts.join(thousands_sep?thousands_sep:',');
    return str.join(dec_point?dec_point:'.');
}


/*
var myEfficientFn = utl_debounce(function() {
    // this code will be executed only one at the very end of resize
}, 250);
$(window).on('resize', myEfficientFn);
*/
function utl_debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


function utl_latlngToPoint(map, latLng) {
    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    var point = new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    return point;
}

function utl_getYouTubeIdFromURL(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match&&match[2].length==11){
	    return match[2];
	}else{
	    return false;
	}
}	

function utl_parseURL(url){
	var obj 		= new Object();
	obj.res 		= /^(?:([a-z0-9_\-\.]+):\/\/)*(?:([a-z0-9_\-\.]+)(?:\:)*([a-z0-9_\-\.]+)*\@)*([a-z0-9][a-z0-9_\-\.]+)(?:\:([\d]+))*(?:\/([^?#]*))*(?:\?([^?#]*))*(?:\#([^?#]*))*/gi.exec( url );
	obj.data.scheme		= obj.res[ 1 ] || false;
	obj.data.user		= obj.res[ 2 ] || false;
	obj.data.pass		= obj.res[ 3 ] || false;
	obj.data.host		= obj.res[ 4 ] || false;
	obj.data.port		= obj.res[ 5 ] || false;
	obj.data.path		= obj.res[ 6 ] || false;
	obj.data.query		= obj.res[ 7 ] || false;
	obj.data.fragment	= obj.res[ 8 ] || false;
	
	if( obj.data.query ){
		obj.parts 	= obj.data.query.split( '&' );
		for(  var i = 0; i < obj.parts.length; i++ ){
			param	= obj.parts[ i ].split( '=' );
			obj.data.params[ param[ 0 ] ] = decodeURIComponent( param[ 1 ] );
		}
	}
	
	delete obj.res;	
	delete obj.parts;	
	return obj;
}

/* even IE11 /
document.addEventListener('visibilitychange', function () {
	if (document.hidden) {
		// stop running expensive task
	} else {
		// page has focus, begin running task
	}
	
	if (document.visibilityState === 'unloaded') {
		//trigger something ob unload
	}	
});
/**/

/*/
window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame         ||
	window.webkitRequestAnimationFrame          ||
	window.mozRequestAnimationFrame             ||
	window.oRequestAnimationFrame               ||
	window.msRequestAnimationFrame              ||
	function (callback, element){
		return window.setTimeout(callback, 1000 / 60);
	};
}());
(function animloop(){
	requestAnimFrame(animloop);
	//...do something
})();
/**/

/*/
button.mousedown = button.touchstart = function(data) {
};
button.mouseup = button.touchend = button.mouseupoutside = button.touchendoutside = function(data) {
};
button.mouseover = function(data) {
};
button.mouseout = function(data) {
};
button.click = function(data) {
};
button.tap = function(data) {
};
px.arrow_dir.touchmove			= function(mouseData){
	var pos				= mouseData.getLocalPosition(px.stage);
	px.mouse.global.x		= pos.x;
	px.mouse.global.y		= pos.y;
}
/**/

/*
 * reached end os page
$(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() > $(document).height() || $(window).scrollTop() + $(window).height() + 1 == $(document).height() || $(window).scrollTop() + $(window).height() == $(document).height()) {
		
	}
});
/**/

/*/
if(typeof Event.prototype.preventDefault === 'undefined') {
	Element.prototype.preventDefault = function (e, callback) {
		this.returnValue = false;
	};
} else {
	e.preventDefault();
	return false;
}	
/**/