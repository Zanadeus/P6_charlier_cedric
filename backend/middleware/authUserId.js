const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try 
  {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    res.token.userId = userId;
    function userIdTest(param)
    {
      console.log('function userIdTest called');
      if (res.token.userId === param.userId) 
      {
        next();
      } 
      else 
      {
        return res.status(401).json({ message : 'Invalid user ID' });
      }
    }
  }
  catch 
  {
    res.status(401).json({ error: new Error('Invalid request!')});
  }
};