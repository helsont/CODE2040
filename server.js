var request 				= require('request');
var base 						= 'http://challenge.code2040.org/api';
var getString 			= '/getstring';
var token 					= 'ZixiQ3R7l4';
var validateString	= '/validatestring';
var haystack 				= '/haystack';
var validateneedle	= '/validateneedle';
var prefix 					= '/prefix';
var validateprefix  = '/validateprefix';
var time 						= '/time';
var validatetime		= '/validatetime';

// Post request
function post(url, data) {
	console.log(data);
	// Promisify network requests
	var promise = new Promise(function(resolve, reject) {
		request({ 
			url: base + url,
			method: 'POST',
			json: true,
			headers: {'Content-Type' : 'application/json'},
			body: data
		}, 
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve({ response: response, body: body });
			} else {
				reject({ error: error, body: body });
			}
		});
	});
	return promise;
};

function reverse(s){
  return s.split("").reverse().join("");
}

function findNeedle(needle, haystack) {
	var needleIdx;
	haystack.forEach(function(hay, idx) {
		if (hay == needle) {
			needleIdx = idx;
			return;
		}
	});
	return needleIdx;
}

function findNonPrefix(prefix, array) {
	var res = [];
	array.forEach(function(element) {
		if (element.indexOf(prefix) == -1) {
			res.push(element);
		}
	});
	return res;
}

// Reverse a string
function stage1() {
	post(getString, { token: token })
		.then(function(res) {
			var reversedString = reverse(res.body.result);

			console.log('received string: ' + res.body.result);
			console.log('reversed string: ' + reversedString);

			return post(validateString, { token: token, string: reversedString })
		})
		.then(function(res) {
			console.log(res.body);
		})
		.catch(function(err) {
			console.log(err);
		});
}

// Needle in Haystack
function stage2() {
	post(haystack, { token: token })
		.then(function(res) {
			var result = res.body.result;
			var needle = result.needle;
			var haystack = result.haystack;
			var needleIdx = findNeedle(needle, haystack);

			console.log('needle: ' + needle);
			console.log('haystack: ' + haystack);
			console.log('needle idx:' + needleIdx);

			return post(validateneedle, { token: token, needle: needleIdx });
		})
		.then(function(res) {
			console.log(res.body);
		})
		.catch(function(err) {
			console.log(err);
		});
}

// Prefix
function stage3() {
	post(prefix, { token: token })
		.then(function(res) {
			var result = res.body.result;
			var prefixStr = result.prefix;
			var array = result.array;
			var noPrefixArray = findNonPrefix(prefixStr, array);

			console.log('prefixStr: ' + prefixStr);
			console.log('array: ' + array);
			console.log('noPrefixArray:' + noPrefixArray);

			return post(validateprefix, { token: token, array: noPrefixArray });
		})
		.then(function(res) {
			console.log(res.body);
		})
		.catch(function(err) {
			console.log(err);
		});
}

// The dating game
function stage4() {
	post(time, { token: token })
		.then(function(res) {
			var result = res.body.result;
			var date = new Date(result.datestamp);
			var interval = result.interval;
			var ONE_MINUTE = 1000;
			var newDate = new Date(date.getTime() + interval * ONE_MINUTE);

			console.log('date: ' + date);
			console.log('interval: ' + interval);
			console.log('newDate:' + newDate);

			return post(validatetime, { token: token, datestamp: newDate });
		})
		.then(function(res) {
			console.log(res.body);
		})
		.catch(function(err) {
			console.log(err);
		});
}

function runTests() {
	stage1();
	stage2();
	stage3();
	stage4();	
}