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

  .post('/prescription/add', form.single('photo'), (req, res)=>{
    console.log(req.file);
    console.log(req.body.address);
    console.log(req.body.contact);
    res.json({message:"ok"});
  })

  .get("/prescription", (req, res)=>{
    res.send("Send reposnse");
  })
  











  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
