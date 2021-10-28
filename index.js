const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const  cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;


// user: geniuscar
// pass: nmXwSyQCkyB9aNLJ

//middleweare cores
app.use(cors());
app.use(express.json());



//mongo db setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ncig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
    try {
      await client.connect();
      console.log('hittting the successfully')
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");

      //get api

      app.get('/services', async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray()
        res.send(services)
      });

      //single service load from id 
      app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting spacice id', id);
        const query = {_id: ObjectId(id)}
        const service = await servicesCollection.findOne(query)
        res.json(service);
      });
      
      // create a document to insert
      //post api
      app.post('/services', async(req,res) =>{
        const service = req.body;
        console.log('hit the post api',service)
        const result = await servicesCollection.insertOne(service);
        console.log(result );
        res.json(result)

      });

      //delete api
      app.delete('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
      })

    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);




//basic server test
app.get('/', (req,res) =>{
    res.send('running my server')
});

app.get('/hello', (req, res) =>{
  res.send('updated here')
});

app.listen(port, () =>{
    console.log("Running server port", port);
})



/*
one time
1.Heroko account open
2.heroko software install

Every Projects
1.git init
2.gitignore (node_modules , .env)
3.push everything to git
4.make sure you have this script: "start": "node index.js"
5.make sure: put process.env.PORT in front of your port number
6.heroko login
7.heroko create(only one time for a project)
8.command: git push heroku main

-------
update:
1.save everything check locally
2.git add, git commit-m, git push
3.git push heroko main
*/