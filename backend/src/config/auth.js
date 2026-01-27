module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: '24h',
  },
  bcrypt: {
    saltRounds: 10,
  },
};