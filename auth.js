const jwtSecret = 'your_jwt_secret'; //Make sure it is the same key used in passport.js

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //Local Passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //This is the username being encoded in the JWT
        expiresIn: '7d', //Token expires after 7 days
        algorithm: 'HS256',
    });
};

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            console.log(error) 
            console.log(user)
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user,
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
            });
        })(req, res);
    });
};
