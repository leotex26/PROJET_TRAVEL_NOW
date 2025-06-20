const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin créé :', admin.toJSON());
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
})();
