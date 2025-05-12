const express = require("express");
const { MongoClient, Db } = require('mongodb');

const uri = "mongodb+srv://admin:Riot!2007@cluster0.hasqapk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

//async await
async function run(coll) {
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const collection = db.collection(coll);

        return {db, collection};

    } catch (e) {
        console.log(e);
        // Close the database connection when finished or an error occurs
        await client.close();
    }
}


const app = express();

// Define routes before starting the server
app.get('/', async (req, res) => {
    connection = await run('movies');
    const {db, collection} = connection;
    console.log(await collection.findOne());
    await client.close();
});

app.post('/', (req, res) => {
});

app.put('/', (req, res) => {
});

app.delete('/', (req, res) => {
});

// Start server
app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});
