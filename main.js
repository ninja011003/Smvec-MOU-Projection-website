const express = require('express')
const ejs = require('ejs')
const path = require('path')
const multer = require('multer');
const bodyParser = require('body-parser');
const {uploadPDF,uploadImage} = require('./DriveFunctions');
const {storedetails,getAllDocuments,getDocumentById,getMouList} = require('./DbFunction')
const enc_text = require('./password');


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
const upload = multer({
    storage: multer.memoryStorage()
});

app.get('/', async(req,res)=>{
    const data={
        companies: await getAllDocuments(),
        KnowMoreLink: "/knowMore?Oid=",
    }
    // console.log(data.companies)
    res.render('index',data)
})

app.get('/adminPage',(req,res)=>{
    res.render('adminL',{return_state :""})
})

app.post('/login',async(req,res)=>{
    if(enc_text.username==req.body.username&&enc_text.password==req.body.password){
        const data ={
            MouList: await getMouList(),
            resultOfSuccess:"",
            resultOfFailure: "",
        }
        res.render('admin',data);
    }
    else{
        res.render('adminL',{return_state :"Incorrect Credential"});
        
    }
})

app.get('/admin',(req,res)=>{
    
})


app.post('/addMou', upload.fields([{name:'image'},{name:'pdf'}]), async (req, res) => {
    const imgResult = await uploadImage(req.files['image'][0].buffer,req.files['image'][0].originalname);
    const pdfResult = await uploadPDF(req.files['pdf'][0].buffer,req.files['pdf'][0].originalname);
    if(imgResult.status==200&&pdfResult.status==200){
        if(await storedetails({
            companyName: req.body.companyName,
            yearOfSigning: req.body.yearOfSigning,
            duration: req.body.duration ,
            iconUrl: imgResult.weblink,
            documentUrl: pdfResult.weblink,
            department: req.body.dept
        })==200){
            const data={
                MouList: await getMouList(),
                resultOfSuccess: "New Mou Added Successfully",
                resultOfFailure:"",
            }
            res.render('admin',data)
        }
        else{
            const data={
                MouList: await getMouList(),
                resultOfSuccess:"",
                resultOfFailure: "Error occured,Please try again",
            }
            res.render('admin',data)
        }
    }

})



app.listen(process.env.PORT||3002,()=>{
    console.log("server running")
})



