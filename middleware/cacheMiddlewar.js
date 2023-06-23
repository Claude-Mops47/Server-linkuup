import cache from 'memory-cache'

export const cacheMiddlewar = (req,res, next)=>{
    const key = '__express__' + req.originalUrl || req.url;
    const cacheResponse = cache.get(key);
    if(cacheResponse){
        res.send(cacheResponse)
    }else{
        res.sendResponse  = res.send;
        res.send = (body)=>{
            cache.put(key, body, durationInSeconds * 1000)
            res.sendResponse(body)
        }
        next()
    }
}