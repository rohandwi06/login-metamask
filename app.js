require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index')
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use('/auth', authRoutes);
app.use(indexRoutes)
app.use(express.static('public'))

// app.get('/', verifyToken, (req, res) => {
//   res.render('index', { user: req.user });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ DB error:', err);
  }
});
