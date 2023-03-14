const email = require('./email.js');
const db = require('../models/index.js');


module.exports = {

    /**
    *
    * @param options.userId The unique identifier of the user
    */
    getUserId: async (options) => {

        var returned = await db.sequelize.query(`SELECT * FROM users WHERE id = ${options.userId}`, { raw: true });
        returned[0][0].information = JSON.parse(returned[0][0].information);
        returned[0][0].attributes = JSON.parse(returned[0][0].attributes);

        // const dbr = await db.users.findOne({ where: { id: options.userId } });
        // console.log(dbr.dataValues);
        var status = 200;

        return {
            status: status,
            data: returned[0][0]
        };
    },

    /**
    * 
    * @param options.userId The unique identifier of the user 
    * @param options.user
    */
    postUserId: async (options) => {

        var hallPassObject = {
            type: "",
            exitTime: new Date().toISOString().toLocaleString('en-US', { timeZone: 'America/New_York' }),
            returnTime: ""
        }

        var passTypes = ['bathroom', 'hall', 'nurse', 'water', 'office', 'media', 'ss', 'other'];

        Object.keys(options.user).forEach(async (option) => {

            if (passTypes.includes(options.passType)) {
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

        var returned = await db.sequelize.query(`SELECT * FROM users WHERE id = ${options.userId}`);

        var status = 200;

        return {
            status: status,
            data: returned
        };
    },

    /**
    *
    * @param options.userId The unique identifier of the user
    */
    getUserIdCurrentCourse: async (options) => {

        //////////////////////////////////////////////////////////
        // TODO: Create dyname schedule that gets from database //
        //////////////////////////////////////////////////////////

        var temp = new Date().toLocaleTimeString('it-US', { timeZone: "America/New_York" }).split(':');

        var CURRENT_TIME = new Date().setHours(temp[0], temp[1], temp[2]);
        const schedule = [[new Date().setHours(7, 25, 0), new Date().setHours(8, 15, 0), 1], [new Date().setHours(8, 20, 0), new Date().setHours(9, 10, 0), 2], [new Date().setHours(9, 15, 0), new Date().setHours(10, 10, 0), 3], [new Date().setHours(10, 15, 0), new Date().setHours(12, 15, 0), 4], [new Date().setHours(12, 20, 0), new Date().setHours(13, 10, 0), 5], [new Date().setHours(13, 15, 0), new Date().setHours(14, 10, 0), 6]];
        var current_course;
        schedule.forEach((helm) => {
            console.log(helm[0]);
            console.log(CURRENT_TIME);
            if (helm[0] <= CURRENT_TIME && helm[1] >= CURRENT_TIME) {
                if (!current_course) {
                    current_course = helm[2];
                }
            }
        });

        var returned = await db.sequelize.query(`SELECT * FROM users WHERE id = ${options.userId}`,{raw: true});
        returned[0][0]['information'] = JSON.parse(returned[0][0]['information']);
        var data = returned[0][0]['information']['courses'][current_course - 1];
        if (!current_course) {
            if (CURRENT_TIME < schedule[0][0]) {
                data = {
                    "courseName": "Before Class",
                    "courseTeacher": "Before Class",
                    "courseRoom": "Before Class"
                }
            } else if (CURRENT_TIME > schedule[5][1]) {
                data = {
                    "courseName": "After Class",
                    "courseTeacher": "After Class",
                    "courseRoom": "After Class"
                }
            } else if (!data) {
                data = {
                    "courseName": "In Between Class",
                    "courseTeacher": "In Between Class",
                    "courseRoom": "In Between Class"
                }
            }
        }


        var status = 200;

        return {
            status: status,
            data: data
        };
    },

    /**
    * @param options.userId The unique identifier of the user
    *
    */
    getUserIdHallPasses: async (options) => {

        const twomp = await db.hallpasslog.findAll({
            where: {
                userId: options.userId
            },
            raw: true,
            paranoid: false
        });

        var status = 200;

        return {
            status: status,
            data: twomp
        };
    },

    /**
    *
    * @param options.userId The unique identifier of the user
    * @param options.HallPasses.action required
    * @param options.HallPasses.type required
    * @param options.HallPasses.originRoom required
    */
    postUserIdHallPasses: async (options) => {
        var optionsCheck = await db.sequelize.query(`SELECT * FROM users WHERE id = ${options.userId}`);
        if (options.HallPasses.action == "startPass" && JSON.parse(optionsCheck[0][0].attributes).hasHallPass == false) {
            const temp = await db.hallpasslog.create({
                userId: options.userId,
                type: options.HallPasses.type,
                originRoom: options.HallPasses.originRoom,
            });
            await db.sequelize.query(`UPDATE \`users\` SET \`attributes\` = JSON_SET(\`attributes\` ,'$.hasHallPass' , true) WHERE id = ${options.userId}`);
        }
        if (options.HallPasses.action == "endPass" && JSON.parse(optionsCheck[0][0].attributes).hasHallPass == true) {
            const tomp = await db.hallpasslog.destroy({
                where: {
                    userId: options.userId,
                    returnTime: null
                }
            });
            await db.sequelize.query(`UPDATE \`users\` SET \`attributes\` = JSON_SET(\`attributes\` ,'$.hasHallPass' , false) WHERE id = ${options.userId}`);
        }
        var status = 200;

        const twemp = await db.hallpasslog.findAll({
            where: {
                userId: options.userId
            },
            raw: true
        });
        return {
            status: status,
            data: JSON.stringify(twemp) != "[]" ? twemp[0] : new Object({ message: 'hallpass ended' })
        };
    },
};
