var rSlider = document.getElementById('rval');
var gSlider = document.getElementById('gval');
var bSlider = document.getElementById('bval');

var rinput = document.getElementById('rinput');
var ginput = document.getElementById('ginput');
var binput = document.getElementById('binput');

var display = document.getElementById('colorDisplay');

//create event listeners for sliders
rSlider.addEventListener('input', function(e) {
    rVal = e.target.value;
    rinput.value = rVal;
    ChangeDisplayColor();
});
gSlider.addEventListener('input', function(e) {
    gVal = e.target.value;
    ginput.value = gVal;
    ChangeDisplayColor();
});
bSlider.addEventListener('input', function(e) {
    bVal = e.target.value;
    binput.value = bVal;
    ChangeDisplayColor();
});

//create event listeners for inputs
rinput.addEventListener('input', function(e) {
    rVal = e.target.value;
    rSlider.value = rVal;
    ChangeDisplayColor();
});
ginput.addEventListener('input', function(e) {
    gVal = e.target.value;
    gSlider.value = gVal;
    ChangeDisplayColor();
});
binput.addEventListener('input', function(e) {
    bVal = e.target.value;
    bSlider.value = bVal;
    ChangeDisplayColor();
});

//dom load event listener
window.addEventListener('DOMContentLoaded', function(e) {
   //set input values to what the slider values are
    rinput.value = rSlider.value;
    ginput.value = gSlider.value;
    binput.value = bSlider.value; 
});

function ChangeDisplayColor(){
    //get the RGB values from the input fields
    var r = rinput.value ;
    var g = ginput.value;
    var b = binput.value;
    display.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
}

//return an object with the RGB values
function RGBval(){
    return {
        r: rinput.value / 255,
        g: ginput.value / 255,
        b: binput.value / 255
    }
}