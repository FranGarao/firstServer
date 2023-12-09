const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const model = {
  fileRoute: path.join(__dirname, "../json/users.json"),

  create(userData) {
    const emailInIuse = model.findByEmail(userData.email);

    if (emailInIuse) {
      return { error: "El email ya esta en uso" };
    }

    let users = JSON.parse(fs.readFileSync(model.fileRoute, "utf-8"));

    const newUser = {
      id: uuid.v4(),
      ...userData,
    };
    newUser.password = bcrypt.hashSync(userData.password, 11);
    users.push(newUser);

    const usersJson = JSON.stringify(users);

    fs.writeFileSync(model.fileRoute, usersJson, "utf-8");

    return newUser;
  },

  login() {},
  findByEmail: (email) => {
    const users = JSON.parse(fs.readFileSync(model.fileRoute, "utf-8"));
    const coincidence = users.find((user) => user.email === email);

    return coincidence || null;
  },
};
module.exports = model;
