var app = require('./config/express')();

// vamos colocar nosso servidor para rodar
app.listen(3000, function(){
	var dtNow = new Date;
	// essa funcao eh chamada assim que
	// nosso servidor acaba de rodar
	console.log('=====================================');
	console.log('    Servidor rodando: ' + dtNow.getHours() + ":" + dtNow.getMinutes() + ":" + dtNow.getSeconds());
	console.log('=====================================');
});