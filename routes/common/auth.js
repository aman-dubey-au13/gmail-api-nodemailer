const express = require('express');
const User = require('../../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const router = express.Router();

async function findUser(email) {
    try {
        let user = await User.findOne({email}).lean();
        console.log(user)
        if(user) {
            return {err: false, found: true, user};
        } else {
            return {err: false, found: false, error:'Invalid email'}
        }
    } catch(e) {
        return {err:true, error: e};
    }
}

// async function findStudent(email) {
//     try {
//         let student = await Student.findOne({email}).lean();
//         if(student) {
//             return {err: false, found: true, student};
//         } else {
//             return {err: false, found: false, error:'Invalid email'}
//         }
//     } catch(e) {
//         return {err:true, error: e};
//     }
// }


router.post('/login', async function(req, res, next) {
    if(req.body.email && req.body.password) {
        let result = await findUser(req.body.email);
        if(result.err || !result.found) {
            return res.status(400).send({error: result.error});
        } else {
            let isValidPassword = await bcrypt.compare(req.body.password, result.user.password);
            if(isValidPassword) {
                let token = jwt.sign({_id: result.user._id}, config.jwt_secret_key);
                res.json({user:result.user, token});
            } else {
                return res.status(400).send({error: 'Invalid password'});
            }
        }
    } else {
        return res.status(400).send({error: 'Invalid/Not enough paramters'});
    }
});



router.post('/signup', async function(req, res, next) {
    if(req.body.email && req.body.password && req.body.name) {
        let result = await findUser(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else if(result.found) {
            return res.status(400).send({error: 'Email already exists'});
        } else {
            let hash = await bcrypt.hash(req.body.password, 10);
            let new_teacher = await User.create({email: req.body.email, password: hash, name: req.body.name});
            let token = jwt.sign({_id: new_teacher._id}, config.jwt_secret_key);
            res.json({teacher: new_user, token});
        }
    } 
     else {
        return res.status(400).send({error: 'Invalid/Not enough paramters'});
    }
});

// router.post('/login_session', async function(req, res, next) {
//     if(req.body.email && req.body.password && req.body.method && req.body.method=="teacher") {
//         let result = await findTeacher(req.body.email);
//         if(result.err || !result.found) {
//             return res.status(400).send({error: result.error});
//         } else {
//             let isValidPassword = await bcrypt.compare(req.body.password, result.teacher.password);
//             if(isValidPassword) {
//                 req.session.user = {_id: result.student._id, user_type:'student'};
//                 req.session.isLoggedin = true;
//                 res.send({teacher:result.teacher});
//             } else {
//                 return res.status(400).send({error: 'Invalid password'});
//             }
//         }
//     } else if(req.body.email && req.body.password && req.body.method && req.body.method=="student") {
//         let result = await findStudent(req.body.email);
//         if(result.err) {
//             return res.status(400).send({error: result.error});
//         } else {
//             let isValidPassword = await bcrypt.compare(req.body.password, result.student.password);
//             if(isValidPassword) {
//                 req.session.user = {_id: result.student._id, user_type:'student'};
//                 req.session.isLoggedin = true;
//                 res.send({student:result.student});
//             } else {
//                 return res.status(400).send({error: 'Invalid password'});
//             }
//         }
//     } else {
//         return res.status(400).send({error: 'Invalid/Not enough paramters'});
//     }
// });


// router.all('/logout_cookie', function(req,res, next) {
//     res
//     .cookie('myauthtoken', '', {sameSite: 'none', secure: false, httpOnly: true, maxAge:999999999})
//     .send({message: 'logout successfull'});
// });

// router.all('/logout_session', function(req,res, next) {
//     req.session.destroy();
//     res
//     .send({message: 'logout successfull'});
// });

module.exports=router;