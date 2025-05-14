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
        const db = client.db('ranking_cidades');
        const collection = db.collection(coll);

        return {db, collection};

    } catch (e) {
        console.log(e);
        await client.close();
    }
}

// Define routes before starting the server
app.get('/', async (req, res) => {
    let connection = await run('ranking_cidades2');
    let {db, collection} = connection;
    collection = await collection.find().toArray()
    const rankings = collection[0].rankings;
    res.send(rankings);
    await client.close();
});

app.get('/ranks/:id', async (req, res) => {
    let connection = await run('ranking_cidades2');
    let {db, collection} = connection;

    let rankings = await collection.find().toArray()
    rankings = rankings[0].rankings;
    
    let targeted_ranking = rankings.map((el) => {
        return {
            name: el.city,
            [req.params.id]: el[req.params.id]
        }
    }).sort((a, b) => {
        return a[req.params.id] - b[req.params.id]
    })

    //collection = await collection.findOne({ _id: new ObjectId(req.params.id)})
    res.send(targeted_ranking)
})

app.get('/city/:name', async(req, res) => {
    let connection = await run('ranking_cidades2');
    let {db, collection} = connection;

    collection = await collection.find().toArray()
    const rankings = collection[0].rankings;
    
    let targeted_city = rankings.find((el) => {
        return el.codenome === req.params.name
    })
    res.send(targeted_city)
});

app.post('/', async(req, res) => {
    connection = await run('ranking_cidades2');
    let {db, collection} = connection;
    collection = await collection.insertOne(req.body)
    res.send(collection)
});

app.put('/:id', async(req, res) => {
    connection = await run('ranking_cidades2');
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
    connection = await run('ranking_cidades2');
    let {db, collection} = connection;

    collection = await collection.deleteOne({ _id: new ObjectId(req.params.id)})
    res.send(collection)
});

// Start server
app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});
