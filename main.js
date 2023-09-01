const express = require('express')
const ejs = require('ejs')
const path = require('path')
const multer = require('multer');
const bodyParser = require('body-parser');
const {uploadPDF,uploadImage} = require('./DriveFunctions');
const { storedetails} = require('./DbFunction')
const enc_text = require('./password');


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
const upload = multer({
    storage: multer.memoryStorage()
});

app.get('/',(req,res)=>{
    const data={
        
    }
    res.render('index',data)
})

app.get('/adminPage',(req,res)=>{
    res.render('adminL',{return_state :""})
})

app.post('/login',(req,res)=>{
    if(enc_text.username==req.body.username&&enc_text.password==req.body.password){
        res.render('admin');
    }
    else{
        res.render('adminL',{return_state :"Incorrect Credential"});
        
    }
})

app.get('/admin',(req,res)=>{
    
})

// app.post('/upload', upload.single('pdf'), async (req, res) => {
//     try {
//         const response = await uploadPDF(req.file.buffer,req.file.originalname);
//         console.log('File uploaded to Google Drive with status:', response.status);
//         res.send('File uploaded to Google Drive');
//     } catch (err) {
//         console.error('Error uploading to Google Drive:', err);
//         res.status(500).send('Error uploading to Google Drive');
//     }
// });

app.post('/addMou', upload.fields([{name:'image'},{name:'pdf'}]), async (req, res) => {
    // const companyName = req.body.companyName;
    // const yearOfSigning = req.body.yearOfSigning;
    // const duration = req.body.duration;
    // const departments = req.body.dept;

    // // Access uploaded files as buffers
   
    // console.log('Received Form Data:');
    // console.log('Company Name:', companyName);
    // console.log('Year of Signing:', yearOfSigning);
    // console.log('Duration:', duration);
    // console.log('Selected Departments:', departments);
    // console.log(req.files['image'][0].originalname);
    const imgResult = await uploadImage(req.files['image'][0].buffer,req.files['image'][0].originalname);
    const pdfResult = await uploadImage(req.files['pdf'][0].buffer,req.files['pdf'][0].originalname);
    if(imgResult.status==200&&pdfResult.status==200){
        if(await storedetails({
            companyName: req.body.companyName,
            yearOfSigning: req.body.yearOfSigning,
            duration: req.body.duration ,
            iconUrl: imgResult.weblink,
            documentUrl: pdfResult.weblink,
            department: req.body.dept
        })==200){
            res.render('admin')
        }
    }

})

// app.get('/links', async (req,res)=>{
    
//     res.send(await retrieveLinks());
// })


app.listen(process.env.PORT||3002,()=>{
    console.log("server running")
})



