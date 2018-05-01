const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());


app.get('/', (req, res) => {
	res.cookie('myCookie', 'myValue');
	res.cookie('anotherCookie', '1',
		{expires: new Date(Date.now() + 9000), httpOnly: true}
	);
	res.cookie('anotherCookie', '1',
		{maxAge: 90000}
	);

	console.log('cookies: ', req.cookies);
	res.end('Hello World');
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});