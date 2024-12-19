


const Encode_JWT_TokenMiddleware =(req, res)=>{
      let email = req.body?.email;
       if(email){
       return res.status(200).send({
            msg : "Email Is Required"
        })
       } 
       return res.status(200).send({msg :"" , token :"sdkvsnvk" , errCode : -1 , data : [
        {
            userId :"654360764824ec3abb5229b9",
            mane :"Pablo EscoBar"
        }
       ] } )
 }
const Decode_JWT_TokenMiddleware =(req, res, next)=>{
     let token  ="jkenjncksiwdasjADJIOAKSMADSKCMLLClsm"
     if(!token){
        res.send("Invalid Token")
     }
     next()
}

module.exports ={
    Encode_JWT_TokenMiddleware  : Encode_JWT_TokenMiddleware,
    Decode_JWT_TokenMiddleware : Decode_JWT_TokenMiddleware
}