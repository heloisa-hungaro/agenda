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
  const sql = 'SELECT * FROM users WHERE login=?';
  const values = [user_data.login];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      pwdMatches = bcrypt.compareSync(user_data.pwd, rows[0].pwd);
      if (pwdMatches) {
        return rows[0];
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
  const sql = 'SELECT login, name, perm_add, perm_edit, perm_del FROM users WHERE id = ?';
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
  const sql = 'SELECT id, login, name FROM users WHERE super<>1 ORDER BY login';
  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    return null;
  }
}

module.exports.addContact = async (cont_data) => {
  const sql = 'INSERT INTO contacts (name, address, fones, emails, notes) VALUES (?,?,?,?,?)';
  const values = [cont_data.name, cont_data.address, cont_data.fones, cont_data.emails, cont_data.notes];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.insertId;
  } catch (e) {
    return null;
  }
}

module.exports.editContact = async (cont_id, cont_data) => {
  /* TO-DO
  const sql = 'UPDATE contact SET ? WHERE ?';
  const values = [];
  const [rows] = await promisePool.execute(sql, values);
  */
}

module.exports.delContact = async (cont_id) => {
  const sql = 'DELETE FROM contacts WHERE id = ?';
  const values = [cont_id];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.affectedRows;
  } catch (e) {
    return null;
  }
}

module.exports.showContact = async (cont_id) => {
  const sql = 'SELECT * FROM contacts WHERE id = ?';
  const values = [cont_id];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      return rows[0];
    } else { // contact not found
      return 0;
    }
  } catch (e) {
    return null;
  }
}

module.exports.showSelectedContacts = async () => {
  const sql = 'SELECT * FROM contacts ORDER BY name LIMIT 10';
  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    return null;
  }
}