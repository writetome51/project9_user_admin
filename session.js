const express = require("express");
const session = require('express-session');

let app = express();

app.use(session({
  secret: 'super secret string',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(express.static("./public"));

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  req.customData = 'myCustomData';
  next();
});

app.get('/views', (req, res, next) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
    res.end()
  } else {
    req.session.views = 1;
    res.end('welcome to the session demo. refresh!')
  }
  console.log(req.customData);
});


app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;