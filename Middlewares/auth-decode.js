


const Encode_JWT_TokenMiddleware =(req, res)=>{
      let email = req.body?.email;
       if(email){
       return res.status(200).send({
            msg : "Email Is Required"
        })
       } 
       return res.status(200).send({msg :"" , token :"sdkvsnvk" , errCode : -1 , data : [
        {
            _id :"6558asc81d4dcsdc",
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