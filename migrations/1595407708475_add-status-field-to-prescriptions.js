/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns("prescriptions", {
        status:{type: "Integer", default:0}
    });
};

exports.down = pgm => {
    pgm.dropColumns("prescriptions", "status");
};
