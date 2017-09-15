var	UTL_PID180  						= Math.PI / 180;
var	UTL_180DPI						= 180 / Math.PI;

function math_getSpheresCollisionBOOL(vct0, vct1){
	var xdiff			= vct0.x - vct1.x;
	var ydiff			= vct0.y - vct1.y;
	var d				= Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	return d <= (vct0.r + vct1.r);
}

function math_deg2Rad(deg){
	return deg * UTL_PID180;
}

function math_rad2Deg(rad){
	return rad * UTL_180DPI;
}

function math_dotproduct2D(v1, v2){
	return ((v1.x * v2.x) + (v1.y * v2.y));
}		

function math_normalize2D(vct){
	var mag							= Math.sqrt((vct.x * vct.x) + (vct.y * vct.y));
	if (mag == 0){
		mag = 1;
	}
	
	vct.x 							/= mag;
	vct.y 							/= mag;
	return vct;
}		

function math_closestPointOnLine(p1, p2, pt){
	var vct1;
	var vct2;
	var vct3;
	
	vct1.x	 						= pt.x - p1.x;
	vct1.y	 						= pt.y - p1.y;
	
	vct2.x							= p2.x - p1.x;
	vct2.y							= p2.y - p1.y;
	
	vct2 							= math_normalize2D(vct2);
	
	var d							= Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
	
	var bounds 						= math_dotproduct2D(vct2, vct1);
	
	if (bounds <= 0){
		return p1;
	}
	
	if (bounds >= d){
		return p2;
	}
	
	vct3.x 							= p1.x + vct2.x * bounds;
	vct3.y 							= p1.y + vct2.y * bounds;
	
	return vct3;
}		

function math_buildRGB(r, g, b){
	return (b | (g << 8) | (r << 16));
}

function math_splitRGB(rgb){
	var srgb;
	
	srgb.b 						= (rgb % 256);
	srgb.g 						= (rgb & -16711936) / 256;
	srgb.r 						= (rgb & 16711680 ) / 65536;
	
	return srgb;
}		

function math_randRange(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function math_getDirMC2D(from, to){
	var dir
	dir.x 						= to.x - from.x;
	dir.y 						= to.y - from.y;
	
	var mag						= Math.sqrt((dir.x * dir.x) + (dir.y * dir.y));
	if (mag == 0)
	{
		mag = 1;
	}
	
	dir.x 						/= mag;
	dir.y 						/= mag;
	
	return dir;
}

function math_angleBTWlines2D(commonPoint, lineEnd1, lineEnd2){
	var v1;
	var v2;
	
	v1.x 						= lineEnd1.x - commonPoint.x;
	v1.y 						= lineEnd1.y - commonPoint.y;
	
	v2.x 						= lineEnd2.x - commonPoint.x;
	v2.y 						= lineEnd2.y - commonPoint.y;
	
	return math_angleBTWvectors2D(v1, v2);
}

function math_angleBTWvectors2D(v1, v2){
	var dot 					= ((v1.x * v2.x) + (v1.y * v2.y));
	var mag1					= Math.sqrt((v1.x * v1.x) + (v1.y * v1.y));
	var mag2					= Math.sqrt((v2.x * v2.x) + (v2.y * v2.y));
	var magMul					= mag1 * mag2;
	var ang						= Math.acos(dot / magMul);
	if ( isNaN(ang))
	{
		return 0;
	}
	
	return ang;
}


function math_crossProduct2D(vct1, vct2){
	var pRet;
	
	pRet.x						= (vct1.y * 1) - (1 * vct2.y);
	pRet.y						= (1 * vct2.x) - (vct1.x * 1);
	
	return pRet;
}

function math_randRange(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function math_clamp(THETA_MIN, THETA_MAX, LOW_LIMIT, HIGH_LIMIT, THETA){	
	var theta	 				= 1/(THETA_MAX-THETA_MIN) * (THETA - THETA_MIN);
	if(theta > 1){ return HIGH_LIMIT; }
	if(theta < 0){ return LOW_LIMIT; }
	return LOW_LIMIT + (HIGH_LIMIT - LOW_LIMIT) * theta;
}

function math_quantomize(array){
	var len 					= array.length;
	
	var a						= 0;
	var b						= 0;
	var temp;
	
	for (var i = 0; i<array.length; i++)
	{
		
		a					= Math.floor(Math.random()*len);
		b					= Math.floor(Math.random()*len);
		
		temp					= array[a];
		array[a]				= array[b];
		array[b]				= temp;
	}
}

function math_rotatePoint(vct, ang){
	var o
	o.x 						= vct.x * Math.cos(ang) - vct.y * Math.sin(ang);
	o.y 						= vct.y * Math.cos(ang) + vct.x * Math.sin(ang);
	return o
}

var aGAUSS						= new Array();
aGAUSS[0]						= {x:  0.285561, y:  0.188437};
aGAUSS[1]						= {x:  0.360176, y: -0.065688};
aGAUSS[2]						= {x: -0.111751, y:  0.275019};
aGAUSS[3]						= {x: -0.055918, y: -0.215197};
aGAUSS[4]						= {x: -0.080231, y: -0.470965};
aGAUSS[5]						= {x:  0.138721, y:  0.409168};
aGAUSS[6]						= {x:  0.384120, y:  0.458500};
aGAUSS[7]						= {x: -0.454968, y:  0.134088};
aGAUSS[8]						= {x:  0.179271, y: -0.331196};
aGAUSS[9]						= {x: -0.307049, y: -0.364927};
aGAUSS[10]						= {x:  0.105354, y: -0.010099};
aGAUSS[11]						= {x: -0.154180, y:  0.021794};
aGAUSS[12]						= {x: -0.370135, y: -0.116425};
aGAUSS[13]						= {x:  0.451636, y: -0.300013};
aGAUSS[14]						= {x: -0.370610, y:  0.387504};

function math_getGauss(){
	return aGAUSS[math_randRange(0, 14)];
}