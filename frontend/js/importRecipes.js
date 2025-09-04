const { MongoClient } = require("mongodb");
const fs = require("fs");

// Connection string (replace with your MongoDB Atlas or local URI)
const uri = "mongodb://127.0.0.1:27017"; // local MongoDB
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();

        // choose database and collection
        const database = client.db("recipeDB");
        const collection = database.collection("recipes");

        // read JSON file
        const data = JSON.parse(fs.readFileSync("recipeCards.json", "utf-8"));

        // insert into collection
        if (Array.isArray(data)) {
            const result = await collection.insertMany(data);
            console.log(`${result.insertedCount} recipes inserted!`);
        } else {
            const result = await collection.insertOne(data);
            console.log("1 recipe inserted!", result.insertedId);
        }
    } catch (err) {
        console.error("Error importing recipes:", err);
    } finally {
        await client.close();
    }
}

run();
