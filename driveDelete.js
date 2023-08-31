const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Load the service account key JSON file
const credentials = require('./mous-397405-6a849342535b.json');

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

async function listFiles() {
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name)',
        });

        const files = response.data.files;
        console.log('Files:');
        if (files.length === 0) {
            console.log('No files found.');
        } else {
            for (const file of files) {
                console.log(`${file.name} (${file.id})`);
            }
        }
    } catch (error) {
        console.error('Error listing files:', error);
    }
}

async function deleteFile(fileId) {
    const drive = google.drive({ version: 'v3', auth });

    try {
        await drive.files.delete({ fileId });
        console.log('File deleted successfully.');
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the name of the file you want to delete: ', async (fileName) => {
    await listFiles();
    rl.question('Enter the ID of the file you want to delete: ', async (fileId) => {
        await deleteFile(fileId);
        rl.close();
    });
});