import express from "express";
import prisma from '../prismaClient.js';

const router = express.Router();


// Get all to dos for loggin in user
router.get("/", async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId

        }
    });

    res.json(todos);
});

// Create a new todo
router.post("/", async (req, res) => {
    const { task } = req.body;
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json(todo);
});


// Update a new todo (already existing one)
router.put("/:id", async (req, res) => {
    const {completed} = req.body;
    const {id} = req.params;

    const updatedTodo = prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo);
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;

    await prisma.todo.delete({
        where:  {
            id: parseInt(id),
            userId
        }
    })

    res.send({message: "Todo deleted"});
});


export default router;