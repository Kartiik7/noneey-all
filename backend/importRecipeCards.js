
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Connection string (replace with your MongoDB Atlas or local URI)
const uri = "mongodb+srv://k95241906:DygJtrXT$G3znr9@firstcluster.gdeuvhg.mongodb.net/"; // local MongoDB
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();

        // choose database and collection
        const database = client.db("recipeDB");
        const collection = database.collection("recipeCards");

    // read JSON file (resolve path relative to this script file)
    const jsonPath = path.join(__dirname, "..", "frontend", "data", "recipeCards.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

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
