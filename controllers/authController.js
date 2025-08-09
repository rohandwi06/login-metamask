//Impor Modul
const { User } = require('../models');
const { verifyMessage } = require('ethers');
const jwt = require('jsonwebtoken');
const keccak256 = require('keccak256')

//Untuk mengakses halaman login
exports.loginPage = (req, res) => {
  res.render('auth');
};

// exports.getNonce = async (req, res) => {

//   //Untuk mendapat address yang dikirim dari frontend
//   const { address } = req.query;  
//   if (!address) return res.status(400).json({ message: 'No address' });

//   //Untuk cek apakah address terdapat pada database
//   //Jika tidak ada, maka membuat data address
//   let user = await User.findOne({ where: { address } });
//   if (!user) {
//     user = await User.create({
//       address,
//       nonce: Math.floor(Math.random() * 1000000),
//       role: 'user'
//     });
//   }

//   //Mengirim data nonce ke frontend
//     res.json({ nonce: user.nonce });
// };

exports.getNonce = async (req, res) => {
  
  //Untuk mendapat address yang dikirim dari frontend
  const { address } = req.query;  
  if (!address) return res.status(400).json({ message: 'No address' });

  const rawNonce = Math.floor(Math.random() * 1000000).toString();
  const hashedNonce = 'Login with nonce: ' + '0x' + keccak256(rawNonce).toString('hex')

  //Untuk cek apakah address terdapat pada database
  //Jika tidak ada, maka membuat data address
  let user = await User.findOne({ where: { address } });
  if (!user) {
    user = await User.create({
      address,
      nonce: rawNonce,
      role: 'user'
    });
  }

  //Mengirim data nonce ke frontend
    res.json({ nonce: hashedNonce });
};


  // //Verifikasi signature
  // exports.loginUser = async (req, res) => {
  //   const { address, signature } = req.body;
  //   if( !address || !signature ) return res.status(401).json({message: 'Address dan Signature dibutuhkan!'})

  //   const user = await User.findOne({ where: { address } });
  //   const message = `Login with nonce: ${user.nonce}`

  //   try {
  //     const signer = verifyMessage(message, signature);
  //     if (signer.toLowerCase() !== address.toLowerCase()) {
  //       return res.status(401).json({ message: 'Signature mismatch' });
  //     }

  //     user.nonce = Math.floor(Math.random() * 1000000); 
  //     await user.save();

  //     const token = jwt.sign(
  //       { id: user.id, address: user.address, role: user.role },
  //       process.env.JWT_SECRET,
  //       { expiresIn: '1d' }
  //     )

  //     res.cookie('token', token, { httpOnly: true });
  //     res.json({ message: 'Login berhasil' });
  //   } catch (err) {
  //     res.status(500).json({ message: 'Login gagal' });
  //   }
  // };

  //Verifikasi signature
  exports.loginUser = async (req, res) => {
    const { address, signature, hashedMessage } = req.body;
    if( !address || !signature ) return res.status(401).json({message: 'Address dan Signature dibutuhkan!'})

    const user = await User.findOne({ where: { address } });

    try {
      const signer = verifyMessage(hashedMessage, signature);
      // Tambahkan log untuk debugging
    console.log('✅ Recovered signer:', signer);
    console.log('👤 Wallet address from frontend:', address);
      if (signer.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ message: 'Signature mismatch' });
      }

      user.nonce = Math.floor(Math.random() * 1000000).toString() 
      await user.save();

      const token = jwt.sign(
        { id: user.id, address: user.address, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login berhasil' });
    } catch (err) {
      res.status(500).json({ message: 'Login gagal' });
    }
  };


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
