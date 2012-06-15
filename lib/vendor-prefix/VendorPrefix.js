enyo.vendor = '';

(function() {
	var prefix = '';
	var prefixes = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
	var tmp = document.createElement('div');
	for(i = 0; i < prefixes.length; i++) {
		if(typeof tmp.style[prefixes[i]] != 'undefined') {
			prefix = prefixes[i];
			break;
		}
		else {
			prefix = null;
		}
	}
	switch(prefix) {
		case 'transform':
			prefix = '';
			break;
		case 'WebkitTransform':
			prefix = '-webkit-';
			break;
		case 'MozTransform':
			prefix = '-moz-';
			break;
		case 'OTransform':
			prefix = '-o-';
			break;
		case 'msTransform':
			prefix = '-ms-';
			break;
	}
	enyo.vendor = prefix;
})();