enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	components:[
		//System
		{kind: "enyo.Signals",
		onload: "handleLoad",
		onbeforeunload: "handleUnload",
		onkeyup: "handleKeyUp"},
			
		{name: "animEngine",
		kind: "enyo.Animator",
		onStep: "stepAnimation",
		onEnd: "endAnimation",
		easingFunction: enyo.easing.quadInOut,
		duration:500},
		
		{kind: "Storage"},
		
		//Layout
		{tag: "div",
		classes: "enyo-fill",
		components:[
			{name: "phoneImage",
			kind: "enyo.Image",
			src: "assets/phone.png",
			style: "position:absolute; margin-left:50%; margin-top:50%; left:-128px; top:-160px; display:none;"},
			
			{name: "tabletImage",
			kind: "enyo.Image",
			src: "assets/tablet.png",
			style: "position:absolute; margin-left:50%; margin-top:50%; left:-384px; top:-416px; display:none;"},
			
			{name: "bottomBar",
			kind: "onyx.Toolbar",
			style: "position:absolute; bottom:0; left:0; right:0; height:32px;",
			components:[
				{kind: "onyx.Button",
				content: "Preferences",
				style: "float:right;",
				ontap: "openPrefSlideable"},
				
				{kind: "onyx.Button",
				content: "Map Drive",
				style: "float:right;",
				ontap: "openMapSlideable"},
			]}
		]},
	
		{name: "prefSlideable",
		kind: "enyo.Slideable",
		axis: 'h',
		unit: '%',
		min: 0,
		max: 100,
		value: 100,
		overMoving: false,
		style: "position:absolute; top:0; left:0; width:100%; height:100%; background:#EAEAEA;",
		components:[
			{kind: "onyx.Toolbar",
			style: "position:absolute; top:0; height:32px; width:100%;",
			components:[
				{content: "Preferences"}
			]},
			{kind: "enyo.Scroller", style: "position:absolute; top:52px; bottom:52px; width:100%;", components:[
				{kind: "PrefsContent"},
			]},
			{kind: "onyx.Toolbar",
			style: "position:absolute; bottom:0; height:32px; width:100%;",
			components:[
				{kind: "enyo.Image",
				src: "assets/grabbutton.png",
				style: "position:absolute;",
				ontap: "closePrefSlideable"}
			]},
		]},
	
		{name: "mapSlideable",
		kind: "enyo.Slideable",
		axis: 'v',
		unit: '%',
		min: 0,
		max: 100,
		value: 100,
		overMoving: false,
		style: "position:absolute; top:0; left:0; width:100%; height:100%; background:#EAEAEA;",
		components:[
			{kind: "onyx.Toolbar",
			style: "height:32px;",
			components:[
				{content: "Map Drive"},
				{kind: "onyx.Button", 
				content: "Refresh",
				style: "position:absolute; right:64px;"},
				{id: "grabber",
				kind: "enyo.Image",
				src: "assets/grabbutton.png",
				style: "position:absolute; top:8px; right:8px;",
				ontap: "closeMapSlideable"}
			]},
			{kind: "enyo.Scroller", style: "position:absolute; top:53px; bottom:0; left:0; right:0;", components:[
				{kind: "MapContent"},
			]},
		]},
		
		{name: "aboutPopup",
		kind: "onyx.Popup",
		centered: true,
		floating: true,
		lazy:false,
		style: "text-align:center;",
		components:[
			{kind: "enyo.Image", src: "assets/iconSmall.png"},
			{kind: "AboutContent"},
			{kind: "onyx.Button", content: "Close", style: "margin-top:8px;", ontap: "hideAbout"}
		]},
		
		{name: "firstUsePopup",
		kind: "onyx.Popup",
		centered: true,
		floating:true,
		lazy:false,
		style: "width:320px; height:385px; text-align:center;",
		components:[
			{kind: "enyo.Image", src: "assets/iconSmall.png"},
			{kind: "Scroller", style: "width:318px; height:245px;", classes: "popup-frame", components:[
				{kind: "FirstUseContent", style: "padding:8px;"},
			]},
			{kind: "onyx.Button", content: "Close", style: "margin-top:8px;", ontap: "hideFirstUse"}
		]}
	],

	//Signals
	handleLoad: function() {
		//Setup the right image based on screen size
		if (window.innerWidth >= 768 && window.innerHeight >= 768) {
			this.$.tabletImage.addStyles("display:block;");
		}
		else {
			this.$.phoneImage.addStyles("display:block;");
		}
		
		//Setup animation engine
		window.animEngine = this.$.animEngine;
		
		//If being run inside webOS
		if(enyo.webOS.setWindowProperties) {
			//Stop Screen Timeout
			enyo.webOS.setWindowProperties({ blockScreenTimeout: true });
		}
		
		//Show First Use Popup?
		var firstUse = true;
		if(firstUse) this.showFirstUse();
	},
	
	handleUnload: function() {
		//Deactivate Samba
		//Save Preferences
	},
	
	handleKeyUp: function(inSender, inEvent) {
		//Keycode 27 (ESC) - Back Gesture		
		if(inEvent.which == 27) {
			hideAbout();
			hideFirstUse();
			closePrefSlideable();
			
			inEvent.stopPropagation();
			inEvent.preventDefault();
			return true;
		}
	},
	
	//About
	showAbout: function() { this.$.aboutPopup.show(); },
	hideAbout: function() { this.$.aboutPopup.hide(); },
	
	//First Use
	showFirstUse: function() { this.$.firstUsePopup.show();},
	hideFirstUse: function() { this.$.firstUsePopup.hide(); },
	
	//Preferences
	openPrefSlideable: function() { this.$.prefSlideable.animateToMin(); },
	closePrefSlideable: function() { this.$.prefSlideable.animateToMax(); },
	
	//Map Drive
	openMapSlideable: function() { this.$.mapSlideable.animateToMin(); },
	closeMapSlideable: function() { this.$.mapSlideable.animateToMax(); },
	
	//Wi-Fi Image
	fadeOut: function() {
		enyo.log("Fading Image...");
		this.$.animEngine.startValue = 1.0;
		this.$.animEngine.endValue = 0.5;
		this.$.animEngine.target = this.$.phoneImage;
		this.$.animEngine.animStyle = "opacity";
		this.$.animEngine.play();
	},
	
	fadeIn: function() {
		this.$.animEngine.startValue = 0.5;
		this.$.animEngine.endValue = 1.0;
		this.$.animEngine.target = this.$.phoneImage;
		this.$.animEngine.animStyle = "opacity";
		this.$.animEngine.play();
	},
	
	//Animator
	stepAnimation: function(inSender) {
		var rotation;
		if(inSender.animStyle == "-webkit-transform") {
			rotation = "rotate(" + inSender.value + "deg)";
			inSender.target.applyStyle(inSender.animStyle, rotation);
		}
		else {
			inSender.target.applyStyle(inSender.animStyle, inSender.value);
		}
	},
	
	endAnimation: function(inSender) {
		var rotation;
		if(inSender.animStyle == "-webkit-transform") {
			rotation = "rotate(" + inSender.endValue + "deg)";
			inSender.target.applyStyle(inSender.animStyle, rotation);
		}
		else {
			inSender.target.applyStyle(inSender.animStyle, inSender.endValue);
		}
	},
});

//Preferences Content
enyo.kind({
	name: "PrefsContent",
	components:[
		{kind: "onyx.Groupbox", classes: "box-list", components:[
			{kind: "onyx.GroupboxHeader", content: "Device Name"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Name"}
			]}
		]},
		{kind: "onyx.Groupbox", classes: "box-list", components:[
			{kind: "onyx.GroupboxHeader", content: "Device Description"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Description"}
			]}
		]},
		{kind: "onyx.Groupbox", classes: "box-list", components:[
			{kind: "onyx.GroupboxHeader", content: "Workgroup"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Workgroup"}
			]}
		]},
		{kind: "onyx.Groupbox", classes: "box-list", components:[
		{kind: "onyx.GroupboxHeader", content: "Sharing"},
			{kind: "PrefsDrawer", title: "Public"},
			{kind: "PrefsDrawer", title: "Internal"},
			{kind: "PrefsDrawer", title: "Root"},
		]},
		{kind: "onyx.Groupbox", style: "padding:8px;", components:[
			{kind: "onyx.GroupboxHeader", content: "Misc"},
			{content: "About", style:"padding:8px"}
		]},
	]
});

//Preferences Drawer- Public, Internal, Root etc.
enyo.kind({
	name: "PrefsDrawer",
	kind: "Control",
	published:{
		title: "Drawer"
	},
	style: "padding:4px;",
	components:[
		{kind: "enyo.Control", name: "Title", style: "float:left; padding:4px;", ontap: "toggleOpen"},
		{kind: "onyx.IconButton", name: "Button", src: "assets/drawerButton.png", style: "float:right;", ontap: "toggleOpen"},
		{kind: "onyx.Drawer", open:false, style: "width:100%;", components:[
			{kind: "onyx.Groupbox", style: "padding-left:2px; padding-right:2px; padding-bottom:2px; padding-top:4px;", components:[
				{kind: "propBox", title: "Available"},
				{kind: "propBox", title: "Writeable"},
				{kind: "propBox", title: "Browseable"},
			]},
		]},
	],
	
	create: function() {
		this.inherited(arguments);
		this.$.Title.setContent(this.title);
	},
	
	toggleOpen: function(inSender) {
		
		if(!this.$.drawer.getOpen()) {
			this.$.drawer.setOpen(true);
			window.animEngine.startValue = 0;
			window.animEngine.endValue = 90;
		}
		else {
			window.animEngine.startValue = 90;
			window.animEngine.endValue = 0;
			this.$.drawer.setOpen(false);
		}
		
		window.animEngine.target = inSender.parent.$.Button;
		window.animEngine.animStyle = "-webkit-transform";
		window.animEngine.easingFunction = enyo.easing.expoOut;
		window.animEngine.duration = 300;
		
		window.animEngine.play();
	},
});

enyo.kind({
	kind: "enyo.Control",
	name: "propBox",
	style: "height:32px; padding:6px;",
	published:{
		title: "Title",
	},
	components:[
		{name: "Title", style: "float:left; padding:4px;"},
		{kind: "onyx.Checkbox", style: "float:right"}
	],
	
	create: function() {
		this.inherited(arguments);
		this.$.Title.setContent(this.title);
	},
});

//Map Drive Content
enyo.kind({
	name: "MapContent",
	classes: "enyo-fill",
	components:[
		{kind: "FlyweightRepeater", classes: "enyo-fill", rows: 1, onSetupRow: "setupItem", components:[
			{name: "item", style: "padding:8px;", components:[
				{name: "title", style: "display:inline;", content: "Row Item"},
				{name: "spinner", kind: "enyo.Image", style: "display:inline; float:right; padding:4px;", src: "assets/spinner.gif"}
			]},
		]}
	],
	setupItem: function(inSender, inEvent) {
		if(inEvent.index == 0) {
			this.$.title.setContent("Scanning for Drives...");
			this.$.spinner.applyStyle('display', 'block');
		}
		this.$.item.applyStyle("background-color", inSender.isSelected(inEvent.index) ? "lightblue" : null);
	},
});