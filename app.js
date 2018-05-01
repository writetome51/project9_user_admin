const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 600000}}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new GoogleStrategy({
		clientID: '522011558963-stiv9f6m39bkg7ltf1254q2in77jcosd.apps.googleusercontent.com',
		clientSecret: 'BRQWSnuNFKXdREJ_hrJNsTuq',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	(req, accessToken, refreshToken, profile, done) => {
		done(null, profile);
	}
));

router.route('/google')
	.get(passport.authenticate('google', {scope:['profile']}));

router.route('/google/callback')
	.get(passport.authenticate('google', {
		successRedirect: '/form',
		failure: '/'
	}));

app.use('/auth', router);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('index', {
		list: ['Curtis', 'Ben', 'Brad']
	});
});

app.get('/users/:userName', (req, res) => {
	res.rj('someOtherView', {userName: req.params.userName});
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

//client ID:  522011558963-stiv9f6m39bkg7ltf1254q2in77jcosd.apps.googleusercontent.com
//client secret: BRQWSnuNFKXdREJ_hrJNsTuq