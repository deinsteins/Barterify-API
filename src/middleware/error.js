const error = (err, req, res, next) => {
  if (err.code === 11000 && err.name === "MongoError" ) {
    const duplicateUsername = err.message.indexOf("username") !== -1;
    const duplicateEmail = err.message.indexOf("email") !== -1;

    let message;

    if (duplicateEmail) message = "Email sudah terdaftar";
    if (duplicateUsername) message = "Username sudah terdaftar";

    return res.status(409).json({
      error: true,
      message,
    });
  }

  const { message = "An Error Occured", status = 400 } = err;

  res.status(status).json({
    error: true,
    message,
    status,
  });
};

module.exports = { error };
