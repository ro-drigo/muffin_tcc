var moneyslider = document.getElementById("moneySlider");
var moneyoutput = document.getElementById("moneyValue");

moneyoutput.innerHTML = moneyslider.value;

moneyslider.oninput = function(){
    moneyoutput.innerHTML = this.value;
}



var years = document.getElementById("yearsSlider");
var yearoutput = document.getElementById("timeValue");

yearoutput.innerHTML = years.value;

years.oninput = function(){
    yearoutput.innerHTML = this.value;
}