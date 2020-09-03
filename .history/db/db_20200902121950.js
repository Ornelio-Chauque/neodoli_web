const pgp= require("pg-promise")();
const db= pgp(process.env.DATABASE_URL);
const crypto= require("crypto");

let insertPrescription=function(req, res){
    let randomCode= crypto.randomBytes(10).toString('hex');
    let prescriptionData=[req.body.name, req.body.address, req.body.contact, req.file.path, randomCode];
    console.log(req.file);
    console.log(req.file.filename);
    console.log(req.file.path);
    console.log(req.file.size);
    console.log(req.body.address);
    console.log(req.body.contact);
    console.log(prescriptionData);

    db.none('INSERT INTO prescriptions(name, address, contact, "photoUrl", code) VALUES($1, $2, $3, $4, $5)', prescriptionData)
    .then(()=>{
        res.status(200).json({message:"ok"});
    })
    .catch((error)=>{
        res.status(200).json(error);
    });
}


let getPrescriptions= (req, res)=>{
    let dataResult;
    db.any("SELECT * FROM prescriptions")
    .then((data)=>{
        console.log(data);
        res.status(200).json(data);
    })
    .catch((error)=>{
        console.log(error);
        res.status(200).json(error);
    });
   
}

let getPrescription=(req, res, id)=>{

    db.one("SELECT * FROM prescriptions WHERE id=$1",[id])
    .then((data)=>{
        console.log(data);
        res.status(200).json(data);
    })
    .catch((error)=>{
        console.log(error);
        res.status(200).json(error);
    })
}

let getPrescriptionResponses=(req, res, idPrescrption)=>{
    db.any('SELECT * FROM responses WHERE "prescriptionId"=$1',[idPrescrption])
    .then(data=>{
        console.log(data);
        res.status(200).json(data);
    })
    .catch((error)=>{
        res.status(200).json(error);
    })
}

let getPrescriptionResponse=(req, res, idResponse)=>{
    db.task((tsk)=>{
       
        return tsk.one("SELECT * FROM responses WHERE id=$1", [idResponse])
                .then((response)=>{
                    console.log("my response "+response);
                    var result= response;
                    return tsk.any('SELECT * FROM medicines WHERE "responseId"=$1', [response.id])
                            .then((medicines)=>{
                                result.medicines=medicines;
                               
                                console.log(result);
                            
                                return result;
                            })
                            .catch(error=>{
                                console.log(console.error());
                            })
                })
                .catch((error)=>{
                    console.log(console.error());
                })

    })
    .then((data)=>{
        console.log(data);
        res.status(200).json(data);
    })
    .catch((error)=>{
        console.log(error);
        res.status(200).json(error);
    })
}

let addPrescriptionResponse=(prescriptionResponse)=>{

}


//Auth Users database operations

let findUserById=function(id, cb){
    db.one('SELECT * FROM users WHERE id=$1', id)
    .then(user=>{
        return cb(null, user)
    })
    .catch(error=>{
        cb(error)
    });

}

let findUserByEmail= (req, res)=>{

    db.oneOrNone('SELECT email, name, id, "photoUrl", username FROM users WHERE email=$1', req.params.email)
    .then(user=>{
        console.log(user)
        user
        res.status(200).json(user); 
    })
    .catch(error=>{
        res.json({message:error})
    })

}

let addUser=(req, res)=>{
    let userData=[req.body.email, req.body.name, req.body.userName, req.body.photoUrl, req.body.type, req.body.email]
    db.one('INSERT INTO users(email, name, username, "photoUrl", type, password) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING email, name, username, "photoUrl", type', userData)
    .then(user=>{
        res.json(user)
    })
    .catch(error=>{
        res.json({message:error});
        
    })

}

let getUserWithUsername= function(username, password, cb){
    db.one('SELECT * FROM users WHERE username= $1 and password=$2', [username, password])
    .then(user=>{
        console.log(user);
        return cb(null, user);
    })
    .catch(error=>{
        console.log(error);
        return cb(null, false);
    })

}
let getUserWithEmail=function(email, password){
    db.one('SELECT * FROM users WHERE email=$1, password=$2', [email, password])
    .then(user=>{
        console.log(user)
        return user;
    })
    .catch(error=>{
        console.log(error);
        return null;
    });
}

module.exports={
    insertPrescription: insertPrescription,
    getPrescriptions: getPrescriptions,
    getPrescription: getPrescription,
    getPrescriptionResponses:getPrescriptionResponses,
    getPrescriptionResponse: getPrescriptionResponse,
    getUserWithEmail: getUserWithEmail,
    getUserWithUsername: getUserWithUsername,
    findUserById:findUserById,
    findUserByEmail: findUserByEmail,
    addUser:addUser,
    db:db
}

