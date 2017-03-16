// var Sequelize = require('sequelize');
// var sequelize = new Sequelize(databaseURL);
// var databaseURL = 'sqlite://db';
var moment = require('moment');
var http = require('http');
var twilio = require('twilio');
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

var listSms = [];
var contactList =[];

var users = [
	{
		username: "KOITA",
		phoneNumber: "+16467658666"
		//14696450110
	}
];
var twilioNumber = "14696450110";

var loggedInUser = users[0];

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

// set of views engine for handlebars ejs for ejs
app.set('view engine', 'ejs')

// set the route from login page to  the home page
app.get('/', function(req, res){
	console.log("hi this list rendering ");	
	 res.render('landing-page');
	//redirect("/");
});
app.get('/login', function(req, res){  
 res.render('index', {moment: moment, listMessages: listSms});
});

//********************************************

// set the route from the home to the sign up page

app.get('/sign_up', function(req, res){
	console.log("hi this list rendering ");	
	  res.render('sign_up');
	// redirect("/");
});
app.post('/sign_up', function(req, res){  
	var newContact = {	
		email:req.body.email,
		psw:req.body.psw,
		psw_repeat:req.body.psw_repeat		
	}
	contactList.push(newContact);
	console.log("hi hi guys"+newcontact);
	res.redirect("/");
});







// set the route for the home page
app.get('/sms', function(req, res){
	console.log("hi this list rendering ");
	
	// res.render('index', {listMessages: listSms});
	res.redirect("/");

});

// create   route for  sms
app.post('/sms', function(req, res){

	var phoneNumbers = users.map(user => "+"+user.phoneNumber);
	// var d = new Date();
	   var d=moment().format('LLLL');
	var newSms = {
		//'receiver': phoneNumbers.join(","),
		//'receiver':"+16467658666",
		'receiver':loggedInUser.phoneNumber,

		// 'sender':loggedInUser.phoneNumber,
		'sender': twilioNumber ,
		'message': req.body.message,
		'dateTime': d
	}

	listSms.push(newSms);
	console.log(listSms);
	console.log('Hi guys this my express app');
    //var accountSid =node.env.accountSid;
	var accountSid ='AC52dd23a570e46e5d3799d53bfce4894b'; 
	var authToken ='8bfb4ca1d81077737fcb6b207e222956'; 
	// Send the text message.
	var client = twilio(accountSid, authToken);
    // var twiloNumber = 14696450110;
	//  var from = demo ? twiloNumber : newSms.sender;
	//  if (demo) {

	// }

	
	client.sendMessage({

	  to:newSms.receiver,
	  from: twilioNumber,
	  body: req.body.message
	  
	}, function(err, data){
		if(err) {
			console.log(err);
			res.status(500).send("Error!");
		} else {
			console.log(data);

		}
	});	
	res.redirect('/login');

});
http.createServer(app).listen(port, function () {
   console.log("Express server listening on port "+ port);
  
});
/*************    set up of stripe ********** */


// var publicStripeApiKey = '...';
// var publicStripeApiKeyTesting = '...';

// Stripe.setPublishableKey(publicStripeApiKey);

// app.post('/stripe', function stripeResponseHandler (status, response) {
// 	if (response.error) {
// 		$('#error').text(response.error.message);
// 		$('#error').slideDown(300);
// 		$('#stripe-form .submit-button').removeAttr("disabled");
// 		return;
// 	}
	  
// 	var form = $("#payment-form");
// 	form.append("<input type='hidden' name='stripeToken' value='" + response.id + "'/>");

// 	$.post(
// 		form.attr('action'),form.serialize(),function(status){
// 				if (status != 'ok') {
// 				$('#error').text(status);
// 				$('#error').slideDown(300);
// 			}
// 		  else {
// 		    $('#error').hide();
// 		    $('#success').slideDown(300);
// 		  }
// 		  $('.submit-button').removeAttr("disabled");
// 		}
// 	);
// }

// // http://stripe.com/docs/tutorials/forms
// $("#payment-form").submit(function(event) {
// 	$('#error').hide();
// 	// disable the submit button to prevent repeated clicks
// 	$('.submit-button').attr("disabled", "disabled");

// 	var amount = $('#cc-amount').val(); // amount you want to charge in cents
// 	Stripe.createToken({
// 	number: $('.card-number').val(),
// 	cvc: $('.card-cvc').val(),
// 	exp_month: $('.card-expiry-month').val(),
// 	exp_year: $('.card-expiry-year').val()
// 	}, amount, stripeResponseHandler);

// 	// prevent the form from submitting with the default action
// 	return false;
// });





