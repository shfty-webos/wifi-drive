enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	components:[
		{kind: "enyo.Signals", onload: "handleLoad"},
			
		{name: "animEngine",
		kind: "enyo.Animator",
		onStep: "stepAnimation",
		onEnd: "endAnimation",
		easingFunction: enyo.easing.quadInOut,
		duration:500},
		
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
			layoutKind:"FittableColumnsLayout",
			style: "position:absolute; bottom:0; left:0; right:0; height:32px;",
			components:[
				{kind: "onyx.Button",
				content: "Map Drive",
				fit:true,
				ontap: "openMapSlideable"},
				
				{kind: "onyx.Button",
				content: "Preferences",
				ontap: "openPrefSlideable"},
			]}
		]},
	
		{name: "prefSlideable",
		kind: "enyo.Slideable",
		axis: 'h',
		unit: '%',
		min: 0,
		max: 100,
		value: 100,
		style: "position:absolute; top:0; left:0; width:100%; height:100%; background:#EAEAEA;",
		components:[
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
		style: "position:absolute; top:0; left:0; width:100%; height:100%; background:#EAEAEA;",
		components:[
			{kind: "onyx.Toolbar",
			style: "height:32px;",
			components:[
				{id: "grabber",
				kind: "onyx.Grabber",
				style: "position:absolute; right:10px;",
				ontap: "closeMapSlideable"}
			]},
		]},
		
		{name: "aboutPopup",
		kind: "onyx.Popup",
		centered: true,
		floating: true,
		style: "text-align:center;",
		components:[
			{kind: "enyo.Image", src: "assets/iconSmall.png"},
			{tag: "iframe", style: "border:none; display:block; height:120px;",
			src: "source/aboutBox.html"},
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
			src: "source/firstUseBox.html"},
			{kind: "onyx.Button", content: "Close", ontap: "hideFirstUse"}
		]}
	],
	
	handleLoad: function() {
		enyo.log("handleLoad Called");
		enyo.log("Window bounds: X:" + window.innerWidth + " Y:" + window.innerHeight);
		//Setup the right image based on screen size
		if (window.innerWidth >= 768 && window.innerHeight >= 768) {
			this.$.tabletImage.addStyles("display:block;");
		}
		else {
			this.$.phoneImage.addStyles("display:block;");
		}
	},
	
	showAbout: function() { this.$.aboutPopup.show(); },
	hideAbout: function() { this.$.aboutPopup.hide(); },
	
	showFirstUse: function() { this.$.firstUsePopup.show(); },
	hideFirstUse: function() { this.$.firstUsePopup.hide(); },
	
	openPrefSlideable: function() { this.$.prefSlideable.animateToMin(); },
	closePrefSlideable: function() { this.$.prefSlideable.animateToMax(); },
	
	openMapSlideable: function() { this.$.mapSlideable.animateToMin(); },
	closeMapSlideable: function() { this.$.mapSlideable.animateToMax(); },
	
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
	
	stepAnimation: function(inSender) {
		enyo.log("Stepping Animation. Value: " + inSender.value);
		this.$.phoneImage.applyStyle("opacity", inSender.value);
	},
	
	endAnimation: function(inSender) {
		enyo.log("Stopping Animation");
		this.$.phoneImage.applyStyle("opacity", inSender.endValue);
	},
});
