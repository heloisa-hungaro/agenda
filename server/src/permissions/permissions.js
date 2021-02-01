const db = require('../database/db');
const statusMsg = require('../http/messages');

module.exports.canManageUsers = async (user_id,res) => {
  // if super = 0, user can't CRUD users data
  const superLogged = await db.checkSuper(user_id);
  if (superLogged==null) { // db error
    res.status(500).json({message: statusMsg.msgDbError});
    return false;
  } else if (superLogged==0) { // user is not allowed to do this action
    res.status(403).json({message: statusMsg.msgForbidden});
    return false;
  } else if (superLogged==-1) { // somehow user was not found to get super
    res.status(401).json({message: statusMsg.msgUnauthorized});
    return false;
  } else { // user is allowed to do this action
    return true;
  }
}