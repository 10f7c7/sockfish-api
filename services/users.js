const con = require('./connect.js');
const email = require('./email.js');

module.exports = {
  /**
  *
  * @param options.userId The unique identifier of the user 

  */
  getUserId: async (options) => {

    let sql = `Select * FROM users WHERE id = ${options.userId}`;
    var returned = await con.connect(sql);

    // var mail = await email.main();
    // mail.catch(console.error);

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    // var data = {
    //     "description": "<string>",
    //     "id": options.userId,
    //     "states": `{JSON.stringify(dbr)}`,
    //     "name": "<string>",
    //     "type": "<string>",
    //     "options": options
    //   };
    var status = 200;

    return {
      status: status,
      data: returned
    };
  },

  /**
  * 
  * @param options.userId The unique identifier of the user 
  * @param options.user
  */
  postUserId: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    var hallPassObject = {
      type: "",
      exitTime: new Date().toISOString(),
      returnTime: ""
    }

    var passTypes = ['bathroom', 'hall', 'nurse', 'water', 'office', 'media', 'ss', 'other'];

    Object.keys(options.user).forEach( async (option) => {

      if (passTypes.includes(options.passType))  {
        let hpo = new hallPassObject;
        hpo.type = options.passType;
      }

      // console.log(options.user[option]);
      // let sql = `UPDATE \`sockfish\`.\`users\` SET \`attributes\` = JSON_SET(\`attributes\` ,'$.${option}' , ${(options.user[option] === 'true')}) WHERE \`id\` = ${options.userId};`
      // console.log(sql);
      // if (Object.keys(options.user) == 'hasHallPass')  {
      //   if (options.user.hasHallPass === true)  {
      //     // UPDATE `sockfish`.`users` SET `HallPassLog` = JSON_ARRAY_INSERT(`HallPassLog`, '$[0]', JSON_OBJECT('type', 'Hall', 'exitTime', 'time', 'returnTime', '')) WHERE `id` = 14314
      //     let addPass = `UPDATE \`sockfish\`.\`users\` SET \`HallPassLog\` = JSON_ARRAY_INSERT(\`HallPassLog\`, '$[0]', JSON_OBJECT('type', 'Hall', 'exitTime', '${new Date().toISOString()}', 'returnTime', '')) WHERE \`id\` = ${options.userId}`;
      //   }
      // }
      // const post = await con.connect(sql)

    });

    let sql = `Select * FROM users WHERE id = ${options.userId}`;
    var returned = await con.connect(sql);

    // var data = {
    //   'options': options
    // };
    var status = 200;

    return {
      status: status,
      data: returned
    };  
  },
  getUserIdHallPasses: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    let sql = `Select * FROM users WHERE id = ${options.userId}`;
    var returned = await con.connect(sql);

    var status = 200;

    var data = [{
        "exitTime": "<date-time>",
        "returnTime": "<date-time>",
        "type": "<string>",
      }];

    return {
      status: status,
      data: returned.HallPassLog
    };
  },
  /**
  *
  * @param options.userId The unique identifier of the user
  * @param options.HallPasses.action required
  * @param options.HallPasses.passType required

  */
  postUserIdHallPasses: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    // UPDATE `sockfish`.`users` SET `HallPassLog` = JSON_SET(`HallPassLog`, '$[0].returnTime', 'hehe') WHERE `id` = 14314
    let cmd = `Select * FROM users WHERE id = ${options.userId}`;
    var optionsCheck = await con.connect(cmd);
    if (options.HallPasses.action == "startPass" && optionsCheck.attributes.hasHallPass == false)  {
      let sql = `UPDATE \`sockfish\`.\`users\` SET \`HallPassLog\` = JSON_ARRAY_INSERT(\`HallPassLog\`, '$[0]', JSON_OBJECT('type', '${options.HallPasses.passType}', 'exitTime', '${new Date().toISOString()}', 'returnTime', '')) WHERE \`id\` = ${options.userId};`;
      console.log(sql);
      let returned = await con.connect(sql);
      let sql2 = ` UPDATE \`sockfish\`.\`users\` SET \`attributes\` = JSON_SET(\`attributes\` ,'$.hasHallPass' , true) WHERE \`id\` = ${options.userId};`;
      let returned2 = await con.connect(sql2);
      console.log(returned);
    }
    if (options.HallPasses.action == "endPass" && optionsCheck.attributes.hasHallPass == true)  {
      let sql = ` UPDATE \`sockfish\`.\`users\` SET \`HallPassLog\` = JSON_SET(\`HallPassLog\`, '$[0].returnTime', '${new Date().toISOString()}') WHERE \`id\` = ${options.userId};`;
      let returned = await con.connect(sql);
      let sql2 = ` UPDATE \`sockfish\`.\`users\` SET \`attributes\` = JSON_SET(\`attributes\` ,'$.hasHallPass' , false) WHERE \`id\` = ${options.userId};`;
      let returned2 = await con.connect(sql2);
    }
    let sql = `Select * FROM users WHERE id = ${options.userId}`;
    var returned = await con.connect(sql);
    var status = 200;
    var data = {};
      // status = '200';

    return {
      status: status,
      data: returned.HallPassLog
    };
  },
};
