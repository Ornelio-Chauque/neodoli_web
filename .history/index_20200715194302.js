const express = require('express');
// When making a push to the server for production, comment the line that import the dotEnv library
const dotEnv= require("dotenv").config();
const  multer= require('multer');
const path = require('path');
let form= multer({dest:express.static(path.resolve(__dirname, 'public'))});
const PORT = process.env.PORT || 5000;
const db= require("./db/db");

//const prescriptionRoute=express.Router();



express()
  .use(express.static(path.resolve(__dirname, 'public')))
  .set('views', path.resolve(__dirname, 'views'))
  .set('view engine', 'pug')
  .get('/', (req, res) => res.render('pages/index', {title:"Adicionar Farmácia"}))

  .get('/dashboard',(req, res)=>{
    db.db.any("SELECT * FROM  prescriptions")
    .then((data)=>{
      console.log(data);
      res.render('pages/dashboard', {requests:data, title:"Dashboard"});
    })
    .catch( error=>{
      res.render('pages/error')
    });
    
  })

  .get('/dashboard/:id', (req, res)=>{

    db.db.oneOrNone('SELECT * FROM prescriptions WHERE id=$1', req.params.id)
    .then(data=>{
        console.log(data);
        res.render('pages/request-details', {request:data})
    })
    .catch(error=>{
      res.render('pages/404', {request:data})
    })

  })

  .get("/dashboard/:id/response", (req, res)=>{
    res.render("pages/add-pharmacy", {title:"Adicionar Fármacia", prescriptionId:req.params.id});
  })

  .post("/dashboard/:id/response/", (req, res)=>{
    res.render("pages/add-medicine", {title:"Adicionar Medicação", pharmacy:"This is the pharmacy data"})
  })

  .get("/dashboard/:id/response/:responseId", (req, res)=>{
      res.render("pages/add-medicine", {title:"Adicionar Medicação", pharmacy:"This is the pharmacy data"})
  })

  .get('/dashboard/addPharmacy', (req, res)=>{res.render('pages/add-pharmacy')})
  .get('/dashboard/addMedicine', (req, res)=>{res.render('pages/add-medicine', {pharmacy:"Farmacia Maria Luisa", address:"Beira, Macuti"})})

  .post('/api/v1/prescription/', form.single('photo'), (req, res)=>{
  
    db.insertPrescription(req, res);

  })

  .get("/api/v1/prescription", (req, res)=>{
    //let Json=[{"date":"23, junho, 2020", "id":"ducbdu859dnnx"}, {"date":"10, Maio, 2020", "id":"jd87ennd4ff"},{"date":"25, junho, 2020", "id":"7shydjkd90984"}];
    db.getPrescriptions(req, res);
  })

  .get("/api/v1/prescription/:prescriptionId", (req, res)=>{

    //let jSon={"address": "1810, Beira, Mozambique", "userContact":"842519199", "photoUrl":"/public/upload/photo.jpg"}
    console.log('Prescription request id '+req.params.id);
    //res.status(200).json(jSon);
    db.getPrescription(req, res, req.params.prescriptionId);
  })

  .get("/api/v1/prescription/:prescriptionId/response", (req, res)=>{
    //let jSon=[{"id":"duyuyshghs","pharmacy":"Cristal", "address":"Maquinino, Beira"}, {"id":"duyuyshghs","pharmacy":"Maria Luisa", "address":"Macuti, Beira"}, {"id":"duyuyshghs","pharmacy":"Chingussura", "address":"Maquinino, Beira"}, {"id":"duyuyshghs","pharmacy":"Macurungo", "address":"Macurungo, Beira"}, {"id":"duyuyshghs","pharmacy":"Pontagea", "address":"Pontagea, Beira"}]
    db.getPrescriptionResponses(req, res, req.params.prescriptionId);
    //res.status(200).json(jSon);
    
  })

  .get("/api/v1/prescription/:prescriptionId/response/:responseId", (req, res)=> {

    //let jSon={"id":"duyuyshghs","pharmacy": "Cristal", "address": "Maquino, Beira", "totalAmount":"500","medicines":[{"name":"Paracetamol", "available": true, "from": "Portugal"}, {"name":"Cloroquina", "available": true, "from": "India"}, {"name":"Antigripe", "available": false, "from": "Portugal"}]};
    db.getPrescriptionResponse(req, res,req.params.responseId )
    //res.status(200).json(jSon);

  })
  











  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
