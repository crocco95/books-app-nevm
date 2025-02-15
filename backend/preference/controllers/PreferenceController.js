const preferenceService = require('../services/UserPreferenceService');

const get = (req, res) => {

  const userId = req.params.userId;
  
  return preferenceService.get(userId)
    .then( p => res.status(200).json(p))
    .catch( err => res.status(400).json({
      message: err,
      code: 400,
    }));
}

module.exports = {
  get,
}