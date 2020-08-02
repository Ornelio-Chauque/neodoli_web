const pgp= require("pg-promise")();
const db= pgp(process.env.DATABASE_URL);
const crypto= require("crypto");

let insertPrescription=function(req, res){
    let randomCode= crypto.randomBytes(10).toString('hex');
    let prescriptionData=[req.body.name, req.body.address, req.body.contact, req.file.path, randomCode];
    console.log(req.file);
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


// Users database operations

let getUserWithUsername= function(username, password){
    db.one('SELECT * FROM users WHERE username= $1 and password=$2', [username, password])
    .then(user=>{
        onsole.log(user);
        return user;
    })
    .catch(error=>{
        console.log(error);
        return null;
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
    db:db
}

