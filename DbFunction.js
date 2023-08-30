const MongoClient = require('mongodb').MongoClient;

// Connection URI from MongoDB Atlas
const uri = 'mongodb+srv://smvecmous:mous@cluster0.gzdsr3g.mongodb.net/?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function storedetails() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        // Access the database and collection
        const database = client.db('Mou');
        const collection = database.collection('details');

    
        // Insert the company information
        const result = await collection.insertOne(companyInfo);
        console.log(`Inserted ${result.insertedCount} document(s)`);

    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB Atlas');
    }
}

// Call the main function
storedetails(companydetails);

//example 
const companyInfo = {
    companyName: 'Example Company',
    duration: '2023-2025',
    iconUrl: 'https://example.com/icon.png',
    imageUrl: 'https://example.com/image.png'
};
