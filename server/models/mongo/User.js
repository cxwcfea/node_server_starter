import mongoose from 'mongoose';
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../core/config';
import defaultPlugin from '../../utils/mongoosePlugin';

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: {
    type: String,
    match: /^1[3|5|7|8|][0-9]{9}$/,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    set: hashPassword,
    required: true,
  },
  role: {
    type: [String],
    default: ['USER'],
  },
});

userSchema.methods.authenticate = function authenticate(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function generateJwt() {
  return jwt.sign({
    role: this.role,
    sub: this.id,
    iss: 'default.cxwcfea.com',
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
  }, config.confidential.jwtSecret);
};

userSchema.options.toJSON = {
  transform(doc, ret/* , options */) {
    delete ret.password;
  },
};

userSchema.plugin(defaultPlugin);

const User = mongoose.model('User', userSchema);

export default User;
