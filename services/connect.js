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
    
        var promise = await new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                if (sql.split(' ')[0] == 'Select' || sql.split(' ')[0] == 'SELECT')  {
                    [result] = result;
                    result.attributes = JSON.parse(result.attributes);
                    result.HallPassLog = JSON.parse(result.HallPassLog);
                    result.information = JSON.parse(result.information);
                    resolve(result);
                } else if (err)  {
                    reject(err)
                    // throw err;
                }
                else {
                    resolve('processed.');
                }
            })
        })
        return promise;
    }

}