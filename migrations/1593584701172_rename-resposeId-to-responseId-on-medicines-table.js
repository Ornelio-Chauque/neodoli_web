/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn('medicines', 'resposeId','responseId');
};

exports.down = pgm => {
    pgm.renameColumn('medicines', 'responseId','resposeId');
};
