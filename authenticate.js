const passport = require('passport');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const users = [
	{id: 1, username: 'ben', password: 'abcdefgh', email: 'ben@somesite.com', favoritePersonID:2},
	{id: 2, username: 'rob', password: '12345678', email: 'rob5000@gmail.com', favoritePersonID:1},
	{id: 3, username: 'sean', password: 'zxcvbnma', email: 'sean100@outlook.com', favoritePersonID:2},
	{id: 4, username: 'doug', password: 'qwertyui', email: 'doug1000@gmail.com', favoritePersonID:1},
	{id: 5, username: 'patty', password: 'asdfghjk', email: 'patty1000@yahoo.com', favoritePersonID:2},
	{id: 6, username: 'willy', password: 'poiuytre', email: 'willy@examplesite.com', favoritePersonID:1},
	{id: 7, username: 'benji', password: 'lkjhgfds', email: 'benji500@gmail.com', favoritePersonID:2},
	{id: 8, username: 'ray', password: 'mnbvcxza', email: 'ray@somesite.com', favoritePersonID:1},
	{id: 9, username: 'bowser', password: 'shayjelly', email: 'bowser@yahoo.com', favoritePersonID:2},
	{id: 10, username: 'koopa', password: 'jbsmoove', email: 'koopa@gmail.com', favoritePersonID:1},
];

console.log(JSON.stringify(users));

app.use('/', express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.listen('3000');

app.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		console.log(err, user, info);
		if (user) {
			console.log('here passport');
			//res.redirect('/welcome.html');
			res.sendFile(path.join(__dirname + '/protected/welcome.html'));
		} else {
			res.send({error: err, info: info});
		}
	})(req, res, next);
});


function findByUsername(username, callback) {
	for (let i = 0, len = users.length; i < len; i++) {
		const user = users[i];
		if (user.username === username) {
			// callback takes arguments (error,user)
			return callback(null, user);
		}
	}
	return callback(null, null);
}


passport.use(new LocalStrategy({
		// this maps the field names in the html form to the passport stuff
		usernameField: 'username',
		passwordField: 'password'
	},
	function (username, password, done) {
		// replace this with a DB QUERY function later
		findByUsername(username, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				console.log('Invalid username');
				return done(null, false, {message: 'Invalid username.'});
			} else {
				if (user.password === password) {
					console.log('valid username and password');
					return done(null, user);
				} else {
					console.log('valid username but password is wrong');
					return done(null, false, {message: 'Invalid password.'});
				}
			}
		});
	}
));



