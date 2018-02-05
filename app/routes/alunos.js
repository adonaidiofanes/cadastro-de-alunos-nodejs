// Arquivo que refine as rotas para os alunos
var request = require('request');
var async = require('async');

const limite = 5;

module.exports = function(app){

	var auth = function(req, res, next) {
		if (req.session && req.session.idUsuario){
			return next();
		} else{
			res.render('login/entrar', {message: 'É preciso estar logado no sistema!'});
			return;
		}
	};

	app.get('/listarCursos/:id', auth, function(req, resp){

 		var id = req.params.id;
 
		request('http://desenvolvimento.epsjv.fiocruz.br/epsjv/json/sca', function (error, response, body) {
		  // console.log('error:', error); // Print the error if one occurred
		  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		  // console.log('body:', body); // Print the HTML for the Google homepage.

		  	var arrCursos = JSON.parse(body);

			var arr = {
			    todosCursos: [],
			    cursosSelecionados: []
			};

			for(var i=0; i<arrCursos.cursos.length; i++){
				var titulo = arrCursos.cursos[i].curso.titulo;
				var tipo = arrCursos.cursos[i].curso.tipo;
				var idCurso = arrCursos.cursos[i].curso.id;

			    arr.todosCursos.push({ 
			        "titulo" : titulo,
			        "tipo"  : tipo,
			        "id"       : idCurso,
			    });
			}

			var connection = app.infra.dbConnection();
			var AlunosDAO = new app.infra.AlunosDAO(connection);

			AlunosDAO.cursoByIdAluno(id, function(err, res){
			  	var a = JSON.stringify(res);
			  	var arrCursosSelecionados = JSON.parse(a);

			  	for(var i=0; i<arrCursosSelecionados.length; i++){
			  		arr.cursosSelecionados.push({
			  			"id": arrCursosSelecionados[i].id,
			  			"idCurso": arrCursosSelecionados[i].idCurso,
			  			"fkAluno": arrCursosSelecionados[i].fkAluno
			  		});
			  	}

				connection.end();
			  	resp.json(arr);
			  	resp.end();

			});

		});


	});

	// Vamos atender as requisicoes via GET
	app.get('/lista/', auth, function(requisicao, resposta){
		// conectar ao mysql
		var connection = app.infra.dbConnection();
		var AlunosDAO = new app.infra.AlunosDAO(connection);

		// controle de paginacao
		var idPagina = 1;
		var offset = 0;

		if(requisicao.query.pagina && requisicao.query.pagina != 1){
			idPagina = requisicao.query.pagina;
			offset = (idPagina - 1) * limite;
		}

		async.parallel({
		    totalAlunos: function(callback) {
				AlunosDAO.contarAlunos(function(terr, tres){
			        callback(null, tres[0].total);
		        });
		    },
		    listaAlunos: function(callback) {
				AlunosDAO.lista(offset, limite, function(errLista, resultLista){
					// resposta.render('alunos/listagem', {lista: results, mensagem: ""});
					callback(null, resultLista);
				});
		    }
		}, function(err, results) {

			var arr = [];
			var numeroPaginas = Math.round(results.totalAlunos/limite);
			
			arr.push({lista: results.listaAlunos});
			arr.push({totalAlunos: results.totalAlunos, totalPaginas: numeroPaginas});

			resposta.render('alunos/listagem', {lista: arr, mensagem: ""});

		});

		connection.end();

	});

	// Rota para a pagina do formulario de cadastro
	app.get('/alunos/form', auth, function(requisicao, resposta){

		resposta.render('alunos/form', 
			{
				aluno: {dados:'', telefones:''}, 
				acao: { botao: 'Cadastrar', url: '/alunos/salva' }
			}
		);
	});
	
	// Rota para pegar dados enviados no formulario de cadastro
	app.post('/alunos/salva', auth, function(requisicao, resposta){
		// resgatar dados preenchidos no formulario
		var aluno = requisicao.body;

		var connection = app.infra.dbConnection();
		var AlunosDAO = new app.infra.AlunosDAO(connection);
		
		delete(aluno.id);

		var dadosAluno = {nome : aluno.nome, email: aluno.email};

		function cursosInternoInserir(aluno, idGravado){
			if(aluno.cbCursos && idGravado){
				for(var i=0; i<aluno.cbCursos.length; i++){
					var dados = {fkAluno : idGravado, idCurso : aluno.cbCursos[i]};
					AlunosDAO.cursosInserir(dados);
				}
			}
		}

		function telefoneInternoInserir(aluno, idGravado){
			if(aluno.telefones){
				for(var i=0; i<aluno.telefones.length; i++){
					if(aluno.telefones[i] != ''){
						var dados = {fkAluno : idGravado, telefone : aluno.telefones[i]};
						AlunosDAO.telefoneInserir(dados);
					}				
				}
			}
		}

		async.series({
 			inserir: function(callback) {
				AlunosDAO.salva(dadosAluno, function(erros, result){
					callback(null, result.insertId);
				});

		    },
		    totalAlunos: function(callback) {
				AlunosDAO.contarAlunos(function(terr, tres){
			        callback(null, tres[0].total);
		        });
		    },
		    listaAlunos: function(callback) {
				AlunosDAO.lista(0, limite, function(errLista, resultLista){
					callback(null, resultLista);
				});
		    },
		    lista: function(callback){
		    	AlunosDAO.lista(0, 5, function(lErr, lRes){
		    		callback(null, lRes);
		    	});
		    }

		},
		function(err, result) {
			cursosInternoInserir(aluno, result.inserir);
			telefoneInternoInserir(aluno, result.inserir);

			var mensagem = {tipo: "success", texto: "Cadastro realizado com sucesso!"};
			
			if(err){
				mensagem = {tipo: "danger", texto: "Ocorreu um erro ao realizar o cadastro!"};
			}

			var arr = [];
			var numeroPaginas = Math.round(result.totalAlunos/limite);
			
			arr.push({lista: result.listaAlunos});
			arr.push({totalAlunos: result.totalAlunos, totalPaginas: numeroPaginas});

			resposta.render('alunos/listagem', {lista: arr, mensagem: mensagem});

			connection.end();
		});

	});

	app.get('/alunos/editar', auth, function(req, resposta){

	  	var id = req.query.id;
		var connection = app.infra.dbConnection();
		var AlunosDAO = new app.infra.AlunosDAO(connection);

		async.parallel({
		    dadosTelefone: function(callback) {

		    	var listaTelefone = [];
				AlunosDAO.telefoneByIdAluno(id, function(terr, tres){
					listaTelefone.push(tres);				

			        setTimeout(function() {
			            callback(null, listaTelefone);
			        }, 200);

		        });
		    },
		    dadosAluno: function(callback) {
		    	var aluno = "";
				AlunosDAO.consultaPorId(id, function(err, res){
					aluno = res[0];;
				
			        setTimeout(function() {
			            callback(null, aluno);
			        }, 100);

		        });
		    }
		}, function(err, results) {

		    var arrAluno = [];

		    arrAluno.push({dados: results.dadosAluno, telefones: results.dadosTelefone[0]});

		    connection.end();

			resposta.render('alunos/form', 
				{
					aluno: arrAluno[0], 
					acao: { botao: 'Atualizar', url: '/alunos/editar' }
				}
			);

		});

	});

	// Rota para pegar dados enviados no formulario de atualizacao
	app.post('/alunos/editar', auth, function(requisicao, resposta){
		// resgatar dados preenchidos no formulario
		var aluno = requisicao.body;
		
		var connection = app.infra.dbConnection();
		var AlunosDAO = new app.infra.AlunosDAO(connection);

		AlunosDAO.cursosApagarTodosPorIdAluno(aluno.id);
		AlunosDAO.telefoneApagarTodosPorIdAluno(aluno.id);

		if(aluno.cbCursos){
			for(var i=0; i<aluno.cbCursos.length; i++){
				var dados = {fkAluno : aluno.id, idCurso : aluno.cbCursos[i]};
				AlunosDAO.cursosInserir(dados);
			}
		}

		if(aluno.telefones){
			for(var i=0; i<aluno.telefones.length; i++){
				if(aluno.telefones[i] != ''){
					var dados = {fkAluno : aluno.id, telefone : aluno.telefones[i]};
					AlunosDAO.telefoneInserir(dados);
				}				
			}
		}

		AlunosDAO.atualiza(aluno, function(erros, resultados){
			var mensagem = {tipo: "success", texto: "Cadastro atualizado com sucesso!"};
			
			if(erros){
				mensagem = {tipo: "danger", texto: "Ocorreu um erro ao atualizar o cadastro!"};
			}

			async.series({
			    totalAlunos: function(callback) {
					AlunosDAO.contarAlunos(function(terr, tres){
				        callback(null, tres[0].total);
			        });
			    },
			    listaAlunos: function(callback) {
					AlunosDAO.lista(0, limite, function(errLista, resultLista){
						callback(null, resultLista);
					});
			    },
			    lista: function(callback){
			    	AlunosDAO.lista(0, 5, function(lErr, lRes){
			    		callback(null, lRes);
			    	});
			    }

			},
			function(err, result) {

				var arr = [];
				var numeroPaginas = Math.round(result.totalAlunos/limite);
				
				arr.push({lista: result.listaAlunos});
				arr.push({totalAlunos: result.totalAlunos, totalPaginas: numeroPaginas});

				resposta.render('alunos/listagem', {lista: arr, mensagem: mensagem});

				connection.end();
			});
		});
	});

	// Rota para pegar dados enviados no formulario de delete
	app.get('/alunos/apagar', auth, function(requisicao, resposta){
		var id = requisicao.query.id;

		var connection = app.infra.dbConnection();
		var AlunosDAO = new app.infra.AlunosDAO(connection);

		AlunosDAO.apagar(id, function(erros, resultados){
			var mensagem = {tipo: "success", texto: "Cadastro apagado com sucesso!"};
			
			if(erros){
				mensagem = {tipo: "danger", texto: "Ocorreu um erro ao apagar o cadastro!"};
			}

			async.series({
			    totalAlunos: function(callback) {
					AlunosDAO.contarAlunos(function(terr, tres){
				        callback(null, tres[0].total);
			        });
			    },
			    listaAlunos: function(callback) {
					AlunosDAO.lista(0, limite, function(errLista, resultLista){
						callback(null, resultLista);
					});
			    },
			    lista: function(callback){
			    	AlunosDAO.lista(0, 5, function(lErr, lRes){
			    		callback(null, lRes);
			    	});
			    }

			},
			function(err, result) {

				var arr = [];
				var numeroPaginas = Math.round(result.totalAlunos/limite);
				
				arr.push({lista: result.listaAlunos});
				arr.push({totalAlunos: result.totalAlunos, totalPaginas: numeroPaginas});

				resposta.render('alunos/listagem', {lista: arr, mensagem: mensagem});

				connection.end();
			});			
		});		
	});

}
