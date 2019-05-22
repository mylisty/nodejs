


const mysql  = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'node',
});

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(sql,function (err, rows) {
            callback(err,rows);
            connection.release();
        })
    });
}

module.exports.query = query;
