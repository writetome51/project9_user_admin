const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
const ajaxGet  = require("./ajax_functions").ajaxGet;
const http = require('http');

let app = express();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	// Call this...
	http.get('users.json', ()=>{});
	// ...instead of this:
	ajaxGet('users.json', (users)=>{
		res.render('user-manager', {
			title:'Users',
			users:users
		});
	});
});

app.get('/users/:userName', (req, res) => {
	res.render('user-view', {userName: req.params.userName});
});


app.get('/form', (req, res) => {
	console.log(req.user);
	res.render('form', {user: req.user});
});

app.post('/create', (req, res) => {
	let user = {
		name: req.body.name,
		email: req.body.email
	};

	res.end(`Name: ${user.name}\nEmail: ${user.email}`)
});

app.listen(3000);

console.log('listening on port 3000');