/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("prescriptions",{
        name:{type:"text"},
        id: "id",
        code: {type:"text", notNull:true},
        photo_url: {type:"text", notNull:true},
        contact:{type:"text", notNull:true},
        address:{type:"text", notNull:true},
        createdAt:{type: "timestamp", notNull:true, default: pgm.func("current_timestamp")}
    });
};

exports.down = pgm => {
    pgm.dropTable("prescriptions");

};
