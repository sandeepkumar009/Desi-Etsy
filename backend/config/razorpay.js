import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error('Razorpay Key ID or Key Secret is not defined in .env file');
}

export const instance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
