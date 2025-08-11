//Import module
const jwt = require('jsonwebtoken');

//Middleware untuk memverifikasi jwt token
function verifyToken(req, res, next) {

  //Mendapatkan token jwt
  const token = req.cookies.token
  if (!token) return res.redirect('/auth/login')

  try {
    
    //Variabel decoded bersisi data user yang ada pada jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //Sekarang req.user juga berisi data yang sama dengan decoded
    req.user = decoded

    //Menyambungkan ke route handler berikutnya
    next()
  } catch {
    res.redirect('/auth/login')
  }
}

module.exports = verifyToken
