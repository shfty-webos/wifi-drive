enyo.kind({
	name: "FirstUseContent",
	components: [
		{style: "text-align:center; color:white;", components:[
			{content: "Welcome to WiFi File Sharing", style: "font-weight:bold; font-size: 14pt;"},
			{content: "A Network Share controller for webOS"},
					{tag: "br"},
			{style: "font-size:4;", components:[
				{content: "WiFi File Sharing takes the hassle out of setting up network shares"},
				{tag: "br"},
				{style: "text-align:left; color:white;", components:[
					{content: "Usage:", style: "font-weight:bold;"},
					{content: "1. Simply open it up, and it'll activate Samba"},
					{tag: "br"},
					{content: "2. Open Windows Explorer (Windows) or Finder (OSX)"},
					{tag: "br"},
					{content: "(Let's face it, if you're using Linux you probably know your distro better than I do)"},
					{tag: "br"},
					{content: "3. Your device should appear in the sidebar under Network"},
					{tag: "br"},
					{content: "4. Open it up and start transferring files"},
					{tag: "br"},
					{content: "5. When you're finished and want to deactivate Samba, just close WiFi File Sharing"},
					{style: "margin-top:8px;"}
				]},
			]},
			{style: "font-size:10pt; text-align:center; color:white;", components:[
				{content: "ShiftyAxel, 2012"}
			]}
		]}
	]
});