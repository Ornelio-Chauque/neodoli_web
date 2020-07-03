/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("medicines", {
        name:{type:"varchar(200)", notNull:true},
        available:{type:"varchar(5)", notNull:true},
        madeIn:{type:"varchar(50)", notNull:true},
        resposeId:{type:"integer", notNull:true, references:"responses",  onDelete:"cascade", onUpdate:"cascade"}
    })
};

exports.down = pgm => {
    pgm.dropTable("medicines");
};
