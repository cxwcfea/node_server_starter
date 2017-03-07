export default {
  test(req, res) {
    console.log(req.user);
    res.sendJsonResponse({ content: 'test controller', user: req.user });
  },
};
