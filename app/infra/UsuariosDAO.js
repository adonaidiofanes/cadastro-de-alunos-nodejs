function UsuariosDAO(connection){
	this._connection = connection;
}

UsuariosDAO.prototype.logar = function(login, callback){
	this._connection.query('SELECT * FROM usuarios WHERE usuario = ? AND senha = ?', [login.usuario, login.senha], callback);
}

UsuariosDAO.prototype.usuarioLogado = function(req){
	// verificar se o usuario esta logado no sistema
	if(!req.session.idUsuario){
		// se nao tiver, redirecionar para a pagina de login
		resposta.render('login/entrar', {message: 'É preciso estar logado no sistema!'});
		return;
	}
	return true;
}

module.exports = function(){
	return UsuariosDAO;
}