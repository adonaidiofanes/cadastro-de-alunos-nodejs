module.exports = function(app){

	app.get('/', function(req, res){
		var message = "";

		// Verificar se usuario esta logado
		if(req.session.idUsuario){
			// redirecionar para /lista
			res.redirect('/lista');
			return;
		}

		// se nao estiver logado carrega a pagina de login
		res.render('login/entrar', {message: message});
	});

	app.post('/', function(req, res){
		var login = req.body;
		var connection = app.infra.dbConnection();
		var UsuariosDAO = new app.infra.UsuariosDAO(connection);

		UsuariosDAO.logar(login, function(err, ress){
			if(!ress[0]){
				req.session.destroy(); // destruir sessao
				res.render('login/entrar',  {message: 'Usuário ou senha inválidos!'});
			} else {
				req.session.idUsuario = ress[0].id; // gravar sessao idUsuario
				res.redirect('/lista');
			}
		});

		connection.end();
	});

	app.get('/sair', function(req, res){
		req.session.destroy();
		res.redirect('/');
	});

}