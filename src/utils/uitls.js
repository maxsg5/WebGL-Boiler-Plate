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
