const { db } = require("../config/dbConn");

const getAllUsers = async (req, res) => {
  console.log("ELKEZDŐDÖTT");
  var userList = [];
  //mysql stuff to get all users
  const users = await new Promise((resolve) => {
    db.query(
      `SELECT users.user_id, users.username, password, role_id, token FROM users INNER JOIN users_roles on users.user_id = users_roles.user_id LEFT JOIN tokens ON tokens.username = users.username`,
      (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      }
    );
  });

  if (users === undefined) {
    return res.status(204).json({ message: "No users found" });
  } else {
    users.forEach((user) => {
      //console.log("USER FOUND:\n" + user);
      const userToAdd = {
        username: user.username,
        password: user.password,
        roles: [user.role_id],
        tokens: [user.token],
      };
      /*console.log(
        "READY TO ADD IN FORMAT:\nusername: " +
          userToAdd.username +
          "\npassword: " +
          userToAdd.password +
          "\nrole: " +
          userToAdd.roles +
          "\ntokens: " +
          userToAdd.tokens
      );*/
      const userFoundInList = userList.find(
        (user) => user.username === userToAdd.username
      );
      if (userFoundInList === undefined) {
        console.log("ÚJ USER HOZZÁADVA");
        userList.push(userToAdd);
      } else {
        if (!userFoundInList.tokens.includes(userToAdd.tokens[0])) {
          console.log("ÚJ TOKEN HOZZÁADVA LÉTEZŐ ELEMHEZ");
          userFoundInList.tokens.push(userToAdd.tokens[0]);
        }
        if (!userFoundInList.roles.includes(userToAdd.roles[0])) {
          console.log("ÚJ ROLE HOZZÁADVA LÉTEZŐ ELEMHEZ");
          userFoundInList.roles.push(userToAdd.roles[0]);
        }
      }
      //userList.push();
      /*const foundTokens = [...new Set(user.map((entry) => entry.token))];
      const foundRoles = [...new Set(user.map((entry) => entry.role_id))];
      const foundUser = {
        username: user.username,
        password: user.password,
        roles: foundRoles,
        tokens: foundTokens,
      };
      userList.push(foundUser);*/
    });
    console.log("VÉGSŐ FORMÁTUM:");
    userList.forEach((user) => {
      console.log(
        "----USER----\nusername: " +
          user.username +
          "\npassword: " +
          user.password +
          "\nrole: " +
          user.roles +
          "\ntokens: " +
          user.tokens
      );
    });
  }
  //console.log(userList);
  res.json(userList);
};

/*const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = // find user with this-> req.body.id from mysql database
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  //here we actually delete the user and send back a confirmation
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = // find user with this-> req.params.id from mysql database
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};*/

module.exports = {
  getAllUsers,
  /*deleteUser,
  getUser,*/
};
