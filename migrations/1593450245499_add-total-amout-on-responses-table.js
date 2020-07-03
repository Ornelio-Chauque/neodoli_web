/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("responses",{
        totalAmount:{type:"integer", notNull:true, default:0},
    });
};

exports.down = pgm => {
    pgm.dropColumns("responses","totalAmount");
};
