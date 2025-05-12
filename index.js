const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://admin:Riot!2007@cluster0.hasqapk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const app = express();

// 🔧 Middleware to parse JSON bodies
app.use(express.json());

//connection
async function run(coll) {
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const collection = db.collection(coll);

        return {db, collection};

    } catch (e) {
        console.log(e);
        await client.close();
    }
}

// Define routes before starting the server
app.get('/', async (req, res) => {
    let connection = await run('movies');
    let {db, collection} = connection;
    collection = await collection.find().toArray()
    res.send(collection.length);
    await client.close();
});

app.get('/:id', async (req, res) => {
    let connection = await run('movies');
    let {db, collection} = connection;

    collection = await collection.findOne({ _id: new ObjectId(req.params.id)})
    res.send(collection)
})

app.post('/', async(req, res) => {
    connection = await run('movies');
    let {db, collection} = connection;
    collection = await collection.insertOne(req.body)
    res.send(collection)
});

app.put('/:id', async(req, res) => {
    connection = await run('movies');
    let {db, collection} = connection;

   collection = await collection.updateOne({
        _id: new ObjectId(req.params.id)
   }, 
    {
        $inc: {
            counter: 1
        }
    })
    res.send(collection);
});

app.delete('/:id', async(req, res) => {
    connection = await run('movies');
    let {db, collection} = connection;

    collection = await collection.deleteOne({ _id: new ObjectId(req.params.id)})
    res.send(collection)
});

// Start server
app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});
