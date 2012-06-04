enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	components:[
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
		
		{name: "appMenu",
		kind: "enyo.Menu",
		components:[
			{content: "Hello"},
		]},
		
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
			{kind: "PrefsContent", style: "position:absolute; top:52px; bottom:52px; width:100%"},
			{kind: "onyx.Toolbar",
			style: "position:absolute; bottom:0; height:32px; width:100%;",
			components:[
				{kind: "onyx.Grabber",
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
				kind: "onyx.Grabber",
				style: "position:absolute; right:10px;",
				ontap: "closeMapSlideable"}
			]},
			{tag: "div", style: "position:absolute; top:52px; bottom:0; width:100%"},
		]},
		
		{name: "aboutPopup",
		kind: "onyx.Popup",
		centered: true,
		floating: true,
		style: "text-align:center;",
		components:[
			{kind: "enyo.Image", src: "assets/iconSmall.png"},
			{tag: "iframe", style: "border:none; display:block; height:120px;",
			src: "source/content/aboutBox.html"},
			{kind: "onyx.Button", content: "Close", ontap: "hideAbout"}
		]},
		
		{name: "firstUsePopup",
		kind: "onyx.Popup",
		centered: true,
		floating:true,
		style: "text-align:center;",
		components:[
			{kind: "enyo.Image", src: "assets/iconSmall.png"},
			{tag: "iframe",
			style: "border:none; display:block; width:320px; height:240px;",
			src: "source/content/firstUseBox.html"},
			{kind: "onyx.Button", content: "Close", ontap: "hideFirstUse"}
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
		
		if(enyo.webOS) {
			//Stop Screen Timeout
			enyo.webOS.setWindowProperties({ blockScreenTimeout: true });
		}
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
			return true;
		}
	},
	
	//About
	showAbout: function() { this.$.aboutPopup.show(); },
	hideAbout: function() { this.$.aboutPopup.hide(); },
	
	//First Use
	showFirstUse: function() { this.$.firstUsePopup.show(); },
	hideFirstUse: function() { this.$.firstUsePopup.hide(); },
	
	//Preferences
	openPrefSlideable: function() { this.$.prefSlideable.animateToMin(); },
	closePrefSlideable: function() { this.$.prefSlideable.animateToMax(); },
	
	//Map Drive
	openMapSlideable: function() { this.$.mapSlideable.animateToMin(); },
	closeMapSlideable: function() { this.$.mapSlideable.animateToMax(); },
	
	//WiFi Image
	fadeOut: function() {
		enyo.log("Fading Image...");
		this.$.animEngine.startValue = 1.0;
		this.$.animEngine.endValue = 0.5;
		this.$.animEngine.play();
	},
	
	fadeIn: function() {
		this.$.animEngine.startValue = 0.5;
		this.$.animEngine.endValue = 1.0;
		this.$.animEngine.play();
	},
	
	//Animator
	stepAnimation: function(inSender) {
		enyo.log("Stepping Animation. Value: " + inSender.value);
		this.$.phoneImage.applyStyle("opacity", inSender.value);
	},
	
	endAnimation: function(inSender) {
		enyo.log("Stopping Animation");
		this.$.phoneImage.applyStyle("opacity", inSender.endValue);
	},
});

//Preferences Content
enyo.kind({
	name: "PrefsContent",
	components:[
		{kind: "onyx.Groupbox", style: "padding-left:8px; padding-right:8px; padding-top:8px", components:[
			{kind: "onyx.GroupboxHeader", content: "Device Name"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Name"}
			]}
		]},
		{kind: "onyx.Groupbox", style: "padding-left:8px; padding-right:8px; padding-top:8px", components:[
			{kind: "onyx.GroupboxHeader", content: "Device Description"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Description"}
			]}
		]},
		{kind: "onyx.Groupbox", style: "padding-left:8px; padding-right:8px; padding-top:8px", components:[
			{kind: "onyx.GroupboxHeader", content: "Workgroup"},
			{kind: "onyx.InputDecorator", components:[
				{kind: "onyx.Input", placeholder: "Workgroup"}
			]}
		]},
		{kind: "onyx.Groupbox", style: "padding-left:8px; padding-right:8px; padding-top:8px", components:[
		{kind: "onyx.GroupboxHeader", content: "Sharing"},
			{kind: "PrefsFolder", title: "Public"},
			{kind: "PrefsFolder", title: "Internal"},
			{kind: "PrefsFolder", title: "Root"},
		]}
	]
});

//Preferences Folder- Public, Internal, Root etc.
enyo.kind({
	name: "PrefsFolder",
	kind: "Control",
	published:{
		title: "Folder"
	},
	components:[
		{name: "Title", style: "padding-left:8px; padding-right:8px; padding-top:8px;"},
		{kind: "onyx.Drawer", open:false, style: "padding-left:8px; padding-right:8px; padding-bottom:8px;", components:[
			{content: "Available", style: "padding-top:8px;"},
			{content: "Writeable", style: "padding-top:8px;"},
			{content: "Browseable", style: "padding-top:8px;"},
		]},
	],
	create: function() {
		this.inherited(arguments);
		this.$.Title.setContent(this.title);
	}
});