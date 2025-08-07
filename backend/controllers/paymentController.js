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

// Try-catch model imports to debug loading issues
let Payment, PurchasedItem, Booking;

try {
  Payment = require('../models/paymentModel');
  console.log('✅ Payment model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Payment model:', error.message);
}

try {
  PurchasedItem = require('../models/purchasedItemsModel');
  console.log('✅ PurchasedItem model loaded successfully');
} catch (error) {
  console.error('❌ Error loading PurchasedItem model:', error.message);
}

try {
  Booking = require('../models/bookingModel');
  console.log('✅ Booking model loaded successfully');
  console.log('✅ Booking.findById available:', typeof Booking.findById);
} catch (error) {
  console.error('❌ Error loading Booking model:', error.message);
}

// Debug the imports
console.log('🔍 Final model status:');
console.log('Payment model:', typeof Payment);
console.log('PurchasedItem model:', typeof PurchasedItem);
console.log('Booking model:', typeof Booking);
console.log('Booking.findById:', typeof Booking?.findById);

// Function to verify Khalti Payment
const verifyKhaltiPayment = async (pidx) => {
  console.log('🔍 Verifying Khalti payment with pidx:', pidx);
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
    console.log('📡 Making Khalti verification request to:', reqOptions.url);
    const response = await axios.request(reqOptions);
    console.log('✅ Khalti verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error verifying Khalti payment:', error.response ? error.response.data : error.message);
    console.error('Request config:', {
      url: reqOptions.url,
      headers: reqOptions.headers,
      data: reqOptions.data
    });
    throw error;
  }
};

// Function to initialize Khalti Payment
const initializeKhaltiPayment = async (details) => {
  console.log('🚀 Initializing Khalti payment with details:', details);
  
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const bodyContent = JSON.stringify({
    return_url: details.website_url + '/payment/success',
    website_url: details.website_url,
    amount: parseInt(details.amount), // Ensure amount is integer (paisa)
    purchase_order_id: details.itemId.toString(),
    purchase_order_name: 'Movie Ticket Purchase - FilmSathi',
    customer_info: {
      name: 'FilmSathi Customer',
      email: 'customer@filmsathi.com',
      phone: '9800000000'
    },
    product_details: [
      {
        identity: details.itemId.toString(),
        name: 'Movie Ticket',
        total_price: parseInt(details.amount),
        quantity: 1,
        unit_price: parseInt(details.amount)
      }
    ]
  });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: 'POST',
    headers: headersList,
    data: bodyContent,
  };

  try {
    console.log('📡 Making Khalti initiate request to:', reqOptions.url);
    console.log('📦 Request body:', bodyContent);
    console.log('🔑 Using secret key:', process.env.KHALTI_SECRET_KEY?.substring(0, 10) + '...');
    
    const response = await axios.request(reqOptions);
    console.log('✅ Khalti initiate response:', response.data);
    
    return {
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    };
  } catch (error) {
    console.error('❌ Error initializing Khalti payment:', error.response ? error.response.data : error.message);
    console.error('Request config:', {
      url: reqOptions.url,
      headers: { ...reqOptions.headers, Authorization: 'Key [HIDDEN]' },
      data: reqOptions.data
    });
    
    // Provide more specific error information
    if (error.response) {
      const errorData = error.response.data;
      console.error('Khalti API Error Details:', errorData);
      throw new Error(`Khalti API Error: ${errorData.detail || errorData.message || 'Unknown error'}`);
    }
    
    throw error;
  }
};

// Route handler to initialize Khalti payment
const initializeKhalti = async (req, res) => {
  console.log('🎬 Khalti payment initialization request received');
  console.log('� Using Khalti Portal: Movie Ticketing system (aghimire781@gmail.com)');
  console.log('�📋 Request body:', req.body);
  
  try {
    const { itemId, totalPrice, website_url } = req.body;
    
    // Validation
    if (!itemId || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: itemId and totalPrice are required',
      });
    }
    
    console.log('🔍 Looking for booking with ID:', itemId);
    
    // Dynamic import to avoid module loading issues
    const BookingModel = require('../models/bookingModel');
    
    // Safety check for Booking model
    if (!BookingModel || typeof BookingModel.findById !== 'function') {
      console.error('❌ Booking model not properly loaded:', typeof BookingModel);
      return res.status(500).json({
        success: false,
        message: 'Database model error - Booking model not available',
        debugInfo: {
          bookingModelType: typeof BookingModel,
          hasBookingModel: !!BookingModel,
          hasFindById: !!(BookingModel && BookingModel.findById)
        }
      });
    }
    
    // Verify item data using the correct model (Booking)
    const bookingData = await BookingModel.findById(itemId);
    
    if (!bookingData) {
      console.log('❌ Booking not found for ID:', itemId);
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    
    console.log('✅ Booking found:', bookingData);
    console.log('💰 Price comparison:', {
      bookingPrice: bookingData.price,
      bookingPriceInPaisa: bookingData.price * 100,
      requestedPrice: parseInt(totalPrice),
      match: bookingData.price * 100 === parseInt(totalPrice)
    });
    
    // Ensure the price matches (convert Rs to paisa for comparison)
    if (bookingData.price * 100 !== parseInt(totalPrice)) {
      console.log('❌ Price mismatch detected');
      return res.status(400).json({
        success: false,
        message: 'Price mismatch between booking and payment request',
        expected: bookingData.price * 100,
        received: parseInt(totalPrice)
      });
    }

    // Create a purchase document to store purchase info
    const PurchasedItemModel = require('../models/purchasedItemsModel');
    const purchasedItemData = await PurchasedItemModel.create({
      item: itemId,
      paymentMethod: 'khalti',
      totalPrice: totalPrice,
      status: 'pending'
    });
    
    console.log('✅ Purchase item created:', purchasedItemData);

    // Initialize Khalti payment
    const paymentInitiate = await initializeKhaltiPayment({
      amount: totalPrice, // Already in paisa
      itemId: purchasedItemData._id,
      website_url: website_url || 'https://localhost:3000',
    });
    
    console.log('✅ Khalti payment initialized successfully');
    res.status(200).json({
      success: true,
      payment_url: paymentInitiate.payment_url,
      pidx: paymentInitiate.pidx,
      purchaseId: purchasedItemData._id
    });
    
  } catch (error) {
    console.error('❌ Error in initializeKhalti:', error);
    
    // More detailed error response
    let errorMessage = 'An error occurred while initializing Khalti payment';
    let statusCode = 500;
    
    if (error.message?.includes('Khalti API Error')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.response?.data) {
      errorMessage = `Khalti API Error: ${JSON.stringify(error.response.data)}`;
      statusCode = 400;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Unable to connect to Khalti payment gateway. Please try again later.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      details: error.response?.data || null,
      debugInfo: {
        khaltiUrl: process.env.KHALTI_GATEWAY_URL,
        hasSecretKey: !!process.env.KHALTI_SECRET_KEY,
        timestamp: new Date().toISOString()
      }
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
    const PurchasedItemModel = require('../models/purchasedItemsModel');
    const purchasedItemData = await PurchasedItemModel.findOne({
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
    await PurchasedItemModel.findByIdAndUpdate(
      productId,
      { $set: { status: 'completed' } },
      { new: true }
    );

    const BookingModel = require('../models/bookingModel');
    const booking = await BookingModel.findById(purchasedItemData.item);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update booking status to completed
    await BookingModel.findByIdAndUpdate(
      purchasedItemData.item,
      { $set: { status: 'completed' } },
      { new: true }
    );

    // Create payment record
    const PaymentModel = require('../models/paymentModel');
    const paymentData = await PaymentModel.create({
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
