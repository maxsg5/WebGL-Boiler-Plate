/**
* converts degrees to radians
*
* @param {float} angle angle in degrees
* @return {float} angle in radians
*/
function degToRad(angle){
    return angle * Math.PI / 180;
}

/**
* randomizes an array
*
* @param {array} array array to shuffle
* @return {none} 
*/
function shuffle(array){
    for(var i = array.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/**
* converts an array of matrices or vectors into a singular
* float32array
*
* @param {array} array array to flatten
* @return {Float32Array} flattened array 
*/
function flatten(array){
    return new Float32Array(array.map(element => [...element]).flat())
}

/**
* generates a random float between min and max
*
* @param {float} min min of range
* @param {float} max max of range
* @return {float} random number between min and max
*/
function randomFloat(min, max){
    return Math.random() * (max - min) + min;
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
