const { MongoClient, ObjectID } = require("mongodb");

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

async function getMouList() {

  try {
    // Connect to the MongoDB server
    await client.connect();
    // console.log("Connected to MongoDB Atlas");

    // Access the database and collection
    const database = client.db("Mou");
    const collection = database.collection("details");

    // Find all documents with the specified projection
    const documents = await collection.find({}, {
      _id: 1,     
      companyName: 1 
    }).toArray();

    return documents;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

async function getDocumentById(documentId) {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // console.log("Connected to MongoDB Atlas");

    // Access the database and collection
    const database = client.db("Mou");
    const collection = database.collection("details");
    // Convert the provided documentId string to an ObjectID
    const objectId = new ObjectID(documentId);

    // Find the document with the given _id
    const document = await collection.findOne({ _id: objectId });

    return document;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
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
  getMouList: getMouList,
  getDocumentById: getDocumentById,
  storedetails: storedetails,
  getAllDocuments: getAllDocuments,
};
