const express = require("express");
const app = express();
const cors=require("cors");
const server = require("http").createServer(app);
const crypto = require('crypto')
var urls=[]

// Middlewares
app.use(cors())
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
// Templating engine setup
app.set("view engine", "ejs");
// Enpoints
//generarLink
app.post('/generate',(req,res)=>{
  try {
      var newUrl=crypto.randomBytes(3).toString("hex");
      urls.push({shorter:newUrl, secreto:req.body.link, count:0, cant:req.body.cant})
      res.json( {message: "all correct", newLink:"http://localhost:3030/"+newUrl} )
  } catch (error) {
      res.status(400)
      res.json( {message: error.message} )
  }
})
//encontrarSecreto
app.get('/:id',(req,res)=>{
  try {
      let data=getSecret(req.params.id)
      if (String(data)!=='') {
        if (data.count<=data.cant) {
          res.render("index", { mes:data.secreto});
        } else {
          res.render("index", { mes:"Secret no longer valid, times that it has been tried to read: "+(data.count-1)+" of "+data.cant});
        }        
      } else {
          res.status(400)
          res.render("index", { mes:"This code for get a secret don't exist"});
      }
  } catch (error) {
      res.json( {message: error.message} )
  }
})
const getSecret=(code)=>{
  var secreto=[]
  urls.map((data, index)=>{
      code===data.shorter&&(urls[index].count=(urls[index].count+1),secreto=urls[index])
  })
  return secreto
}
// Starting server.
server.listen(3030, () => {
  console.log("Listening on port 3030...");
});
