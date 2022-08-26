// const jwt = require('jsonwebtoken');

// let authenticateToken = (req, res, next) => {
//   try{
//       console.log(req.headers);
//       const authHeader = req.headers['authorization'];
//       if(authHeader == null){
//           res.json({success : false});
//           return;
//       }

//       const token = authHeader.split(' ')[1];
  
//       if (token == null){
//           res.json({success : false});
//           return;
//       }
  
//       jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//         console.log(err);
//         if (err){
//             res.json({success : false});
//             return;
//         }
//         next();
//       });
//   }catch(err){
//       console.log(err);
//       res.json({success : false});
//       return;
//   }
// }

// module.exports = {authenticateToken};