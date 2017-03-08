import express from 'express';

const router = express.Router();

router.get('/list', serverContext.ctrls.news.list);

module.exports = router;
