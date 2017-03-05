function sendJsonResponse(data = null, { httpCode = 200, code = 0, msg = '' } = { httpCode: 200, code: 0 }) {
  const res = this;
  const result = {
    code,
    msg,
  };
  if (data != null) {
    result.data = data;
  }
  if (httpCode !== 200) {
    result.code = httpCode;
  }
  res.status(httpCode).json(result);
}

export default (req, res, next) => {
  res.sendJsonResponse = sendJsonResponse;
  next();
};
