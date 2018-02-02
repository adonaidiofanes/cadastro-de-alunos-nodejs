function AlunosDAO(connection){
	this._connection = connection;
}

AlunosDAO.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM alunos', callback);
}

AlunosDAO.prototype.salva = function(aluno, callback){
	this._connection.query("INSERT INTO alunos SET ?", aluno, callback);
}

AlunosDAO.prototype.consultaPorId = function(id, callback){
	this._connection.query("SELECT * FROM alunos WHERE id = ?", id, callback);
}

AlunosDAO.prototype.atualiza = function(aluno, callback){
	this._connection.query("UPDATE alunos SET nome = ?, email = ?  WHERE id = ?", 
		[aluno.nome, aluno.email, aluno.id], 
		callback);
}

AlunosDAO.prototype.apagar = function(id, callback){
	this._connection.query("DELETE FROM alunos WHERE id = ?", id, callback);
}

AlunosDAO.prototype.cursoByIdAluno = function(id, callback){
	this._connection.query("SELECT * FROM alunos_curso WHERE fkAluno = ?", id, callback);
}

AlunosDAO.prototype.cursosApagarTodosPorIdAluno = function(idAluno, callback){
	this._connection.query("DELETE FROM alunos_curso WHERE fkAluno = ?", idAluno, callback);
}

AlunosDAO.prototype.cursosInserir = function(dados, callback){
	var sql = "INSERT INTO alunos_curso SET ?";
	this._connection.query(sql, [dados], callback);
	// console.log('-------------|----------------');
	// console.log(q.sql);
	// console.log('-------------|----------------');
}

AlunosDAO.prototype.telefoneInserir = function(dados, callback){
	var sql = "INSERT INTO alunos_telefone SET ?";
	this._connection.query(sql, [dados], callback);
}

AlunosDAO.prototype.telefoneApagarTodosPorIdAluno = function(idAluno, callback){
	this._connection.query("DELETE FROM alunos_telefone WHERE fkAluno = ?", idAluno, callback);
}

AlunosDAO.prototype.telefoneByIdAluno = function(id, callback){
	this._connection.query("SELECT * FROM alunos_telefone WHERE fkAluno = ?", id, callback);	
}

module.exports = function(){
	return AlunosDAO;
}

/*AlunosDAO.prototype.salva = function(aluno, callback){
	var aluno = {};
	var q = this._connection.query("INSERT INTO alunos SET ?", aluno, callback);
	console.log(q.sql);
	console.log('!!!!!!!!');
}*/