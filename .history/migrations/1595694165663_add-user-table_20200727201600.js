/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        email: {type:'text', notNull:true, unique:true},
        name:{type:'text', notNull:true},
        username:{type:'text', notNull:true, unique:true},
        id:{type:'serial', primaryKey:true},
        password:{type:'text', notNull:true},
        photoUrl:'text',
        type:{type:'integer', default:0, notNull:true}
    });
};

exports.down = pgm => {
    pgm.dropTable('users');
};
 