const db = require('../models/index.js');
const moment = require('moment');

module.exports = {
  /**
  * @param options.appointment.counselorId required
  * @param options.appointment.date required
  * @param options.appointment.endTime
  * @param options.appointment.reason required
  * @param options.appointment.startTime required
  * @param options.appointment.userId requiredThe unique identifier of the user
  */
  createAppointment: async (options) => {
    var date = options.appointment.date;
    var startTime = options.appointment.startTime;
    var endTime = options.appointment.endTime;

    const occupied = await db.appointments.findAll({
      where: {
        counselorId: options.appointment.counselorId,
        date: date
      },
      raw: true
    });
    console.log(occupied);
    var cnslravailed = false;
    if (occupied.length > 0) {
      occupied.forEach(function (appt) {
        if (appt.endTime == null) {
          cnslravailed = true;
          return
        }
        var stm = new Date().setHours(startTime.split(':')[0],startTime.split(':')[1],startTime.split(':')[2]);
        var appstm = new Date().setHours(appt.startTime.split(':')[0],appt.startTime.split(':')[1],appt.startTime.split(':')[2]);
        var appetm = new Date().setHours(appt.endTime.split(':')[0],appt.endTime.split(':')[1],appt.endTime.split(':')[2]);
        if (stm >= appstm && stm <= appetm) {
          cnslravailed = true;
        }
      });
      if (cnslravailed) return {status: 400,data: {message:'Counselor is not available at that time'}};
    }

    const newAPPT = await db.appointments.create({
      counselorId: options.appointment.counselorId,
      date: date,
      endTime: endTime,
      startTime: startTime,
      reason: options.appointment.reason,
      userId: options.appointment.userId
    });

    var status = 200;

    return {
      status: status,
      data: newAPPT
    };  
  },

  /**
  * 
  * @param options.counselorId
  * @param options.isAvailable
  */
  getCounselors: async (options) => {
    options.isAvailable = (options.isAvailable == 'true') ? true : false;
    var data;
    console.log(options.isAvailable);
    console.log(options.counselorId);
    if (options.counselorId && options.isAvailable) {
      const counselor = await db.counselors.findOne({
        where: {
          counselorId: options.counselorId,
          available: true
        }
      });
      data = counselor;
    } else if (options.counselorId) {
      const counselor = await db.counselors.findOne({
        where: {
          counselorId: options.counselorId
        }
      });
      data = counselor;
    } else if (options.isAvailable) {
      const counselors = await db.counselors.findAll({
        where: {
          available: options.isAvailable
        }
      });
      data = counselors;
    } else {
      const counselors = await db.counselors.findAll();
      data = counselors;
    }


    var status = 200;

    return {
      status: status,
      data: data
    };  
  },

  /**
  * 
  * @param options.endTime get crises
  * @param options.startTime get only resolved crises
  * @param options.counselorId
  */
  getOccupied: async (options) => {

    // var date = options.startTime.split('T')[0];
    // var startTime = options.startTime.split('T')[1];
    // var endTime = options.endTime.split('T')[1];
    var data;
    if (options.counselorId) {
      const occupied = await db.appointments.findAll({
        where: {
          counselorId: options.counselorId,
          // date: date,
          // endTime: startTime,
          // startTime: endTime
        }
      });
      data = occupied;
    } else {
      const occupied = await db.appointments.findAll({
        // where: {
        //   date: date,
        //   endTime: startTime,
        //   startTime: endTime
        // }
      });
      data = occupied;
    }

    var status = 200;

    return {
      status: status,
      data: data
    };  
  },

  /**
  *

  * @param options.toggleWalkin.action required
  * @param options.toggleWalkin.counselorId required
  * @param options.toggleWalkin.userId required

  */
  toggleWalkin: async (options) => {

    // var dat = new Date();
    // var day = dat.getDate();
    // var month = dat.getMonth() + 1;
    // var year = dat.getFullYear();
    // var date = year + '-' + month + '-' + day;
    var date = moment(new Date()).format('YYYY-MM-DD');
    console.log(date);
    var startTime = new Date().toLocaleTimeString('it-US', {timeZone: "America/New_York"});
    var endTime = null;
    var data;

    if (options.toggleWalkin.action == "startWalkin") {
      const occupied = await db.appointments.findAll({
        where: {
          counselorId: options.toggleWalkin.counselorId,
          date: date
        },
        raw: true
      });

      if (occupied.length > 0) {
        var cnslravailed = false;
        occupied.forEach(function (appt) {
          // var stm = new Date().setHours(startTime.split(':')[0],startTime.split(':')[1],startTime.split(':')[2]);
          // console.log("occupied");
          if (appt.endTime == null) {
            cnslravailed = true;
            return
          }
          var appstm = new Date().setHours(appt.startTime.split(':')[0],appt.startTime.split(':')[1],appt.startTime.split(':')[2]);
          var appetm = new Date().setHours(appt.endTime.split(':')[0],appt.endTime.split(':')[1],appt.endTime.split(':')[2]);
          if (startTime >= appstm && startTime <= appetm) {
            cnslravailed = true;
          }
        });
        if (cnslravailed) {return {status: 400,data: {message:'Counselor is not available at that time'}};}
        console.log("occupied");
      }
      // console.log("occupied");

      const newAPPT = await db.appointments.create({
        counselorId: options.toggleWalkin.counselorId,
        date: date,
        endTime: endTime,
        startTime: startTime,
        reason: "walkin",
        userId: options.toggleWalkin.userId
      });
      db.counselors.update({
        available: false,
        walkInAvailable: false
      }, {
        where: {
          counselorId: options.toggleWalkin.counselorId
        }
      });
      data = newAPPT;
    }
    if (options.toggleWalkin.action == "endWalkin") {
      const newAPPT = await db.appointments.update({
        endTime: startTime
      }, {
        where: {
          counselorId: options.toggleWalkin.counselorId,
          endTime: null,
          reason: "walkin",
          userId: options.toggleWalkin.userId
        }
      });
      db.counselors.update({
        available: true,
        walkInAvailable: true
      }, {
        where: {
          counselorId: options.toggleWalkin.counselorId
        }
      });
      data = newAPPT;
    }

    var status = 200;

    return {
      status: status,
      data: data
    };  
  },
};