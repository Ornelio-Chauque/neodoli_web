const express = require('express');
const bodyParse= require('body-parser');
// When making a push to the server for production, comment the line that import the dotEnv library
const dotEnv= require("dotenv").config();
const  multer= require('multer');
const path = require('path');
let form= multer({dest:express.static(path.resolve(__dirname, 'public'))});
const PORT = process.env.PORT || 5000;
const db= require("./db/db");
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const flash = require('connect-flash');
const session= require('express-session');

//const prescriptionRoute=express.Router();


// setting the passport strategy
passport.use(new LocalStrategy((username, password, cb)=>{
  console.log("Strategy called");
  db.getUserWithUsername(username, password, (error, user)=>{
    
    if(error){
      console.log("error on auth");
      return cb(error);
    }
    if(!user){
      console.log("no user found in auth process");
      return cb(null, false,{message:"no user found in auth process"});
    }
    console.log(" user found in auth process");
    return cb(null, user, {message:"user found in auth process"});

  });
  
}));

let isAutheticated= function(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }else{next();}
}

passport.serializeUser(function(user,cb){
  cb(null,user.id);
  console.log("Serializing");
});

passport.deserializeUser((id,cb)=>{
  console.log("Deserialize");
  db.findUserById(id,function(error, user){
    if(error){
      cb(error)
    }
    if(!user){
      cb(null, false)
    }
    cb(null, user)
  })
})


express()
  .use(passport.initialize())
  .use(passport.session())
  .use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie: { maxAge: 60000 } } ))
  .use(flash())
  .use(express.static(path.resolve(__dirname, 'public')))
  .set('views', path.resolve(__dirname, 'views'))
  .set('view engine', 'pug')
  .get('/', (req, res) => res.render('pages/index', {title:"Adicionar Farmácia"}))


  .use((req, res, next)=>{
    console.log(req.url);
    next();
  })

  .get('/login', (req, res)=>{
    console.log(req.flash('error')[0]);
    var msg=req.flash('error')[0];
    console.log(msg);
    res.render("pages/login", {title: 'Iniciar sessão', message:msg});
  })
  .post('/login',
            bodyParse.urlencoded({extended:true}), 
            passport.authenticate('local', {failureRedirect:'/login',
            successRedirect:"/dashboard", 
            failureFlash:true}),
            (req, res)=>{
        console.log(req.user);
        res.send("this is the user"+ req.user.email);
    })

  .get('/logout', isAutheticated, (req, res)=>{
    req.logOut();
  })

  .get('/dashboard', isAutheticated,(req, res)=>{
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
   
    db.db.task(tsk=>{
      return tsk.one('SELECT * FROM responses WHERE id=$1', req.params.responseId)
        .then(response=>{
          
          return tsk.any('SELECT * FROM medicines WHERE "responseId"=$1',response.id)
          .then(medicines=>{
            response.medicines=medicines;
            return response;
          })
        })
    }).then(result=>{
      res.render('pages/add-medicine', {title:"Datalhes",response:result});
    }).catch(error=>{
      res.render('pages/404');
    })
   
   
   
   /*  db.db.one('SELECT * FROM responses WHERE id=$1', req.params.responseId)
    .then(response=>{
      console.log(response);
        
    })
    .catch(error=>{
        
    }) */


   // res.render("pages/add-medicine", {title:"Adicionar Medicação", pharmacy:"This is the pharmacy data"})
})



  .post("/dashboard/:id/response/:responseId/medicine", bodyParse.urlencoded({extended:true}),(req, res)=>{
    db.db.none('INSERT INTO medicines(name, available, "madeIn", "responseId") VALUES($1, $2, $3, $4)', [req.body.name,req.body.available, req.body.madeIn, req.params.responseId ])
    .then(data=>{
      res.redirect("/dashboard/"+req.params.id+"/response/"+req.params.responseId+"/")
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
