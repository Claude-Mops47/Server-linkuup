const opts = {
  points: 6, // 6 points
  duration: 1, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);
const reteLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(remoteAddress, 2) // consume 2 points
    .then((rateLimiterRes) => {
      // 2 points consumed
      next()
    })
    .catch((rateLimiterRes) => {
      // Not enough points to consume
      res.status(429).json({message:"Too Many Resquests"})
    });
};

export default {reteLimiterMiddleware}