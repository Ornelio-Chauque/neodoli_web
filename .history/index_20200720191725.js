const express = require('express');
const bodyParse= require('body-parser');
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


  .use((req, res, next)=>{
    console.log(req.url);
    next();
  })

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

  .get("/dashboard/:id/add", (req, res)=>{
    res.render("pages/add-pharmacy", {title:"Adicionar Fármacia", prescriptionId:req.params.id});
  })

  .get("/dashboard/:id/response", (req, res)=>{

    db.db.any('SELECT * FROM responses WHERE "prescriptionId"= $1', req.params.id)
    .then(data=>{
      console.log(data);
      res.render("pages/response-list", {title:"Lista de respostas", responses:data, prescriptionId:req.params.id});
    })
    .catch(error=>{
      res.render("/pages/404");
    })

   
  })

  .post("/dashboard/:id/response/",bodyParse.urlencoded({extended:false}), (req, res)=>{

    db.db.one('INSERT INTO responses (pharmacy, address, "totalAmount", "prescriptionId") VALUES($1, $2, $3, $4)', [req.body.name, req.body.address, req.body.amount, req.params.id])
    .then(response=>{
      console.log(response);
      res.render('pages/add-medicine', {title:"Adicionar medicação", data:response});
    })
    .catch(error=>{
      console.log(error)
      res.render("pages/404");
    });
    console.log(req.body.name);
    console.log(req.body.address);
    console.log(req.body.amount);
    //res.render("pages/add-medicine", {title:"Adicionar Medicação", pharmacy:"This is the pharmacy data"})
  })

  .get("/dashboard/:id/response/:responseId/", (req, res)=>{
    console.log("Response datails load page");
    db.db.any('SELECT * FROM response WHERE id=$1', req.params.responseId)
    .then(data=>{
        res.render('pages/add-medicine', {title:"Datalhes",response:data});
    })
    .catch(error=>{
        res.render('pages/404');
    })


    res.render("pages/add-medicine", {title:"Adicionar Medicação", pharmacy:"This is the pharmacy data"})
})



  .post("/dashboard/:id/response/:responseId/medicine", bodyParse.urlencoded({extended:true}),(req, res)=>{
    db.db.none('INSERT INTO medicines(name, available, "madeIn", "responseId") VALUES($1, $2, $3, $4)', [req.body.name,req.body.available, req.body.madeIn, req.params.responseId ])
    .then(data=>{
        console.log(req.body);
     })
    .catch(error=>{
      console.log(error);
    })
  })

 


  




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
