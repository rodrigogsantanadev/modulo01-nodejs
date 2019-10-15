const express = require('express');

const server = express();
server.use(express.json());

//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name:" "rodrigo", "email": "rodrigo@email.com"}

//CRUD - Create, Read, Update, Delete.
const users = ['Diego', 'Robson', 'Victor'];

//Exemplo de Middleware Global. 
server.use((req, res, next) => {
  console.time('Request'); 
  console.log(`Método: ${req.method}; URL: ${req.url};`);
  
  next();

  console.timeEnd('Request');
});


//Middleware para verificar se index do array de usuario existe.
function checkUserInArray(req, res, next){

  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({ error: 'User does not exists' });
  }

  //Adicionando uma nova variavel dentro do req.
  req.user = user;
  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});


server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});



//Function que é utilizada como Middleware local na rota.
function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}


server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});


server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});


server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  //Splice percore o array buscando o indice. O segundo parametro é quantos elementos apartir do index deverá ser removido do array.
  users.splice(index, 1); 

  //é uma boa prática ao excluir nao retornar nada. Apenas um send para dar um status code de sucess. 
  return res.send();
});


server.listen(3000);