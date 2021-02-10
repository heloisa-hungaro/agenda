const mysql = require('mysql2');
const dotenv = require('dotenv-safe').config();
const bcrypt = require('bcrypt');

let dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit : process.env.DB_CONNLIMIT
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports.checkSuper = async (userId) => {
  const sql = 'SELECT super FROM users WHERE id=?';
  const values = [userId];
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

module.exports.checkLogin = async (userData) => {
  const sql = 'SELECT * FROM users WHERE login=?';
  const values = [userData.login];
  try {
    const [rows] = await promisePool.execute(sql, values);
    if (rows.length>0) {
      pwdMatches = bcrypt.compareSync(userData.pwd, rows[0].pwd);
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

module.exports.addUser = async (userData) => {
  const salt = bcrypt.genSaltSync(10);
  const pwdCript = bcrypt.hashSync(userData.pwd, salt);
  const sql = 'INSERT INTO users (login, pwd, super, perm_add, perm_edit, perm_del) VALUES (?,?,?,?,?,?)';
  const values = [userData.login, pwdCript, userData.isSuper, userData.permissions.add, userData.permissions.edit, userData.permissions.del];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.insertId;
  } catch (e) {
    return null;
  }
}

module.exports.editUser = async (userId, userData) => {
  const sql = 'UPDATE users SET ? WHERE id = ?';
  const values = [userData, userId];
  console.log(values);
  try {
    const [rows] = await promisePool.query(sql, values);
    return rows.affectedRows;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports.delUser = async (userId) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  const values = [userId];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.affectedRows;
  } catch (e) {
    return null;
  }
}

module.exports.showUser = async (userId) => {
  const sql = 'SELECT login, name, perm_add, perm_edit, perm_del FROM users WHERE id = ?';
  const values = [userId];
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

module.exports.addContact = async (contData) => {
  const sql = 'INSERT INTO contacts (name, address, fones, emails, notes) VALUES (?,?,?,?,?)';
  const values = [contData.name, contData.address, contData.fones, contData.emails, contData.notes];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.insertId;
  } catch (e) {
    return null;
  }
}

module.exports.editContact = async (contId, contData) => {
  const sql = 'UPDATE contacts SET ? WHERE id = ?';
  const values = [contData, contId];
  console.log(values);
  try {
    const [rows] = await promisePool.query(sql, values);
    return rows.affectedRows;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports.delContact = async (contId) => {
  const sql = 'DELETE FROM contacts WHERE id = ?';
  const values = [contId];
  try {
    const [rows] = await promisePool.execute(sql, values);
    return rows.affectedRows;
  } catch (e) {
    return null;
  }
}

module.exports.showContact = async (contId) => {
  const sql = 'SELECT * FROM contacts WHERE id = ?';
  const values = [contId];
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

module.exports.showSelectedContacts = async (searchName) => {
  const sql = `SELECT * FROM contacts WHERE name LIKE \'%${searchName}%\' ORDER BY name`;
  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    return null;
  }
}