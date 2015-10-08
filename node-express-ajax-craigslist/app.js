var express = require('express');
var request = require('request');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

app.get('/', function(req, res) {res.render('index')});

app.get('/searching', function(req, res){
	// input value from search
	var val = req.query.search;
	console.log(val);

	var url = "http://csdev-seb:8180/solr-example/dev_DAM/select?q=invnumber%3Akmssp721&wt=json&indent=true";

	//console.log(url);

	// request module is used to process the yql url and return the results in JSON format
	request(url, function(err, resp, body) {
		resultsArray = [];

		body = JSON.parse(body);

		console.log(body);
		// logic used to compare search results with the input from user
		if (body.response.numFound == 0) {
			res.send("No results found. Try again.");
		} else {
			var results = body.response.docs;
			for (var i = 0; i < results.length; i++) {
				resultsArray.push(
						{invnumber:results[i]["invnumber"], link:results[i]["link"], created:results[i]["created"]}
				)
			}
			console.log(resultsArray);
			res.send(resultsArray);			
		}

	});



	// testing the route
	//res.send("WHEEE");

});


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
