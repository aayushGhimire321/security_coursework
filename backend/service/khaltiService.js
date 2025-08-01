import { post } from 'axios';
import dotenv from 'dotenv';

const verifyPayment = async (token, amount) => {
  try {
    const response = await post(
      'https://khalti.com/api/v2/payment/verify/',
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export default {
  verifyPayment,
};
