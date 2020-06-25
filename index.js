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

  .get("/prescription/{id}", (req, res)=>{
    console.log('Prescription request id '+req.params.id);
    res.send("Send reposnse");
  })

  .get("/prescription", (req, res)=>{
    let Json=[{"date":"23, junho, 2020", "id":"ducbdu859dnnx"}, {"date":"10, Maio, 2020", "id":"jd87ennd4ff"},{"date":"25, junho, 2020", "id":"7shydjkd90984"}];
    res.status(200).json(Json);
  })
  .get("/prescription/{id}/respose", (req, res)=>{

    console.log('Prescription response request id '+req.params.id);
    
  })
  











  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
