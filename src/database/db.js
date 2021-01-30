const mysql = require('mysql2');
const dotenv = require('dotenv-safe').config();

let db_config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit : process.env.DB_CONNLIMIT
};

const pool = mysql.createPool(db_config);
console.log("Connected to MySQL!");
const promisePool = pool.promise();

module.exports.addUser = async (user_data) => {
  const sql = 'INSERT INTO users (login, psw, super, perm_add, perm_edit, perm_del) VALUES (?,?,?,?,?,?)';
  const values = [user_data.login, user_data.pswCript, user_data.isSuper, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
  const [rows, fields] = await promisePool.query(sql, values);
  return rows.insertId;
}

module.exports.editUser = async (user_id, user_data) => {
  //const sql = 'UPDATE users SET login=?, psw=?, perm_add=?, perm_edit=?, perm_del=? WHERE id=?';
  //const values = [user_data.login, user_data.pswCript, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
  //const [rows, fields] = await promisePool.query(sql, values);
}

module.exports.delUser = async (user_id) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  const values = [user_id];
  const [rows, fields] = await promisePool.query(sql, values);
  return rows.affectedRows;
}

module.exports.showUser = async (user_id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const values = [user_id];
  const [rows, fields] = await promisePool.query(sql, values);
  return rows[0];
}

module.exports.showAllUsersExceptSuper = async () => {
  const sql = 'SELECT * FROM users WHERE super<>1 ORDER BY login';
  const [rows, fields] = await promisePool.query(sql);
  return rows;
}