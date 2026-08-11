// controllers/paymentController.js
import { generateEsewaSignature } from '../utils/esewaSignature.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import appointmentModel from '../models/appointmentModel.js';

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;

export const initiateEsewaPayment = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const transactionUuid = `${appointmentId}-${uuidv4()}`;

    const paymentData = {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: 'http://localhost:5173/verify-esewa',
      failure_url: 'http://localhost:5173/my-appointments',
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

    paymentData.signature = generateEsewaSignature(
      paymentData.total_amount,
      transactionUuid,
      ESEWA_PRODUCT_CODE,
      ESEWA_SECRET_KEY
    );

    res.json({ success: true, paymentData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyEsewaPayment = async (req, res) => {
  try {
    const { transaction_uuid, total_amount } = req.body;

    const response = await axios.get(
      `https://rc.esewa.com.np/api/epay/transaction/status/`,
      {
        params: {
          product_code: ESEWA_PRODUCT_CODE,
          total_amount,
          transaction_uuid,
        },
      }
    );

    console.log('eSewa status response:', response.data)

    if (response.data.status === 'COMPLETE') {

      // transaction_uuid banaieko thiyo: `${appointmentId}-${uuidv4()}`
      // MongoDB ObjectId (24 hex chars) ma dash hudaina, tesaile pahilo '-' agadi ko part nai appointmentId ho
      const appointmentId = transaction_uuid.split('-')[0];

      console.log('Marking appointment as paid:', appointmentId)

      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};