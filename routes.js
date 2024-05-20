'use strict';

const express = require('express');

const { User, Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');
const bcrypt = require('bcryptjs');

const router = express.Router();

/* USER ROUTES */
// GET /users 
// This will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
    });
}));


// POST /users
// This route should create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async (req, res,) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

/* COURSE ROUTES */
// GET /courses 
// Return all courses including the User object associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: {
            model: User,
            as: 'user',
        }
    });
    res.status(200).json(courses);
}));

// GET /courses/:id
// Return the corresponding course including the User object associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;

    const course = await Course.findByPk(id, {
        include: {
            model: User,
            as: 'user',
        }
    });

    if (course) {
        res.status(200).json(course);
    }
}));

// POST /courses 
// Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
/* ERR: "Course.userId cannot be null" */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        console.log( course + course.userId + req.params.id + req.currentUser.id )

        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// PUT /courses/:id
// Update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (course) {
            if (course.userId === req.currentUser.id) {
                await course.update(req.body);
                console.log('Course: ' + course.title)

                res.status(204).end();
            } else {
                res.status(403).json({ message: 'You are not authorized to update this course' })
            }
        } else {
            res.status(404).json({ message: 'Course Not Found' })
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// DELETE /courses/:id
// Delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (course) {
            if (course.userId === req.currentUser.id) {
                await course.destroy();
                res.status(204).end();
            } else {
                res.status(403).json({ message: 'You are not authorized to delete this course' })
            }
        } else {
            res.status(404).json({ message: 'Course Not Found' })
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;