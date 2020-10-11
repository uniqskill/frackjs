const generateRoute = require('./generateRoute')
const fs = require('fs');

const config = { 
  serverDir: 'server',
  clientSrc: 'client/src'
}

const ast = {
  name: 'products', 
  methods: [{
    name: 'getOne',
    args: ['id'],
  },{
    name: 'getMany',
    args: ['params'],
  },{
    name: 'create',
    args: ['params'],
  },{
    name: 'update',
    args: ['id', 'params'],
  },{
    name: 'delete',
    args: ['id'],
  }]
}

function generateRoutes(ast){
  return ast.methods.map(method => {
    return generateRoute(ast.name, method)
  }).join("\n\n")
}

function createDirectoryChain(directory){
  
  let prevDir = ''
  directory.split('/').forEach(d => {
    if(prevDir!==''){
      d = prevDir + '/' + d
    }

    if (!fs.existsSync(d)){
      fs.mkdirSync(d);
      prevDir = d
    }
  })
}

function buildFileContent(ast){
  return "const products = require('../server/products');"+'\n\n'+
  "module.exports = function productsRoutes(app){"+'\n\n'+
  generateRoutes(ast)+'\n'+
  '};'
}

function generateRoutesFile(ast){

  const content = buildFileContent(ast)
  const directory = config.serverDir.concat('/routes')
  const filename = ast.name+'Routes.js'

  createDirectoryChain(directory)

  fs.writeFile([directory,filename].join('/'), content, function(err) {
    if(err) {
      console.log(err)
    }
    else{
      console.log("Generated -- " + [directory,filename].join('/'))
    }
  })
}

generateRoutesFile(ast)