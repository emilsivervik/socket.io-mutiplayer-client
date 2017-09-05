'use strict'

export default class Keyboard{
	constructor(){
		this.keyCodes	= {};
		this.modifiers	= {};
		var self	= this;
		this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
		this._onKeyUp	= function(event){ self._onKeyChange(event, false);};
		document.addEventListener("keydown", this._onKeyDown, false);
		document.addEventListener("keyup", this._onKeyUp, false);

		this.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
		this.ALIAS	= {
			'left'		: 37,
			'up'		: 38,
			'right'		: 39,
			'down'		: 40,
			'space'		: 32,
			'pageup'	: 33,
			'pagedown'	: 34,
			'tab'		: 9
		};
	}

	destroy(){
		document.removeEventListener("keydown", this._onKeyDown, false);
		document.removeEventListener("keyup", this._onKeyUp, false);
	}

	_onKeyChange(event, pressed){
		var keyCode		= event.keyCode;
		this.keyCodes[keyCode]	= pressed;

		this.modifiers['shift']= event.shiftKey;
		this.modifiers['ctrl']	= event.ctrlKey;
		this.modifiers['alt']	= event.altKey;
		this.modifiers['meta']	= event.metaKey;
	}

	pressed(keyDesc){
		var keys	= keyDesc.split("+");
		for(var i = 0; i < keys.length; i++){
			var key		= keys[i];
			var pressed;
			if( this.MODIFIERS.indexOf( key ) !== -1 ){
				pressed	= this.modifiers[key];
			}else if( Object.keys(this.ALIAS).indexOf( key ) != -1 ){
				pressed	= this.keyCodes[ this.ALIAS[key] ];
			}else {
				pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
			}
			if( !pressed)	return false;
		};
		return true;
	}
}
