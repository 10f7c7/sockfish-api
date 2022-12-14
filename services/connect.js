const mysql = require('mysql')

module.exports = {
    connect: async (sql) => {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sockfish'
        });
        conn.connect((err) => {
            if (err) throw err;
            console.log('Mysql Connected...');
        });
    
        var [promise] = await new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                resolve(result);
            })
        })
        promise.states = JSON.parse(promise.states);
        return promise;
    }

}