const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
 
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftwwmzw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    

    const photoCollection = client.db('galleryPhotos').collection('photos');
    const toyCollection = client.db('toyCollection').collection('toys');

    app.get('/photos', async(req,res) => {
      const cursor = photoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     

   

    app.post('/toys', async(req,res) =>{
      const newToy = req.body;
      console.log(newToy)
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    })

    app.get('/toys', async (req, res) => {
     console.log(req.query.subCategory);
     let query = {};
     if(req.query?.subCategory){
      query ={subCategory: req.query.subCategory}
     }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/toysByEmail',async(req,res) => {
      let query = {};
      if(req.query?.email){
        query={email: req.query.email}
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result)
        })
    
     
  } finally {
    
    
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send(' market is running on server');
})


app.listen(port,() => {
    console.log(`toy server is running on port ${port}`)
})