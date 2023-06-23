import cache from 'memory-cache';

export const cacheMiddleware = (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  const cacheResponse = cache.get(key);

  if (cacheResponse) {
    res.send(cacheResponse);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, 60 * 1000); // Stocke la réponse en cache pendant 60 secondes
      res.sendResponse(body);
    };
    next();
  }
};