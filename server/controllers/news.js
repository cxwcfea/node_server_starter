export default {
  async list(req, res, next) {
    const page = req.query.page || 1;
    try {
      const newsList = await serverContext.services.news.list(page);
      res.sendJsonResponse(newsList);
    } catch (err) {
      next(err);
    }
  },
};
