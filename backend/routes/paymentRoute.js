// routes/paymentRoute.js
import express from 'express';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/paymentController.js';
import authUser from '../middlewares/authUser.js';

const paymentRouter = express.Router();

paymentRouter.post('/esewa-initiate', authUser, initiateEsewaPayment);
paymentRouter.post('/esewa-verify', verifyEsewaPayment);

export default paymentRouter;