require('dotenv/config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/UserAuth');
const mailer = require('../../modules/mailer');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.AUTH_SECRET, {
    expiresIn: 86400,
  });
}

module.exports = {
  async index(req, res) {
    const users = await User.find();

    return res.json(users);
  },

  async register(req, res) {
    const { name, email, password, date } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          password,
          date,
        });
      }

      return res.status(200).send({
        user,
        token: generateToken({ id: user.id }),
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    return res.send('update');
  },

  async delete(req, res) {
    return res.send('delete');
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(400).send({ error: 'User not found' });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  },

  async reset(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires tokenUsed'
      );

      if (!user) return res.status(400).send({ error: 'User not found' });

      if (token !== user.passwordResetToken)
        return res.status(400).send({ error: 'Token invalid' });

      const now = new Date();

      if (now > user.passwordResetExpires)
        return res
          .status(400)
          .send({ error: 'Token expired, generate a new one' });

      if (user.tokenUsed == true)
        return res.status(400).send({
          error: 'The token has already been used, generate a new one',
        });

      user.password = password;
      user.tokenUsed = true;

      await user.save();
      res.send();
    } catch (err) {
      res.status(400).send({ error: 'Cannot reset password, try again' });
    }
  },

  async forgot(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).send({ error: 'User not found' });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 4);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
          tokenUsed: false,
        },
      });
      mailer.sendMail(
        {
          to: email,
          from: process.env.MAIL_FROM,
          subject: 'Forgot Password',
          template: 'forgot',
          context: { token },
        },
        err => {
          if (err)
            return res
              .status(400)
              .send({ error: 'Cannot send forgot password email' });

          return res.send();
        }
      );
    } catch (err) {
      res.status(400).send({ error: 'Error on forgot password, try again' });
    }
  },
};
