const express = require('express')
const { ObjectID, ObjectId } = require('mongodb');
const app = express()

const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
const objectId = new ObjectId()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o13hs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
  try {
    // console.log('hitted main function')
    await client.connect();
    const database = client.db('car_selling');
    const serviceCollection = database.collection('services');
    const reviewCollection = database.collection('reviews');
    const blogCollection = database.collection('blog');
    const ordersCollection = database.collection('orders');
    const usersCollection = database.collection('users');

    console.log('database connected');

    /// Get  For Service and explore
    app.get('/services', async (req, res) => {
      const curser = serviceCollection.find({});
      const data = await curser.toArray();
      res.send(data);
    })

    // post for service and explore add a product

    app.post('/services',async(req,res)=>{
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);

    })


    //Post products
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      // console.log('hit', result);
      res.json(result);
    })

    ///Get products
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const data = await cursor.toArray();
      // console.log('hit', data);
      res.send(data);
    })
    /// Get  For blog
    app.get('/blog', async (req, res) => {
      const curser = blogCollection.find({});
      const data = await curser.toArray();
      res.send(data);
    })

    //Post gor Review 
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      console.log('review');
      const result = await reviewCollection.insertOne(review);
      console.log(result)
      res.json(result);
    })

    // Get For Review
    app.get('/reviews', async (req, res) => {
      const curser = reviewCollection.find({});
      const data = await curser.toArray();
      res.json(data);
    })

    //Delete Api 

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: id };
      
       console.log(query)
      const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id)});
      console.log('delete',result);
      res.send(result.deletedCount > 0);
    })

    ///Make admin
    //post users
     
    app.get('/users', async (req, res) => {
      // console.log(req.query)
      const curser = usersCollection.find({});
      const data = await curser.toArray();
      res.json(data);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('user');
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    })

    app.put('/users', async (req, res) => {
      const user = req.body;
      console.log('put', user)
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, options, updateDoc);
      res.json(result);
    })
    //Admin Role
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      console.log()
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
    //get admin email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })



  }


  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World People!')
})

app.listen(port, () => {
  console.log(`listening to port:${port}`)
})
