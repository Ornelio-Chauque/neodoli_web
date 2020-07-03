/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn("prescriptions", "photo_url", "photoUrl");
};

exports.down = pgm => {
    pgm.renameColumn("prescriptions", "photoUrl", "photo_url");
};
