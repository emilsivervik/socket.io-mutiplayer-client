'use strict'

import Game from './Game';

let client = new Game();

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

