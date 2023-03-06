const db = require('../models/index.js');
const moment = require('moment');

async function updateCounselorAvailability()  {
    // var dat = new Date();
    // var day = dat.getDate();
    // var month = dat.getMonth() + 1;
    // var year = dat.getFullYear();
    // var date = year + '-' + month + '-' + day;
    var date = moment.utc(new Date()).format('YYYY-MM-DD');
    // var startTime = new Date(new Date().getTime() /*+ 3 * 60 * 60 * 1000*/).toISOString().split('T')[1].replace('Z', '').split('.')[0];
    var startTime = new Date().toISOString().split('T')[1].toLocaleTimeString('it-US', {timeZone: "America/New_York"});
    const counselors = await db.counselors.findAll({
        raw: true
    });
    counselors.forEach(async function (counselor) {
        const appe = await db.appointments.findAll({
            where: {
                date: date,
                counselorId: counselor.counselorId
            },
            raw: true
        });
        var isAvailave = true;
        if (appe.length > 0) {
            appe.forEach(ho => {
                if (ho.endTime == null) {
                    isAvailave = false;
                    return
                }
                var stm = new Date().setHours(startTime.split(':')[0],startTime.split(':')[1],startTime.split(':')[2]);
                var appstm = new Date().setHours(ho.startTime.split(':')[0],ho.startTime.split(':')[1],ho.startTime.split(':')[2]);
                var appetm = new Date().setHours(ho.endTime.split(':')[0],ho.endTime.split(':')[1],ho.endTime.split(':')[2]);
                if (stm >= appstm && stm <= appetm) {
                    isAvailave = false;
                    if (counselor.available) {
                        db.counselors.update({
                            available: false,
                            walkInAvailable: false
                        }, {
                            where: {
                                counselorId: counselor.counselorId
                            }
                        });
                    }
                }
            });
        }
        if (isAvailave && !counselor.available) {
            db.counselors.update({
                available: true,
                walkInAvailable: true
            }, {
                where: {
                    counselorId: counselor.counselorId
                }
            });
        }



    });

}

module.exports = {

    updateCounselorAvailability: async (options) => {
        setInterval(updateCounselorAvailability, 60000);
        // updateCounselorAvailability();
    }
}