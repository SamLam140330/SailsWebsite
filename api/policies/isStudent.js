// isStudent.js
module.exports = async function (req, res, proceed) {
  if (req.session.userRole === 'student') {
    return proceed();
  }

  return res.forbidden();
};
