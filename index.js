const express = require('express')
const  multer= require('multer');
let form= multer({dest:'./public'});
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.resolve(__dirname, 'public')))
  .set('views', path.resolve(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

  .post('/prescription/', form.single('photo'), (req, res)=>{
    console.log(req.file);
    console.log(req.body.address);
    console.log(req.body.contact);
    res.json({message:"ok"});
  })

  .get("/prescription", (req, res)=>{
    let Json=[{"date":"23, junho, 2020", "id":"ducbdu859dnnx"}, {"date":"10, Maio, 2020", "id":"jd87ennd4ff"},{"date":"25, junho, 2020", "id":"7shydjkd90984"}];
    res.status(200).json(Json);
  })

  .get("/prescription/:id", (req, res)=>{

    let jSon={"address": "1810, Beira, Mozambique", "userContact":"842519199", "photoUrl":"/public/upload/photo.jpg"}
    console.log('Prescription request id '+req.params.id);
    res.status(200).json(jSon);
  })

  .get("/prescription/:id/response", (req, res)=>{
    let jSon=[{"id":"duyuyshghs","pharmacy":"Cristal", "address":"Maquinino, Beira"}, {"id":"duyuyshghs","pharmacy":"Maria Luisa", "address":"Macuti, Beira"}, {"id":"duyuyshghs","pharmacy":"Chingussura", "address":"Maquinino, Beira"}, {"id":"duyuyshghs","pharmacy":"Macurungo", "address":"Macurungo, Beira"}, {"id":"duyuyshghs","pharmacy":"Pontagea", "address":"Pontagea, Beira"}]
    res.status(200).json(jSon);
    
  })

  .get("/prescription/:id/response/:id", (req, res)=> {

    let jSon={"id":"duyuyshghs","pharmacy": "Cristal", "address": "Maquino, Beira", "medicines":[{"name":"Paracetamol", "available": true, "from": "Portugal"}, {"name":"Cloroquina", "available": true, "from": "India"}, {"name":"Antigripe", "available": false, "from": "Portugal"}]};
    res.status(200).json(jSon);

  })
  











  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
