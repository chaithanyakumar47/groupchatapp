const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GroupAdmin = sequelize.define('groupAdmin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin : Sequelize.BOOLEAN


});

module.exports = GroupAdmin;