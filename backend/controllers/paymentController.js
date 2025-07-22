// const khaltiService = require('../service/khaltiService');

// const verifyPayment = async (req, res) => {
//   const { token, amount } = req.body;

//   try {
//     const data = await khaltiService.verifyPayment(token, amount);

//     // Handle successful verification (e.g., update the database)
//     const { idx } = data;
//     // console.log('Payment verified:', idx);
//     // Update your database or perform other actions here

//     res.json({ success: true, idx });
//   } catch (error) {
//     console.error('Payment verification failed:', error);
//     res.status(400).json({ success: false, error });
//   }
// };

// module.exports = {
//   verifyPayment,
// };

const axios = require('axios');
const Payment = require('../models/paymentModel').default;
const PurchasedItem = require('../models/purchasedItemsModel');
const Booking = require('../models/bookingModel').default;

// Function to verify Khalti Payment
const verifyKhaltiPayment = async (pidx) => {
  // console.log('Verifying Khalti payment:', pidx);
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: 'POST',
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error(
      'Error verifying Khalti payment:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to initialize Khalti Payment
const initializeKhaltiPayment = async (details) => {
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const bodyContent = JSON.stringify({
    return_url: details.website_url + '/user/payment/success',
    website_url: details.website_url,
    amount: details.amount, // Amount in paisa
    purchase_order_id: details.itemId,
    purchase_order_name: 'Insurance Purchase',
  });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: 'POST',
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return {
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    };
  } catch (error) {
    console.error(
      'Error initializing Khalti payment:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Route handler to initialize Khalti payment
const initializeKhalti = async (req, res) => {
  // // console.log("hit");
  try {
    // console.log(req.body);
    const { itemId, totalPrice } = req.body;
    // console.log(parseInt(totalPrice));
    // Verify item data using the correct model (Insurance in your case)
    const data = await Booking.findById(itemId);
    // console.log(data);
    if (data.price * 100 !== parseInt(totalPrice)) {
      // console.log(data.price * 100, totalPrice);
      // Ensure the price match
      return res.status(400).json({
        success: false,
        message: 'booking not found or price mismatch',
      });
    }

    // Create a purchase document to store purchase info
    const purchasedItemData = await PurchasedItem.create({
      item: itemId,
      paymentMethod: 'khalti',
      totalPrice: totalPrice,
    });

    // Initialize Khalti payment
    const paymentInitiate = await initializeKhaltiPayment({
      amount: totalPrice, // Ensure this is in paisa
      itemId: purchasedItemData._id ?? itemId,
      website_url: req.body.website_url || 'https://localhost:3000',
    });

    res.status(200).json({
      success: true,
      payment_url: paymentInitiate.payment_url,
      pidx: paymentInitiate.pidx,
    });
  } catch (error) {
    console.error('Error initializing Khalti payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while initializing Khalti payment',
      error: error.message,
    });
  }
};

// Route handler to complete Khalti payment
const completeKhaltiPayment = async (req, res) => {
  // console.log(req.body);
  const {
    pidx,

    amount,

    productId,

    transactionId,
  } = req.body;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    // Check if payment is completed and details match
    if (
      paymentInfo?.status !== 'Completed' ||
      paymentInfo.transaction_id !== transactionId ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete information',
        paymentInfo,
      });
    }

    // Check if payment done in valid item
    const purchasedItemData = await PurchasedItem.findOne({
      _id: productId,
      totalPrice: amount,
    });

    if (!purchasedItemData) {
      return res.status(400).send({
        success: false,
        message: 'Purchased data not found',
      });
    }

    // Update purchase record status to completed
    await PurchasedItem.findByIdAndUpdate(
      productId,
      { $set: { status: 'completed' } },
      { new: true }
    );

    const booking = await Booking.findById(purchasedItemData.item);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update booking status to completed
    await Booking.findByIdAndUpdate(
      purchasedItemData.item,
      { $set: { status: 'completed' } },
      { new: true }
    );

    // Create payment record
    const paymentData = await Payment.create({
      amount: amount,
      productId: purchasedItemData._id,
      pidx: pidx,
      status: 'success',
      paymentGateway: 'khalti',
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Payment Successful',
      transactionId: paymentData.transactionId,
    });
  } catch (error) {
    console.error('Error in complete-khalti-payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message,
    });
  }
};

module.exports = {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
  initializeKhalti,
  completeKhaltiPayment,
};
