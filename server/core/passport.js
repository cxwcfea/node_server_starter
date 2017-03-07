const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let auth = null;

function initPassport(app) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'name',
    },
    (username, password, done) => {
      serverContext.mongoModels.User
        .findOne({ name: username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'User not found!' });
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'Incorrect password!' });
          }
          return done(null, user);
        })
        .catch(error => done(error));
    },
  ));

  const opts = {
    secretOrKey: serverContext.config.confidential.jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('Bearer'), ExtractJwt.fromBodyField('jwt'), ExtractJwt.fromUrlQueryParameter('jwt')]),
    issuer: 'default.cxwcfea.com',
  };
  passport.use(new JwtStrategy(opts, (payload, done) => {
    serverContext.mongoModels.User
      .findById(payload.sub)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'User not found!' });
        }
        return done(null, user);
      })
      .catch(error => done(error));
  }));
}

export default (app) => {
  if (!auth) {
    app.use(passport.initialize());
    initPassport(app);
    auth = {
      login(req, res, next) {  // TODO: use req.params
        if (!req.body.name || !req.body.password) {
          res.sendJsonError('missing params!');
        }

        passport.authenticate('local', (err, user, info) => {
          if (err) { return next(err); }
          if (!user) { return res.sendJsonError(info.message); }
          return res.sendJsonResponse({ token: user.generateJwt() });
        })(req, res, next);
      },
      register(req, res) {
        if (!req.body.name || !req.body.password) {
          res.sendJsonError('missing params!');
          return;
        }

        const data = {
          name: req.body.name,
          password: req.body.password,
        };
        if (req.body.email) {
          data.email = req.body.email;
        }
        if (req.body.mobile) {
          data.name = req.body.mobile;
        }

        serverContext.mongoModels.User
          .create(data)
          .then((user) => {
            res.sendJsonResponse({ token: user.generateJwt() });
          })
          .catch((error) => {
            if (error.code === 11000 && error.name === 'MongoError') {
              res.sendJsonError('Use already exists!');
            } else {
              res.sendJsonError(error.message, serverContext.errorCode.MongoError, 500);
            }
          });
      },
      authenticate: passport.authenticate('jwt', { session: false }),
    };
  }
  return auth;
};

