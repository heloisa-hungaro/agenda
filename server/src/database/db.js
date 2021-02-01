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
const promisePool = pool.promise();

module.exports.checkSuper = async (user_id) => {
  const sql = 'SELECT super FROM users WHERE id=?';
  const values = [user_id];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      return rows[0].super;
    }
    return -1; // if user not found, permission denied!
  } catch (e) {
    return null;
  }
}


module.exports.checkLogin = async (user_data) => {
  const sql = 'SELECT pwd, id FROM users WHERE login=?';
  const values = [user_data.login];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      pwdMatches = bcrypt.compareSync(user_data.pwd, rows[0].pwd);
      if (pwdMatches) {
        return rows[0].id;
      } else {
        return 0;
      }
    }
    return 0;
  } catch (e) {
    return null;
  }
}

module.exports.addUser = async (user_data) => {
  const salt = bcrypt.genSaltSync(10);
  const pwdCript = bcrypt.hashSync(user_data.pwd, salt);
  const sql = 'INSERT INTO users (login, pwd, super, perm_add, perm_edit, perm_del) VALUES (?,?,?,?,?,?)';
  const values = [user_data.login, pwdCript, user_data.isSuper, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.insertId;
  } catch (e) {
    return null;
  }
}

module.exports.editUser = async (user_id, user_data) => {
  /* TO-DO
  const sql = 'UPDATE users SET login=?, pwd=?, perm_add=?, perm_edit=?, perm_del=? WHERE id=?';
  const values = [user_data.login, user_data.pwdCript, user_data.permissions.add, user_data.permissions.edit, user_data.permissions.del];
  const [rows] = await promisePool.execute(sql, values);
  */
}

module.exports.delUser = async (user_id) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  const values = [user_id];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.affectedRows;
  } catch (e) {
    return null;
  }
}

module.exports.showUser = async (user_id) => {
  const sql = 'SELECT login, perm_add, perm_edit, perm_del FROM users WHERE id = ?';
  const values = [user_id];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      return rows[0];
    } else { // user not found
      return 0;
    }
  } catch (e) {
    return null;
  }
}

module.exports.showAllUsersExceptSuper = async () => {
  const sql = 'SELECT id, login FROM users WHERE super<>1 ORDER BY login';
  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    return null;
  }
}