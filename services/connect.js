const mysql = require('mysql')
require('dotenv').config();

function sqlBuilder([queryMode, table, collumn, where, userId,], data = null) {
    var meta = {
        queryMode: "",
        table: "",
        collumn: "",
        where: "",
        userId: "",
        data: data
    }
    var sql = { sql: "" };
    switch (queryMode.toUpperCase()) {
        case 'UPDATE':
            meta.queryMode = "UPDATE";
            break;
        case 'INSERT':
            meta.queryMode = "INSERT";
            break;
        case 'SELECT':
            meta.queryMode = "SELECT";
            meta.data = null;
            meta.collumn = "*";
            break;
        default:
            throw new Error('Invalid query mode');
            break;
    }

    switch (table) {
        case 'users':
            meta.table = "users";
            break;
        case 'userauth':
            meta.table = "userauth";
            break;
        default:
            throw new Error('Invalid table');
            break;
    }

    switch (collumn) {
        case 'HallPassLog':
            meta.collumn = "HallPassLog";
            break;
        case 'information':
            meta.collumn = "information";
            break;
        case 'attributes':
            meta.collumn = "attributes";
            break;
        case '*':
            meta.collumn = "*";
            break;
        default:
            throw new Error('Invalid collumn');
            break;
    }

    if (typeof userId != 'string' && where == 'id') {
        throw new Error('Invalid userId');
    } if (typeof userId != 'string' && where == 'username') {
        throw new Error('Invalid username');
    }
    else {
        meta.userId = userId;
    }

    switch (where) {
        case 'username':
            meta.where = "username";
            meta.userId = "'" + meta.userId + "'";
            break;
        case 'id':
            meta.where = "id";
            break;
        default:
            console.log(where);
            throw new Error('Invalid locator');
            break;
    }



    switch (meta.queryMode.toUpperCase()) {
        case 'UPDATE':
            meta.sql = "UPDATE `" + meta.table + "` SET `" + meta.collumn + "` = " + data + " WHERE " + meta.where + " = " + meta.userId + ";";
            break;
        case 'INSERT':
            meta.sql = "INSERT INTO `" + meta.table + "` (`" + meta.collumn + "`) VALUES (" + data + ");";
            break;
        case 'SELECT':
            meta.sql = "SELECT " + meta.collumn + " FROM " + meta.table + " WHERE " + meta.where + " = " + meta.userId + ";";
            break;
        default:
            break;
    }
    Object.freeze(meta);

    // console.log(meta.sql);
    return meta;
}





module.exports = {
    connect: async ([queryMode, table, collumn, userId, where], data = null) => {
        const sql = sqlBuilder([queryMode, table, collumn, userId, where], data);
        // console.log(sql);


        const conn = mysql.createConnection({
            host: process.env.MYSQL_URL,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
        conn.connect((err) => {
            if (err) throw err;
            console.log('Mysql Connected...');
        });
        // var table = 'users';
        // if (sql.includes("userauth"))  {
        //     table = 'userauth';
        // }
        var dataType = await new Promise((resove, reject) => {
            conn.query(`select * from information_schema.columns Where \`TABLE_SCHEMA\` = "sockfish" and \`TABLE_NAME\` = "${sql.table}" and \`DATA_TYPE\` = "longtext";`, (err, result) => {
                if (err) {
                    reject(err);
                }
                var types = [];
                if (!result.length) {
                    resove(types);
                    return;
                }
                for (let i = 0; i < result.length; i++) {
                    types.push(result[i].COLUMN_NAME);
                }
                resove(types);
            })
        })
        var promise = await new Promise((resolve, reject) => {
            conn.query(sql.sql, (err, result) => {
                if (sql.sql.split(' ')[0] == 'Select' || sql.sql.split(' ')[0] == 'SELECT') {
                    [result] = result;
                    if (!dataType.length) {
                        resolve(result);
                        return;
                    }
                    for (let i = 0; i < dataType.length; i++) {
                        result[dataType[i]] = JSON.parse(result[dataType[i]]);
                    }
                    resolve(result);
                } else if (err) {
                    reject(err)
                }
                else {
                    resolve('processed.');
                }
            })
        })
        return promise;
    },
    legacy: async (sql) => {
        const conn = mysql.createConnection({
            host: process.env.MYSQL_URL,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
        conn.connect((err) => {
            if (err) throw err;
            console.log('Mysql Connected...');
        });
        var table = 'users';
        if (sql.includes("userauth")) {
            table = 'userauth';
        } else if (sql.includes("crisis")) {
            table = 'crisis';
        }
        var dataType = await new Promise((resove, reject) => {
            conn.query(`select * from information_schema.columns Where \`TABLE_SCHEMA\` = "sockfish" and \`TABLE_NAME\` = "${table}" and \`DATA_TYPE\` = "longtext";`, (err, result) => {
                if (err) {
                    reject(err);
                }
                var types = [];
                if (!result.length) {
                    resove(types);
                    return;
                }
                for (let i = 0; i < result.length; i++) {
                    types.push(result[i].COLUMN_NAME);
                }
                resove(types);
            })
        })
        var promise = await new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                if (table == 'crisis') {
                    resolve(result);
                }
                if (sql.split(' ')[0] == 'Select' || sql.split(' ')[0] == 'SELECT') {
                    [result] = result;
                    if (!dataType.length) {
                        resolve(result);
                        return;
                    }
                    for (let i = 0; i < dataType.length; i++) {
                        result[dataType[i]] = JSON.parse(result[dataType[i]]);
                    }
                    resolve(result);
                } else if (err) {
                    reject(err)
                }
                else {
                    resolve('processed.');
                }
            })
        })
        return promise;
    }

}