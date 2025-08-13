import ratelimit from '../config/upstash.js';

const rateLimiter = async(req,res,next) => {
  try {
    // Aqui fiz um simples
    // Em caso de um aplicativo do mundo real, eu puxaria o id do user ou endereço IP como chave
    const { success } = await ratelimit.limit("my-rate-limit");   

    if(!success){
      return res.status(429).json({
        message:"Muita requisições feitas, por favor tente mais tarde.",
      });
    }

    next();
  }catch(error) {
    console.log("Rate Limit Error", error)
    next(error);      
  }
};

export default rateLimiter;