const { CronJob} = require('cron');
const { Op } = require('sequelize');
const Messages = require('../Models/messages');
const Archived = require('../Models/archived');


const job = new CronJob(
    '0 0 * * *',
    function() {
        archiveOldChats();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldChats() {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const oldChats = await Messages.findAll({
            where: {
                date_time: {
                    [Op.lt]: oneDayAgo,
                },
        }
    })
        await Promise.all(
            oldChats.map( async (chats) => {
                await Archived.create({
                    id: chats.id,
                    message: chats.message,
                    date_time: chats.date_time,
                    userId: chats.userId,
                    groupId: chats.groupId
                });
                await chats.destroy();
            })
        );
        console.log('Chats archived successfully.');
    } catch(err) {
        console.log('Failed to archive chats', err)
    }
}

module.exports = job;