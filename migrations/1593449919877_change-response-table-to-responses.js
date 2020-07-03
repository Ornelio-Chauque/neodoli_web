/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameTable("response","responses")
};

exports.down = pgm => {
    pgm.renameTable("responses", "response");
};
