//Impor method dan modul yang dibutuhkan
const { User } = require('../models');
const { verifyMessage } = require('ethers');
const jwt = require('jsonwebtoken');
const keccak256 = require('keccak256')

//Untuk mengakses halaman login
exports.loginPage = (req, res) => {
  res.render('auth');
};

//Controller getNonce digunakan untuk mendapatkan data nonce yang akan di sign
exports.getNonce = async (req, res) => {
  
  //Untuk mendapat address yang dikirim dari frontend lewat query
  const { address } = req.body;  
  if (!address) return res.status(400).json({ message: 'No address' });

  //Generate raw nonce dan meng-hash nya menggunakan keccak256
  const rawNonce = Math.floor(Math.random() * 1000000).toString();
  const hashedNonce = 'Login with nonce: ' + '0x' + keccak256(rawNonce).toString('hex')

  //Cek data user di database
  let user = await User.findOne({ where: { address } });

  //Jika tidak ada, maka membuat data user baru
  if (!user) {
    user = await User.create({
      address,
      nonce: rawNonce,
      role: 'user'
    });
  }

  //Mengirim data nonce ke frontend
    res.json({ nonce: hashedNonce });
}

  //Controller loginUser digunakan untuk memverifikasi signature
  exports.loginUser = async (req, res) => {

    //Mendapatkan data address, signature, hashedMessage dari method post dari frontend
    const { address, signature, hashedMessage } = req.body;
    if( !address || !signature ) return res.status(401).json({message: 'Address dan Signature dibutuhkan!'})

    //Cek data user
    const user = await User.findOne({ where: { address } });

    try {
      
      //Variabel signer digunakan untuk mendapatkan recovered address
      const signer = verifyMessage(hashedMessage, signature);

      //Cek apakah recovered address = user address
      if (signer.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ message: 'Signature mismatch' });
      }

      //Generate raw nonce baru dan menyimpanya di data user di database
      user.nonce = Math.floor(Math.random() * 1000000).toString() 
      await user.save();

      //Generate jwt untuk autentikasi
      const token = jwt.sign(
        { id: user.id, address: user.address, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      //Menyimpan jwt di cookie
      res.cookie('token', token, { httpOnly: true });

      res.json({ message: 'Login berhasil' });
    } catch (err) {
      res.status(500).json({ message: 'Login gagal' });
    }
  };

//Controller checkToken untuk cek apakah jwt masih valid atau tidak
exports.checkToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ valid: false })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    return res.json({ valid: false })
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};
