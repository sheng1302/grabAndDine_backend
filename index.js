const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSession = require('express-session');
const passport = require('./middlewares/auth');
const controller = require('./controllers');
const models = require('./models');

const PORT = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // (http);

// private channel between p2p
const channel = require('./middlewares/channels')(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(expressSession({
  secret: 'GRABANDDINE - INTERNAL SECRET KEY - 666666',
  resave: false,
  saveUnitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(controller);

// --> following code is being relocated to ./controllers/channels
// app.get('/channel', (req, res) => {
//   // res.send("You are on the right site. : )");
//   res.sendFile(`${__dirname}/views/index.html`);
// });

app.get('*', (req, res) => {
  res.send('ERROR 404');
});

models.sequelize.sync({ force: false })
  .then(() => {
    http.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`);
    });
  });
