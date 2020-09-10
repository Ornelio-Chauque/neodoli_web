/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('prescriptions',{
        userId:{type:'integer', references:'users', onDelete:"cascade", onUpdate:'cascade', notNull:true}
    }
    )
};

exports.down = pgm => {
    pgm.dropColumns('prescriptions','"userId"');
};
