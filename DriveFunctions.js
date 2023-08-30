const multer = require('multer');
const path = require('path');
const { google } = require('googleapis');
const fs = require('fs');
const { Readable } = require('stream');



const serviceAccountKey = require('./mous-397405-6a849342535b.json'); 
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const authClient = new google.auth.GoogleAuth({
    credentials: serviceAccountKey,
    scopes: SCOPES,
});
const folderId ='1x3yLorrwx9AARPTYeQV-ZvsD_hOLlOZE';





async function uploadPDF(fileBuffer, originalname) {
    try {
        const drive = google.drive({ version: 'v3', auth: authClient });

        // Convert the fileBuffer to a readable stream
        const fileStream = new Readable();
        fileStream.push(fileBuffer);
        fileStream.push(null);

        const fileMetadata = {
            name: originalname,
            mimeType: 'application/pdf',
            parents: [folderId],
        };
        const media = {
            mimeType: 'application/pdf',
            body: fileStream, // Use the converted readable stream
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink',
        });
        const finalResponse = {
            status: response.status,
            weblink: response.data.webViewLink,
        };
        return finalResponse;
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw error;
    }
}




async function retrieveLinks() {
    try {
        const drive = google.drive({ version: 'v3', auth: authClient });

        const response = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name, webViewLink)',
        });

        const files = response.data.files;
        const shareLinks = files.map(file => {
            return {
                webViewLink: file.webViewLink,
            };
        });
        return shareLinks;
    } catch (error) {
        console.error('Error retrieving share links:', error);
        throw error;
    }
}

module.exports = {
    uploadPDF: uploadPDF,
    retrieveLinks: retrieveLinks
};

