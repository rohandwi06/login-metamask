const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.redirect('/auth/login')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.redirect('/auth/login')
  }
}

module.exports = verifyToken
