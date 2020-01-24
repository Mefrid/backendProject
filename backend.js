'use strict';
const http = require('http'),
  fs = require('fs'),
  url = require('url');

const nodeStatic = require('node-static');
const PORT = 8080;

let studentsArray = [
  'Алексей Петренко',
  'Павел Романов',
  'Анастасия Терещук',
  'Иван Лоев'
]

const server = http.createServer(function (request, response) {
  console.log(request.method)
  if (request.url === '/') {
    fs.readFile(__dirname + '/index.html', (err, data) => {
      if (err) {
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200);
      response.end(data);
    })
  } else if(request.url.includes('/api/students')) {
    switch(request.method) {
      case 'GET':
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        response.end(JSON.stringify(studentsArray));
        break;

      case 'POST':
        const newName = decodeURI(request.url).slice(14);
        console.log(newName)
        studentsArray.push(newName);

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        response.end(JSON.stringify(studentsArray));
        break;

      case 'DELETE':
        const deletingIndex = request.url.slice(21);
        studentsArray = studentsArray.filter( (name, index) => {
          return index != deletingIndex;
        });

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        response.end(JSON.stringify(studentsArray));
    }
  } else {
    fs.readFile(__dirname + request.url, function (err, data) {
      if (err) {
        console.log('Ошибочка', request.url, err)
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200);
      response.end(data);
    });
  }
}).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});