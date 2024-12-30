import prisma from '../prismaClient.js';
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();



// Register a new user endpoint @ /auth/endpoint
router.post('/register', async (req,res) => {

    // We will encrypt the password
    // It is irreversible. 

    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save user and hashpwd to database.

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        const defaultTodo = "Hello! Add your first to do!";
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })
        //create a token
        
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});

        res.json({token});

    } catch(err) {
        console.log(err.message);
        res.status(503);
    }

});

router.post('/login', async (req, res) => {
    // The only way for the user to correctly get the right password is to input the correct pwd.
    // As the algorithm is deterministic, then just simply reencrypting the inputting password and matching it with the one in the database is enough.


    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).send({message: "User not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!password) {
            return res.status(401).send({message: "Invalid password"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});

        res.json({token});

    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

export default router