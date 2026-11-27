import express from 'express';

const app = express(); // create an express app
app.use(express.json());

// routes need to be imported here
import userRouter from './routes/user.routes.js';
import transRouter from './routes/trans.routes.js';

// routes declaration
app.use("/api/users", userRouter);
app.use("/api/transactions", transRouter);

// example route: http://localhost:4000/api/users

export default app;

