const db = require('../models/index.js');



module.exports = {
  /**
  * 

  * @param options.crisisItem.description required
  * @param options.crisisItem.gps required
  * @param options.crisisItem.location required
  * @param options.crisisItem.needs required
  * @param options.crisisItem.resolved
  * @param options.crisisItem.urgency required
  * @param options.crisisItem.userId requiredThe unique identifier of the user
  * @param options.crisisItem.action
  */

  createCrisis: async (options) => {
    options.crisisItem.userId = options.crisisItem.userId || 0
    if (options.crisisItem.action == 'startCrisis') {
      if (options.crisisItem.userId) {
        var optionsCheck = await db.Sequelize.query(`SELECT * FROM users WHERE id = ${options.crisisItem.userId}`);
        if (optionsCheck.attributes.isInCrisis && options.crisisItem.userId) {return {status: 400,data: {message: "Crisis has already been recorded"}}};
      }
      const newCrisis = await db.crisis.create({
        description: options.crisisItem.description,
        gps: options.crisisItem.gps,
        location: options.crisisItem.location,
        needs: options.crisisItem.needs,
        resolved: options.crisisItem.resolved,
        urgency: options.crisisItem.urgency,
        userId: options.crisisItem.userId
      });
      if (options.crisisItem.userId) await db.Sequelize.query(`UPDATE users SET attributes = JSON_SET(\`attributes\` ,'$.isInCrisis' , true) WHERE id = ${options.crisisItem.userId}`);
      var status = 200;
      return {
      status: status,
      data: newCrisis
      };

    }
    if (options.crisisItem.action == 'endCrisis') {
      const endCrisis = await db.crisis.update({ resolved: 1 }, { where: { crisisId: options.crisisItem.crisisId }});
      if (options.crisisItem.userId) await db.Sequelize.query(`UPDATE users SET attributes = JSON_SET(\`attributes\` ,'$.isInCrisis' , false) WHERE id = ${options.crisisItem.userId}`);
      var status = 200;

      return {
      status: status,
      data: {message: "Crisis has been resolved"}
      };
    }
  },

  /**
  * 
  * @param options.getResolved get only resolved crises
  * @param options.getAll get all crises
  */
  getCrises: async (options) => {
    if (options.getResolved == 'true') {
      var returned = await db.crisis.findAll({ raw: true, where: { resolved: 1 }});
    } else if (options.getAll == 'true') {
      var returned = await db.crisis.findAll({ raw: true });
    } else {
      var returned = await db.crisis.findAll({ raw: true, where: { resolved: 0 }});
    }

    let status = 200;

    return {
      status: status,
      data: returned
    };
  },

  /**
  * 
  * @param options.userId The unique identifier of the user   
  * @param options.getResolved get only resolved crises
  * @param options.getAll get all crises
  */
  getCrisesById: async (options) => {
    if (options.getResolved == 'true') {
      var returned = await db.crisis.findAll({ raw: true, where: { resolved: 1, userId: options.userId }});
    } else if (options.getAll == 'true') {
      var returned = await db.crisis.findAll({ raw: true, where: { userId: options.userId }});
    } else {
      var returned = await db.crisis.findAll({ raw: true, where: { resolved: 0, userId: options.userId }});
    }

    let status = 200;

    return {
      status: status,
      data: returned
    };
  },
};
