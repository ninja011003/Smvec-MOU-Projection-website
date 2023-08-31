const MongoClient = require('mongodb').MongoClient;
const xlsx = require('xlsx');
const uri = "mongodb+srv://smvecmous:mous@cluster0.gzdsr3g.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadExcelToMongoDBAtlas(fileBuffer) {


    try {
        await client.connect();
        const database = client.db('Mou');
        const collection = database.collection('details');

        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        console.log('Workbook:', workbook);
        console.log('Sheet Names:', workbook.SheetNames);
        const sheetName = workbook.SheetNames[0];//Storing the sheet name

        // Assuming data is in the first sheet
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Insert the parsed data into MongoDB
        const insertResult = await collection.insertMany(excelData);

        return `${insertResult.insertedCount} records saved to MongoDB Atlas.`;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred.');
    } finally {
        await client.close();
    }
}

module.exports = {
    uploadExcelToMongoDBAtlas
};


//Post request to upload excel file,for reference
app.post('/uploads', uploads.single('excelfile'), async (req, res) => {
    try {
        const result = await uploadExcelToMongoDBAtlas(req.file.buffer);
        
        // Delete the temporary file after processing
        //console.log('req.file:', req.file);
        //console.log('req.file.path:', req.file && req.file.path);
        /*fs.unlink(req.file.buffer, (err) => {
            if (err) {
                console.error('Error deleting temporary file:', err);
            }
        });*/
    
        res.send(`File uploaded and processed. ${result}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});
