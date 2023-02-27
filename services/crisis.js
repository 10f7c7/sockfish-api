const con = require('./connect.js');


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
  * @param options.crisisItem.crisisId

  */


  createCrisis: async (options) => {
    if (options.crisisItem.action == 'startCrisis') {
      var optionsCheck = await con.connect(["select", "users", "*", "id", options.crisisItem.userId]);
      if (!optionsCheck.attributes.isInCrisis) {
        let sql = `INSERT INTO crisis (description,gps,location,needs,resolved,urgency,userId) VALUES ('${options.crisisItem.description}','${options.crisisItem.gps}','${options.crisisItem.location}','${options.crisisItem.needs}','${options.crisisItem.resolved}','${options.crisisItem.urgency}','${options.crisisItem.userId}');`;
        var returned = await con.legacy(sql);
        var status = 200;
        await con.connect(["update", "users", "attributes", "id", options.crisisItem.userId], `JSON_SET(\`attributes\` ,'$.isInCrisis' , true)`);
        return {
        status: status,
        data: {message: returned}
        };
      } else {
        return {
          status: 400,
          data: {message: "Crisis has already been recorded"}
        };
      }

    }
    if (options.crisisItem.action == 'endCrisis') {
      let sql = `UPDATE crisis SET resolved = '1' WHERE crisisId = ${options.crisisItem.crisisId};`;
      await con.connect(["update", "users", "attributes", "id", options.crisisItem.userId], `JSON_SET(\`attributes\` ,'$.isInCrisis' , false)`);
      console.log(sql);

      var returned = await con.legacy(sql);
      var status = 200;

      return {
      status: status,
      data: {message: returned}
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
      let sql = `Select * FROM crisis WHERE resolved = 1`;
      var returned = await con.legacy(sql);
    } else if (options.getAll == 'true') {
      let sql = `Select * FROM crisis`;
      var returned = await con.legacy(sql);
    } else {
      let sql = `Select * FROM crisis WHERE resolved = 0`;
      var returned = await con.legacy(sql);
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
      let sql = `Select * FROM crisis WHERE resolved = 1 AND userId = ${options.userId}`;
      var returned = await con.legacy(sql);
    } else if (options.getAll == 'true') {
      let sql = `Select * FROM crisis WHERE userId = ${options.userId}`;
      var returned = await con.legacy(sql);
    } else {
      let sql = `Select * FROM crisis WHERE resolved = 0 AND userId = ${options.userId}`;
      var returned = await con.legacy(sql);
    }

    let status = 200;

    return {
      status: status,
      data: returned
    };
  },
};
