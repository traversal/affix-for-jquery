/*!
	jQuery affix plugin v1.0 for jQuery 1.3
	2009 Travis Hensgen (Traversal): http://tinyurl.com/avkw78
	License: MIT - http://tinyurl.com/ctnp4f
*/

/* 

Options:

offsets can also be defined as a has like so: 

offsets
{
	// offsets for the to element, based on glue (or tweaked glue)

	"*" : [0,0], // define the * offset to apply this to ALL glue values not specifically defined
	"n" : null, // => when the "to" glue is "n"

	// ... etc
},

*/

(function($) {

	var t, tp, ts, fs, fp, wo, ws, glue, settings, info;
	
	$.fn.first = function() { if (this.length > 0) return this[0]; };

	
	$.affixPosition = function(from, to, options)
	{
		// "from" is an element ID, or a wrapped set. In any case, only the first matching element is regarded
		
		// will always take the first element in "el"
		var f = $(from).first();
 
		// apply callee options to defaults
		settings = $.affixPosition.getSettings(options);

		// calculate "from" element size, and window size and offsets
		ws = { width: $(window).width(), height: $(window).height() };
        wo = { top: $(window).scrollTop(), left: $(window).scrollLeft() };
		fs = { width: $(from).outerWidth(), height: $(from).outerHeight() };

		
				
		// work out what "to" actually is - an element, the window, or "offscreen"

		if (typeof(to) == "string")
		{
			var m = to.match(/^(window|win|w|offscreen|os|o)(?:\.([nweschv]*))?(?:(\+|-)([0-9]+))?(?:,([0-9]+))?/);
			
			if (m) {
				
				if (m[2]) {
					// record the glue (only "from" really applies here but we'll set them both, they are the same)
					settings.glue.from = settings.glue.to = m[2];
				}
			
				if (m[3] && m[4]) {
					// record any insets
					var m4v = parseInt(m[4]);
					var m5v = m[5] ? parseInt(m[5]) : 0;
					
					if (m[3] == "-")
					{
						settings.inset = [-m4v, -m4v];
						
						if (m[5])
							settings.inset[1] = -m5v;
					}
					else
					{
						settings.inset = [m4v, m4v];

						if (m[5])
							settings.inset[1] = m5v;
					}
					
				}
				
				if (settings.glue.from && (!settings.glue.to || settings.glue.to == ""))
				{
					settings.glue.to = settings.glue.from;
				}
				else if (settings.glue.to && (!settings.glue.from || settings.glue.from == ""))
				{
					settings.glue.from = settings.glue.to;
				}
				
				if (m[1] == "window" || m[1] == "w" || m[1] == "win") {
					info = WIN.derive(f);
				} else if (m[1] == "offscreen" || m[1] == "o" || m[1] == "os") {
					info = OS.derive(f);
				}
			}
			
			
		}
		else
		{
			t = $(to).first();

			if (t)
			{
				
				if (settings.glue)
				{
					if (!settings.glue.to)
					{
						// if "to" glue has not been specified create default glue for the border of the to element
						var dtg = {"sw":"ne","w":"e","nw":"se","n":"s","ne":"sw","e":"w","se":"nw","s":"n","c":"c"};
						settings.glue.to = dtg[settings.glue.from] || "c";
					}
					
					if (!settings.glue.from)
					{
						// setup default from glue when not specified
						var dfg = {"ne":"sw","e":"w","se":"nw","s":"n","sw":"ne","w":"e","nw":"se","n":"s","c":"c"};
						settings.glue.from = dfg[settings.glue.to] || "c";
					}
				}
				
				info = EL.derive(f, t);
			}
		}

		if (settings.extendedInfo)
			return info;
		else
			return { left: info.left, top: info.top };
	};
	
	$.fn.affixPosition = function(to, options)
	{
		return $.affixPosition($(this), to, options); 
	};
	
	$.affixPosition.getSettings = function(options)
	{
		var s = $.extend({

			animate 			: false,
			animateParams		: null,
			extendedInfo		: false,

			glue				: { to: "ne" }, // default case is for the most common form of "tooltip"
			glueInsideWindow	: true,
			offsets				: [0,0],
			fixed				: false,
			
			// inset [x,y] can be used instead of (or in addition to offsets), which intelligently apply offsets with respect to the glue position. 
			// positive inset will position INSIDE the boundary of that which we are hooking "to", negative inset will position OUTSIDE 
			// a single integer value can also be used to apply equal [x,y] inset
			
			inset				: [0,0],
			smartOffscreenInset : true,

			classGlueFromApply	: true,
			classGlueFromPrefix	: "glue_",

			classGlueToApply	: true,
			classGlueToPrefix	: "glue_"

		}, options || {});

		// setup default animate options (these are not 
		s.animateOptions = $.extend( { duration: 500, queue: true, easing: null, callback: null }, s.animateOptions || {} );
		
		// assume animation is active if animateProperties or animateOptions were provided
		if (options.animateOptions || options.animateParams)
			s.animate = true;
		
		// setup glue if callee has used "from", "to" directly in options (a bit more concise)
		if (s.from)
		{
			s.glue.from = s.from;
		}

		if (s.to)
		{
			s.glue.to = s.to;
		}
		
		
		
		return s;
	};
	
	$.fn.affixAnimate = $.fn.affixa = function(to, options) {
		return this.affix(to, $.extend(options, { animate: true } ));
	};
	
	$.fn.affixAnimateNQ = $.fn.affixanq = function(to, options) {
		return this.affix(to, $.extend(options, { animateOptions: {queue: false} } ));
	};
	
	$.fn.affixAnimateFadeIn = $.fn.affixafi = function(to, options, opacity) {
		var o = options || {};
		
		return this
			.css({opacity: 0.0})
			.show().affix(
				to, 
				$.extend(
					o, { 
						animateParams: $.extend(o.animateParams || {}, { opacity: opacity || 1.0 })
					}
				)
			);
	};
	
	$.fn.affixAnimateFadeOut = $.fn.affixafo = function(to, options, opacity) {
		var o = options || {};
		
		return this
			.css({opacity: opacity || 1.0})
			.affix(
				to, 
				$.extend(
					o, { 
						animateParams:  $.extend(o.animateParams || {}, { opacity: "hide" }),
						animateOptions: $.extend(o.animateOptions || {}, { complete: function() { $(this).hide(); } })
					}
				)
			)
	};
	
	$.fn.affix = function(to, options) {
	
		$.each(
			this,
			function(index, from){
				// need to derive here for EACH element (differs from MooTools version, for jquery chaining)
				
				var info = $.affixPosition(from, to, options || {});

				if (settings.animate)
				{
					$(from).animate( $.extend(settings.animateParams || {}, { left: info.left, top: info.top }), settings.animateOptions );
				}
				else
				{
					$(from).css( { left: info.left, top: info.top } );
				}
			}
		);
		
		return this;
	};
	
	// routines for hooking to the window 

	var WIN = {
		derive: function(from, eqn)
		{
			var glue = settings.glue;

			// get the intended position
			var pos = getPosition(eqn || WIN.eqn, glue.from);

			// apply any offsets, inset
			var offsets = applyOffsets(pos, glue);
			var insetOffsets = applyInset(pos, glue);
			
			// now apply the correct class name based on the from "glue" (the glue is implied in the affix "to" string)
			if (settings.classGlueFromApply)
				applyClassName(from, glue.from, settings.classGlueFromPrefix);

			return { left: pos.left, top: pos.top, glue: glue, offsets: offsets, insetOffsets: insetOffsets };
		},
		
		eqn: {
			"n" : "wx+h:ww-h:fw,wy",
			"ne": "wx+ww-fw,wy",
			"e" : "wx+ww-fw,wy+h:wh-h:fh",
			"se": "wx+ww-fw,wy+wh-fh",
			"s" : "wx+h:ww-h:fw,wy+wh-fh",
			"sw": "wx,wy+wh-fh",
			"w" : "wx,wy+h:wh-h:fh",
			"nw": "wx,wy",
			"c" : "wx+h:ww-h:fw,wy+h:wh-h:fh"
		}
	};
	
	// routines for hooking to offscreen
	
	var OS = {
		derive: function(from)
		{
			// piggyback on the WIN derive function - this has the same requirements
			return WIN.derive(from, OS.eqn);
		},
		
		eqn: {
			"n"  : "wx+h:ww-h:fw,wy-fh",
			"nne": "wx+ww-fw,wy-fh",
			"ne" : "wx+ww,wy-fh",
			"ene": "wx+ww,wy",
			"e"  : "wx+ww,wy+h:wh-h:fh",
			"ese": "wx+ww,wy+wh-fh",
			"se" : "wx+ww,wy+wh",
			"sse": "wx+ww-fw,wy+wh",
			"s"  : "wx+h:ww-h:fw,wy+wh",
			"ssw": "wx,wy+wh",
			"sw" : "wx-fw,wy+wh",
			"wsw": "wx-fw,wy+wh-fh",
			"w"  : "wx-fw,wy+h:wh-h:fh",
			"wnw": "wx-fw,wy",
			"nw" : "wx-fw,wy-fh",
			"nnw": "wx,wy-fh"
		}
	};
	
	// setup some aliases for offscreen equations
	OS.eqn.c 	= OS.eqn.n;
	OS.eqn.nwv = OS.eqn.vnw	= OS.eqn.nnw;
	OS.eqn.nwh = OS.eqn.hnw	= OS.eqn.wnw;
	OS.eqn.nev = OS.eqn.vne	= OS.eqn.nne;
	OS.eqn.neh = OS.eqn.hne	= OS.eqn.ene;
	OS.eqn.sev = OS.eqn.vse	= OS.eqn.sse;
	OS.eqn.seh = OS.eqn.hse	= OS.eqn.ese;
	OS.eqn.swv = OS.eqn.vsw	= OS.eqn.ssw;
	OS.eqn.swh = OS.eqn.hsw	= OS.eqn.wsw;
	
	// routines for hooking to another element
	
	var EL = {
		
		derive: function(from, to) {

			// calculate the to element size and position
			tp = $(to).offset();
			ts = {width: $(to).outerWidth(), height: $(to).outerHeight()};

			var glue = settings.glue;

			// get the intended position
			var pos = EL.getPosition(glue);

			// apply any offsets
			var offsets = applyOffsets(pos, glue);
			var insetOffsets = applyInset(pos, glue);

			if (settings.glueInsideWindow)
			{
				// now, apply tweaks based on the window edges
				var newGlue = EL.glueInsideWindow(pos, glue);

				if (newGlue)
				{
					glue = newGlue;
					pos = EL.getPosition(glue);
					offsets = applyOffsets(pos, glue);
					insetOffsets = applyInset(pos, glue);
				}
			}

			// now apply the correct class name based on the (eventual) glue

			if (settings.classGlueFromApply)
				applyClassName(from, glue.from, settings.classGlueFromPrefix);

			// now apply class names to the element(s) (if set in the options)
			if (settings.classGlueToApply)
				applyClassName(to, glue.to, settings.classGlueToPrefix);

			return { left: pos.left, top: pos.top, glue: glue, offsets: offsets, insetOffsets: insetOffsets };
		},
		
		getPosition: function(glue)
		{
			return getPosition(EL.eqn, glue.from + "_" + glue.to, EL.tokenValue);
		},

		glueInsideWindow: function(pos, glue)
		{
			// record where the element is glued to
			var gtn = glue.to.search("n") != -1;
			var gts = glue.to.search("s") != -1;
			var gte = glue.to.search("e") != -1;
			var gtw = glue.to.search("w") != -1;
			
			// flag if the target will be clipped by any of the window edges
			// ("cn" stands for "clipped at window's north edge, and so on)

			var cn = pos.top < wo.top;
			var cw = pos.left < wo.left; 
			var ce = pos.left + fs.width > wo.left + ws.width;
			var cs = pos.top + fs.height > wo.top + ws.height;

			// now work out the best cases for transforming the hooks
			// simply, if clipped at the north or south, swap the north/south.
			// then, if clipped at the east or west, swap the east/west

			var keys = [glue.from, glue.to];

			if (!cn && !cs && !ce && !cw)
				return false; // not clipped, so let the calling function know that
				
			if ((cn && gtn) || (cs && gts))
			{
				keys[0] = EL.swapNS(keys[0]);
				keys[1] = EL.swapNS(keys[1]);
			}

			if ((ce && gte) || (cw && gtw))
			{
				keys[0] = EL.swapEW(keys[0]);
				keys[1] = EL.swapEW(keys[1]);
			}

			return {from: keys[0], to: keys[1]};
		},

		swapNS: function(key)
		{
			return key.replace(/n/g,"T").replace(/s/g, "n").replace(/T/g, "s");
		},

		swapEW: function(key)
		{
			return key.replace(/e/g,"T").replace(/w/g, "e").replace(/T/g, "w");
		},
		
		tokenValue: function(tk)
		{
			switch (tk)
			{
				case "tpw":
				case "tpe":
				case "tps":
				case "tpn":
				{
					return parseEquation(EL.eqnm[tk.substr(2,1)], EL.tokenValue);
				}
				case "h:tw":
				case "h:th":
				{
					// half (rounded)
					return Math.round(EL.tokenValue(tk.substr(2,2)) / 2);
				}
				case "tw":
				{
					return ts.width;
				}
				case "th":
				{
					return ts.height;
				}
				case "tpx":
				{
					return tp.left;
				}
				case "tpy":
				{
					return tp.top;
				}
				default:
				{
					return tokenValue(tk);
				}
			}

			return false;
		},
		
		// tpe => "To-Position-Equations"
		// Note: h:n is equivalent to "half n rounded" or "Math.round(n/2)"

		eqn: {
			"n_n"  : "tpx+h:tw-h:fw,tpn",
			"n_ne" : "tpe-h:fw,tpn",
			"n_e"  : "tpe-h:fw,tpn+h:th",
			"n_se" : "tpe-h:fw,tps",
			"n_s"  : "tpw+h:tw-h:fw,tps",
			"n_sw" : "tpw-h:fw,tps",
			"n_w"  : "tpw-h:fw,tpn+h:th",
			"n_nw" : "tpw-h:fw,tpn",
			"n_c"  : "tpw+h:tw-h:fw,tpn+h:th",

			"ne_n" : "tpx+h:tw-fw,tpn",
			"ne_ne": "tpe-fw,tpn",
			"ne_e" : "tpe-fw,tpn+h:th",
			"ne_se": "tpe-fw,tps",
			"ne_sw": "tpw-fw,tps",
			"ne_s" : "tpw+h:tw-fw,tps",
			"ne_w" : "tpw-fw,tpn+h:th",
			"ne_nw": "tpw-fw,tpn",
			"ne_c" : "tpw+h:tw-fw,tpn+h:th",

			"e_n"  : "tpx+h:tw-fw,tpn-h:fh",
			"e_ne" : "tpe-fw,tpn-h:fh",
			"e_e"  : "tpe-fw,tpn+h:th-h:fh",
			"e_se" : "tpe-fw,tps-h:fh",
			"e_s"  : "tpw+h:tw-fw,tps-h:fh",
			"e_sw" : "tpw-fw,tps-h:fh",
			"e_w"  : "tpw-fw,tpn+h:th-h:fh",
			"e_nw" : "tpw-fw,tpn-h:fh",
			"e_c"  : "tpw+h:tw-fw,tpn+h:th-h:fh",

			"se_n" : "tpx+h:tw-fw,tpn-fh",
			"se_ne": "tpe-fw,tpn-fh",
			"se_e" : "tpe-fw,tpn+h:th-fh",
			"se_se": "tpe-fw,tps-fh",
			"se_s" : "tpw+h:tw-fw,tps-fh",
			"se_sw": "tpw-fw,tps-fh",
			"se_w" : "tpw-fw,tpn+h:th-fh",
			"se_nw": "tpw-fw,tpn-fh",
			"se_c" : "tpw+h:tw-fw,tpn+h:th-fh",

			"s_n"  : "tpx+h:tw-h:fw,tpn-fh",
			"s_ne" : "tpe-h:fw,tpn-fh",
			"s_e"  : "tpe-h:fw,tpn+h:th-fh",
			"s_se" : "tpe-h:fw,tps-fh",
			"s_s"  : "tpw+h:tw-h:fw,tps-fh",
			"s_sw" : "tpw-h:fw,tps-fh",
			"s_w"  : "tpw-h:fw,tpn+h:th-fh",
			"s_nw" : "tpw-h:fw,tpn-fh",
			"s_c"  : "tpw+h:tw-h:fw,tpn+h:th-fh",

			"sw_n" : "tpx+h:tw,tpn-fh",
			"sw_ne": "tpe,tpn-fh",
			"sw_e" : "tpe,tpn+h:th-fh",
			"sw_se": "tpe,tps-fh",
			"sw_s" : "tpw+h:tw,tps-fh",
			"sw_sw": "tpw,tps-fh",
			"sw_w" : "tpw,tpn+h:th-fh",
			"sw_nw": "tpw,tpn-fh",
			"sw_c" : "tpw+h:tw,tpn+h:th-fh",

			"w_n"  : "tpx+h:tw,tpn-h:fh",
			"w_ne" : "tpe,tpn-h:fh",
			"w_e"  : "tpe,tpn+h:th-h:fh",
			"w_se" : "tpe,tps-h:fh",
			"w_s"  : "tpw+h:tw,tps-h:fh",
			"w_sw" : "tpw,tps-h:fh",
			"w_w"  : "tpw,tpn+h:th-h:fh",
			"w_nw" : "tpw,tpn-h:fh",
			"w_c"  : "tpw+h:tw,tpn+h:th-h:fh",

			"nw_n" : "tpx+h:tw,tpn",
			"nw_ne": "tpe,tpn",
			"nw_e" : "tpe,tpn+h:th",
			"nw_se": "tpe,tps",
			"nw_s" : "tpw+h:tw,tps",
			"nw_sw": "tpw,tps",
			"nw_w" : "tpw,tpn+h:th",
			"nw_nw": "tpw,tpn",
			"nw_c" : "tpw+h:tw,tpn+h:th",

			"c_n"  : "tpx+h:tw-h:fw,tpn-h:fh",
			"c_ne" : "tpe-h:fw,tpn-h:fh",
			"c_e"  : "tpe-h:fw,tpn+h:th-h:fh",
			"c_se" : "tpe-h:fw,tps-h:fh",
			"c_s"  : "tpw+h:tw-h:fw,tps-h:fh",
			"c_sw" : "tpw-h:fw,tps-h:fh",
			"c_w"  : "tpw-h:fw,tpn+h:th-h:fh",
			"c_nw" : "tpw-h:fw,tpn-h:fh",
			"c_c"  : "tpw+h:tw-h:fw,tpn+h:th-h:fh"
		},

		// equation shorthand macros 
		eqnm: { "n" : "tpy", "ne" : "", "e" : "tpx+tw", "s" : "tpy+th", "w" : "tpx" }
	};


	// common routines

	var getPosition = function(eqn, glueKey, fnTokenValue)
	{
		var parts = eqn[glueKey].split(",");

		return {
			left: Math.round(parseEquation(parts[0], fnTokenValue || tokenValue)),
			top	: Math.round(parseEquation(parts[1], fnTokenValue || tokenValue))
		}
	};
	
	var applyClassName = function(el, glueVal, classGluePrefix)
	{
		// remove any previous class name applied
		// via a RegExp since using removeClass would be very slow here on over 20 possible class names
		
		$(el).attr("class", $(el).attr("class").replace(new RegExp("\s?" + classGluePrefix + "[newsvhc]{1,3}\s?" ,"gi"), ""));

		// now add the appropriate class name to the element
		$(el).addClass(classGluePrefix + glueVal);
	};
	
	var tokenValue = function(tk)
	{
		// common token values (related to the window, and "from" element)
		
		switch (tk)
		{
			case "h:fw":
			case "h:fh":
			case "h:wh": 
			case "h:ww": {
				// half (rounded)
				return Math.round(tokenValue(tk.substr(2,2)) / 2);
			}
			case "ww":
			{
				return ws.width;
			}
			case "wh":
			{
				return ws.height;
			}
			case "wx":
			{
				return settings.fixed ? 0 : wo.left;
			}
			case "wy":
			{
				return settings.fixed ? 0 : wo.top;
			}
			case "fw": {
				return fs.width;
			}
			case "fh": {
				return fs.height;
			}
		}
		
		return false;
	};
	
	

	var getOffsets = function(glue)
	{
		var offsets;
		
		if (!settings.offsets.length && settings.offsets[glue.from + "_" + glue.to]) // offsets for combination of "from" and "to" glue
			offsets = settings.offsets[glue.from + "_" + glue.to];
		else if (settings.offsets.length && settings.offsets.length == 2) // simple array-based [x,y] offsets
			offsets = settings.offsets;
		else if (settings.offsets[glue.from]) // offsets for just "from" glue
			offsets = settings.offsets[glue.from];
		else if (settings.offsets["*"]) // default offsets when offsets is a hash
			offsets = settings.offsets["*"];
			
		return offsets;
	};

	var applyOffsets = function(pos, glue)
	{
		if (settings.offsets)
		{
			var offsets = getOffsets(glue) || [0,0];
			
			var x = parseInt(offsets[0]);
			var y = parseInt(offsets[1]);
		
			if (!isNaN(x))
				pos.left += x;
		
			if (!isNaN(y))
				pos.top += y;
		}
		
		return offsets;
	};

	var applyInset = function(pos, glue)
	{
		var io = deriveInsetOffsets(pos, glue);
		
		pos.left += io[0];
		pos.top  += io[1];
		
		return io;
	};
	
	var deriveInsetOffsets = function(pos, glue)
	{
		// work out the equivalent offsets, based on the "to" glue
		
		var i = settings.inset;
		
		if (i)
		{
			if (typeof(i) == "number")
			{
				// a single inset for both x,y, build an array
				i = [i,i];
			}

			
			var ieqn = {
				"c"  : "0,0",
				"n"  : "0,y",
				"nne": "-x,y", 
				"ne" : "-x,y",
				"ene": "-x,y",
				"e"  : "-x,0",
				"ese": "-x,-y",
				"se" : "-x,-y",
				"sse": "-x,-y",
				"s"  : "0,-y",
				"ssw": "x,-y",
				"sw" : "x,-y",
				"wsw": "x,-y",
				"w"  : "x,0",
				"wnw": "x,y",
				"nw" : "x,y",
				"nnw": "x,y"
			};
			
			if (settings.smartOffscreenInset)
			{
				// these mods ensure tweak the x or y inset as appropriate to ensure 
				// that no part of the element is visible at each window boundary
				ieqn.nne = "-x,0"; 
				ieqn.ene = "0,y"; 
				ieqn.ese = "0,-y"; 
				ieqn.sse = "-x,0"; 
				ieqn.ssw = "x,0"; 
				ieqn.wsw = "0,-y"; 
				ieqn.wnw = "0,y"; 
				ieqn.nnw = "x,0"; 
			}

			// setup some aliases
			ieqn.nwv = ieqn.vnw	= ieqn.nnw;
			ieqn.nwh = ieqn.hnw	= ieqn.wnw;
			ieqn.nev = ieqn.vne	= ieqn.nne;
			ieqn.neh = ieqn.hne	= ieqn.ene;
			ieqn.sev = ieqn.vse	= ieqn.sse;
			ieqn.seh = ieqn.hse	= ieqn.ese;
			ieqn.swv = ieqn.vsw	= ieqn.ssw;
			ieqn.swh = ieqn.hsw	= ieqn.wsw;
			
			var p = (ieqn[glue.to] || ieqn["c"]).split(",");
			
			return [ parseInsetValue(p[0],i), parseInsetValue(p[1],i) ];
		}
		
		return [0,0];
	};
	
	var parseInsetValue = function(eq, i)
	{
		var m = eq.match(/([\-]?)([xy0])/);

		if (m)
		{
			if (m[2] == "x")
			{
				if (m[1] == "-")
				{
					return -i[0];
				}
				else
				{
					return i[0];
				}
			}
			else if (m[2] == "y")
			{
				if (m[1] == "-")
				{
					return -i[1];
				}
				else
				{
					return i[1];
				}
			}
		}	
		
		return 0;
	};
	
	var parseEquation = function(eq, tfn)
	{
		// tfn is the "token function" which is called to derive values of tokens, "tokenValue" if not specified
		
		var m = eq.match(/([a-z:]+)|([\+\-])/g);
		
		var v = 0;
		var d; // d for delta
		
		// for simplicity, we assume that odd numbered matches are operands, even are operators
		
		for (var i=0; i<m.length; i++)
		{
			d = (tfn || tokenValue)(m[i]);
			
			if (d !== false)
			{
				if (i == 0)
				{
					// the first operand simply add the token value
					v += d;
				}
				else if (i % 2 == 0)
				{
					// an operand, but not the first - get the operator before this
					if (m[i-1] == "+")
						v += d;
					else
						v -= d;
				}
			}
		}
		
		return v;
	};
	
})(jQuery);

