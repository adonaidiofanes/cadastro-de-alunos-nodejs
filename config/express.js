var express = require('express');

var load = require('express-load');

var bodyParser = require('body-parser');

var session = require('express-session');

// module.exports: quando alguem der um require,
// automaticamente essa funcao eh chamada

module.exports = function(){

	var app = express();
	app.set('view engine', 'ejs');

	// demonstrar para o express, onde estao
	// localizados nossas views
	app.set('views', './app/views');

	app.use(bodyParser.urlencoded({extended: true}));

	app.use(express.static('public'));

	// setar sessions
	app.use(session({
	  secret: 'adonaidiofanes',
	  resave: false,
	  saveUninitialized: true,
	  // cookie: { secure: true }
	}));

	// tudo carregado pelo node, vai ficar dentro do load
	// vamos falar para carregar todas as rotas
	load('routes', {cwd: 'app'})
		.then('infra')
		.into(app);

	return app;
}
