const MongoClient = require("mongodb").MongoClient;

// Connection URI from MongoDB Atlas
const uri =
  "mongodb+srv://smvecmous:mous@cluster0.gzdsr3g.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function storedetails(companydetails) {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // console.log("Connected to MongoDB Atlas");

    // Access the database and collection
    const database = client.db("Mou");
    const collection = database.collection("details");

    // Insert the company information
    const result = await collection.insertOne(companydetails);
    return 200;
  } catch (err) {
    console.error(err);
    return 500;
  } finally {
    // Close the connection
    await client.close();
    // console.log("Disconnected from MongoDB Atlas");
  }
}

async function getAllDocuments() {
  try {
    await client.connect();

    const database = client.db("Mou");
    const collection = database.collection("details");

    const documents = await collection.find({}).toArray();
    // for(document in documents){
    //     console.log(document);
    // }
    return documents;
  } finally {
    client.close();
  }
}

module.exports = {
  storedetails: storedetails,
  getAllDocuments: getAllDocuments
};
