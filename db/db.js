const pgp= require("pg-promise")();
const db= pgp(process.env.DATABASE_URL);

let insertPrescription=function(prescriptionModel){
    db.none("INSERT INTO prescriptions(name, address, contact, photoUrl, code) VALUES($(name), $(address), $(contact), $(photoUrl),$(code))", prescriptionModel)
    .then(()=>{
        console.log("done");
    })
    .catch((error)=>{
        console.log(error);
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

module.exports={
    insertPrescription: insertPrescription,
    getPrescriptions: getPrescriptions,
    getPrescription: getPrescription,
    getPrescriptionResponses:getPrescriptionResponses,
    getPrescriptionResponse: getPrescriptionResponse
}

