const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("verify roles másodikon átjutott");
    //console.log(req);
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((value) => value === true);
    if (!result) return res.sendStatus(401);

    console.log("Role auth sikeres");
    next();
  };
};

module.exports = verifyRoles;
