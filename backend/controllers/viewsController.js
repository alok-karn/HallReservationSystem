const MySqlHelper = require("../config/mysql-db-pool");

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Login to your account",
    });
};
