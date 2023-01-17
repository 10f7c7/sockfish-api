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
        var dataType = await new Promise((resove, reject) => {
            conn.query('select * from information_schema.columns Where `TABLE_SCHEMA` = "sockfish" and `TABLE_NAME` = "users" and `DATA_TYPE` = "longtext";', (err, result) => {
                if (err)  {
                    reject(err);
                }
                var types = [];
                for (let i = 0; i<result.length;i++)  {
                    types.push(result[i].COLUMN_NAME);
                }
                resove(types);
            })
        })
        var promise = await new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                if (sql.split(' ')[0] == 'Select' || sql.split(' ')[0] == 'SELECT')  {
                    [result] = result;
                    for (let i=0;i<dataType.length;i++)  {
                        result[dataType[i]] = JSON.parse(result[dataType[i]]);
                    }
                    resolve(result);
                } else if (err)  {
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