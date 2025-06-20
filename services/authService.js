const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });

  return newUser;
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('INVALID_PASSWORD');
  }

  return user;
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};



exports.getAllProfiles = async () => {

};