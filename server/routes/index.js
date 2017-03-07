import express from 'express';

const router = express.Router();
const auth = serverContext.auth;

router.get('/', (req, res) => {
  res.send('[node server]: hello, world');
});

router.post('/register', auth.register);

router.post('/login', auth.login);

router.get('/test', auth.authenticate, serverContext.ctrls.test.test);

router.get('/error', (req, res, next) => {
  const err = new Error('I am testing error!');
  err.status = 503;
  err.name = 'TestError';
  next(err);
});

module.exports = router;
