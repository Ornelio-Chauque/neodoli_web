/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.addColumns("response", {
        id:"id"
    });
};

exports.down = pgm => {
    pgm.dropColumns("response", "id");
};
