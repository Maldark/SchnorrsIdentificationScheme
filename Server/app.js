const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var bigInt = require("big-integer");

app.use(bodyParser.json());

var k = 10;

var Q = 13; // 1024bit prime
var q = 3; // 160bit prime, factor of Q-1, Q-1 = 4 * q
var g = 25; // g^q = 1 mod Q
var y = bigInt(g).pow(113).mod(q); // g^x mod q, hacked with permanent x
var t;
var c;
var c_dec;
var S_alpha;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CalculateRandomC() {
	var temp = "";

	for(var i = 0; i < k; i++) {
		temp += getRandomInt(0, 1);
	}

	return temp;
}

// Send g, q, y to client
app.get('/login1', function (req, res) {

	var data = {
		Q: Q,
		q: q,
		g: g
	};

	res.json(data);
})

// Receive t and reply with c
app.post('/login2', function (req, res) {

	t = bigInt(req.body.t);
	// console.log("Received t: " + t.value)

	c = CalculateRandomC();
	c_dec = parseInt(c, 2);
	var data = { c: c };

	res.json(data);
})

// Receive S_alpha and determine login validity
app.post('/login3', function (req, res) {

	S_alpha = req.body.S;
	// console.log("Received S_alpha: " + S_alpha);

	var a1 = bigInt(g).pow(S_alpha);
	var a2 = bigInt(y).pow(c_dec);

	console.log("t: " + t);
	console.log("test: " + a1.mod(q) * a2);

	var valid = t == a1.mod(q) * a2;
	console.log("valid: " + valid);


	res.send("Thanks");
})

app.get('/', function (req, res) {
	res.sendFile('public/index.html' , { root : __dirname});
})

app.get('/css/styles.css', function (req, res) {
	res.sendFile('public/css/styles.css' , { root : __dirname});
})

app.get('/js/scripts.js', function (req, res) {
	res.sendFile('public/js/scripts.js' , { root : __dirname});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})