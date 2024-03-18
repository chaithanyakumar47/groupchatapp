const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Archived = sequelize.define('archived', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    date_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    userId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER


});

module.exports = Archived;