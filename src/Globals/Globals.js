'use strict'

export function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(let i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export function v_lerp(v,tv,t){ 
    return { 
        x: lerp(v.x, tv.x, t), 
        y: lerp(v.y, tv.y, t)
    }
}

export function lerp(p, n, t){ 
    let _t = Number(t); 
    _t = (Math.max(0, Math.min(1, _t))).fixed(); 
    return (p + _t * (n - p)).fixed(); 
}

export function v_add(a,b) { 
    return { 
        x:(a.x+b.x).fixed(), 
        y:(a.y+b.y).fixed() 
    }
}

export function pos(a){ 
    return {
        x: a.x,
        y: a.y
    }
}

export function fixed(n){
    n = n || 3; 
    return parseFloat(this.toFixed(n)); 
}
