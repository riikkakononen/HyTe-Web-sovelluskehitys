const requestLogger = (req, res, next) => { 
  console.log(new Date().toLocaleString('en-EN'), req.method, req.url);

  if (req.body) {
    const safeBody = { ...req.body };

    if (safeBody.password) {
      safeBody.password = '***';
    }

    console.log('body:', safeBody);
  }

  next();
};

export default requestLogger;