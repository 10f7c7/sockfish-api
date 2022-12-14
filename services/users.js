const con = require('./connect.js')

module.exports = {
  /**
  *
  * @param options.userId The unique identifier of the user 

  */
  getUserId: async (options) => {

    let sql = `Select * FROM users WHERE id = ${options.userId}`;
    var returned = await con.connect(sql);

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


    Object.keys(options.user).forEach( async (option) => {
      console.log(options.user[option]);
      let sql = `UPDATE \`sockfish\`.\`users\` SET \`states\` = JSON_SET(\`states\` ,'$.${option}' , ${(options.user[option] === 'true')}) WHERE \`id\` = ${options.userId};`
      console.log(sql);
      const post = await con.connect(sql)

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
};
