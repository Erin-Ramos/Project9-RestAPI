'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
    let message;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (credentials) {
        try {
            const user = await User.findOne({ where: { emailAddress: credentials.name } });
            if (user) {
                const authenticated = await bcrypt.compareSync(credentials.pass, user.password);
                if (authenticated) {
                    console.log(`Authentication successful for username: ${user.emailAddress}`);

                    // Store the user on the Request object.
                    req.currentUser = user;
                    return next();
                } else {
                    message = 'Authentication failure';
                }
            } else {
                message = 'User not found';
            }
        } catch (error) {
            console.error('Error during authentication process:', error);
            message = 'Internal server error';
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
