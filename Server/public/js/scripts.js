// Define modulus operation for negative numbers
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, callback, data, contentType)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    xmlHttp.open("POST", theUrl, true); // true for asynchronous

	xmlHttp.setRequestHeader("Content-type", contentType);

    xmlHttp.send(data);
}

function RequestParameters() {
	// Request parameters from server
	httpGetAsync(window.location.href + "login1", function(res) {
		console.log("Received parameters: " + res);
		var data = JSON.parse(res)

		// Save the data
		Q = data.Q;
		q = data.q;
		g = data.g;

		console.log("g: " + data.g);
		console.log("x: " + x);
		console.log("x_dec: " + x_dec);
		console.log("Q: " + Q);
		// t = Math.pow(data.g, x_dec) % Q;
		t = bigInt(data.g).pow(x_dec).mod(Q);
		console.log("t: " + t.value)


		// Transmit t
		httpPostAsync(window.location.href + "login2", function(res) {
			data2 = JSON.parse(res);

			c = data2.c;
			c_dec = parseInt(c, 2);

			S_alpha = (r_alpha - c_dec * x_dec).mod(q);
			console.log("S_alpha: " + S_alpha);


			// Transmit S_alpha
			httpPostAsync(window.location.href + "login3", function(res) {
				// data2 = JSON.parse(res);

				// c = data2.c;
				// c_dec = parseInt(c, 2);

				// S_alpha = (r_alpha - c_dec * x_dec).mod(q);
				// console.log("S_alpha: " + S_alpha);

				

			}, JSON.stringify({ S: S_alpha }), "application/json");


		}, JSON.stringify({ t: t.value }), "application/json");
	});
};

var password = "h"
var encoding = [];

for (var i = 0; i < password.length; i++) {
	encoding.push(['0' + password.charCodeAt(i).toString(2)]);
	//console.log(password[i], password.charCodeAt(i), encoding[i]);
}

var x = encoding.join('');
var x_dec = parseInt(x, 2);
//console.log("Result: " + x);

var r_alpha = 5; // 0 < r_alpha < q
var Q;
var q;
var g;
var c;
var c_dec;
var S_alpha;

RequestParameters();