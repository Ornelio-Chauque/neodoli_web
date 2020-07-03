/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("response", {

        pharmacy:{type:"VARCHAR(50)", notNull:true},
        address:{type:"VARCHAR(200)", notNull:true},
        prescriptionId:{type:"integer", notNull:true, references:"prescriptions", onDelete: "cascade", onUpdate: "cascade"}

    })

};

exports.down = pgm => {
    pgm.dropTable("response");
};
