//API COM ARQUITETURA REST E NODE.JS

const express = require('express'); //Controla e acessar rotas, middleware e recursos
const app = express();
const {uuid} = require('uuidv4'); //id universal, id automatizado (foi deprecated, usar o v4)
app.use(express.json()); //O API vai tratar requisições no padrão JSON
const projects = [];
// Middleware: intercepta a requisição, executar algo e depois retoma o processamento 
function logRoutes(request, response, next){
	const {method, url} = request;
	const route = `[${method.toUpperCase()}] ${url}`; //Formatar o que foi enviado, assim: '[GET] https://localhost:3333'
	
	console.log(route);
	
	return next();
}

//Exemplo: https://localhost:3333/projects?title=Node&owner=David

app.use(logRoutes);//O Middleware vai interceptar qualquer rota da nossa app.
				   //Para interceptar uma rota específica, é só por o Middleware no método:
				   //	app.get('/projects', logRoutes, (request, response) ==> { BLOCO DE CÓDIGO }):

app.get('/projects', (request, response) => {
    const {title} = request.query; //query params: parametro de requisição
	const results = title
		? projects.filter(project => project.title.includes(title))
		: projects;
	
	return response.json(results); //Lista todos os projetos*/
});

app.post('/projects', (request, response) => {
	const {title, owner} = request.body; //Pega tudo que está no corpo da requisição	
	const id = uuid();	
	const project = {
		id,
		title,
		owner
	};
	
	projects.push(project);
	
	return response.json(project);
});

app.put('/projects/:id', (request, response) => {
	const {id} = request.params; //rout params: parametro de rota
	const {title, owner} = request.body;
	//Pesquisa o projeto do id informado e retorna o índice, do contrário -1
	const projectIndex = projects.findIndex(project => project.id === id);
	
	if(projectIndex < 0){
		return response.status(400).json({error: 'Project not found.'});//Exibe status de erro
	}
	
	const project = {
		id,
		title,
		owner
	};
	
	projects[projectIndex] = project;
	
	return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
	const {id} = request.params; //rout params: parametro de rota
								 //Pesquisa o projeto do id informado e retorna o índice, do contrário -1
	const projectIndex = projects.findIndex(project => project.id === id);
	
	if(projectIndex < 0){
		return response.status(400).json({error: 'Project not found.'});//Exibe status de erro
	}
	
	projects.splice(projectIndex, 1);//Deleta no índice informado e apenas um ítem ou projeto
	
	return response.status(204).json([]);//Retorna status: "No content"
});

//método p/ configurar a porta de acesso da app, https://localhost:3333
app.listen(3333, () => {
	console.log('Backend started!');
});