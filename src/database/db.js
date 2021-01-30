const mysql = require('mysql2');
const dotenv = require('dotenv-safe').config();
const bcrypt = require('bcrypt');

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

module.exports.checkLogin = async (user_data) => {
  const sql = 'SELECT pwd, id FROM users WHERE login=?';
  const values = [user_data.login];
  const [rows, fields] = await promisePool.query(sql, values);
  if (rows.length>0) {
    pwdMatches = bcrypt.compareSync(user_data.pwd, rows[0].pwd);
    if (pwdMatches) {
      return rows[0].id;
    } else {
      return 0;
    }
  }
  return 0;
}

module.exports.addUser = async (user_data) => {
  const salt = bcrypt.genSaltSync(10);
  const pwdCript = bcrypt.hashSync(user_data.pwd, salt);
  const sql = 'INSERT INTO users (login, pwd, super, perm_add, perm_edit, perm_del) VALUES (?,?,?,?,?,?)';
  const values = [user_data.login, pwdCript, user_data.isSuper, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
  const [rows, fields] = await promisePool.query(sql, values);
  return rows.insertId;
}

module.exports.editUser = async (user_id, user_data) => {
  //const sql = 'UPDATE users SET login=?, pwd=?, perm_add=?, perm_edit=?, perm_del=? WHERE id=?';
  //const values = [user_data.login, user_data.pwdCript, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
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