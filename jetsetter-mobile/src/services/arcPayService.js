import Constants from 'expo-constants';
import { encode as base64Encode } from 'base-64';

// ARC Pay API Configuration
const ARC_CONFIG = {
  merchantId: Constants.expoConfig?.extra?.ARC_PAY_MERCHANT_ID || process.env.ARC_PAY_MERCHANT_ID || 'TESTARC05511704',
  apiUrl: Constants.expoConfig?.extra?.ARC_PAY_API_URL || process.env.ARC_PAY_API_URL || 'https://api.arcpay.travel/api/rest/version/100/merchant/TESTARC05511704',
  username: Constants.expoConfig?.extra?.ARC_PAY_API_USERNAME || process.env.ARC_PAY_API_USERNAME || 'Administrator',
  password: Constants.expoConfig?.extra?.ARC_PAY_API_PASSWORD || process.env.ARC_PAY_API_PASSWORD || 'Jetsetters@2025',
};

// Create Base64 encoded authorization header
const getAuthHeader = () => {
  const credentials = `${ARC_CONFIG.username}:${ARC_CONFIG.password}`;
  const base64Credentials = base64Encode(credentials);
  return `Basic ${base64Credentials}`;
};

/**
 * Create a payment session with ARC Pay
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment session result
 */
const createPaymentSession = async (paymentData) => {
  try {
    console.log('🔐 Creating ARC Pay payment session...');
    console.log('Merchant ID:', ARC_CONFIG.merchantId);

    const {
      amount,
      currency = 'USD',
      orderReference,
      customerEmail,
      customerPhone,
      description,
      returnUrl,
    } = paymentData;

    // Prepare the payment session request
    const requestBody = {
      merchantId: ARC_CONFIG.merchantId,
      amount: amount.toFixed(2),
      currency,
      orderReference,
      customer: {
        email: customerEmail,
        phone: customerPhone,
      },
      description,
      returnUrl: returnUrl || 'https://jetsetterss.com/booking-confirmation',
      cancelUrl: returnUrl || 'https://jetsetterss.com/booking-cancelled',
    };

    console.log('📤 Payment session request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${ARC_CONFIG.apiUrl}/payment/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('📥 Payment session response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create payment session');
    }

    return {
      success: true,
      sessionId: responseData.sessionId,
      paymentUrl: responseData.paymentUrl,
      expiresAt: responseData.expiresAt,
      data: responseData,
    };
  } catch (error) {
    console.error('❌ ARC Pay session creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment session',
    };
  }
};

/**
 * Process a payment with card details
 * @param {Object} paymentData - Payment and card details
 * @returns {Promise<Object>} Payment result
 */
const processPayment = async (paymentData) => {
  try {
    console.log('💳 Processing ARC Pay payment...');
    console.log('🔧 ARC Config:', {
      merchantId: ARC_CONFIG.merchantId,
      apiUrl: ARC_CONFIG.apiUrl,
      username: ARC_CONFIG.username,
      password: ARC_CONFIG.password ? '***' : 'MISSING'
    });

    const {
      amount,
      currency = 'USD',
      orderReference,
      customerEmail,
      customerPhone,
      customerName,
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      description,
    } = paymentData;

    // Validate required fields
    if (!amount || !cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv) {
      throw new Error('Missing required payment fields');
    }

    // Validate card number
    if (!validateCardNumber(cardNumber)) {
      throw new Error('Invalid card number');
    }

    // Prepare the payment request
    const requestBody = {
      merchantId: ARC_CONFIG.merchantId,
      transactionType: 'SALE',
      amount: amount.toFixed(2),
      currency,
      orderReference,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      card: {
        number: cardNumber.replace(/\s/g, ''),
        holder: cardHolder,
        expiryMonth: expiryMonth.toString().padStart(2, '0'),
        expiryYear: expiryYear.toString(),
        cvv: cvv,
      },
      description,
      metadata: {
        bookingType: 'cruise',
        timestamp: new Date().toISOString(),
      },
    };

    console.log('📤 Payment request (card hidden):', {
      ...requestBody,
      card: { ...requestBody.card, number: '****', cvv: '***' },
    });

    const response = await fetch(`${ARC_CONFIG.apiUrl}/payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('📥 Payment response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(responseData.message || 'Payment processing failed');
    }

    // Check payment status
    if (responseData.status === 'APPROVED' || responseData.status === 'SUCCESS') {
      return {
        success: true,
        transactionId: responseData.transactionId,
        status: responseData.status,
        authorizationCode: responseData.authorizationCode,
        amount: responseData.amount,
        currency: responseData.currency,
        message: responseData.message || 'Payment successful',
        data: responseData,
      };
    } else {
      return {
        success: false,
        status: responseData.status,
        error: responseData.message || 'Payment declined',
        data: responseData,
      };
    }
  } catch (error) {
    console.error('❌ ARC Pay payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
};

/**
 * Check payment status
 * @param {string} transactionId - Transaction ID to check
 * @returns {Promise<Object>} Payment status
 */
const checkPaymentStatus = async (transactionId) => {
  try {
    console.log('🔍 Checking payment status for transaction:', transactionId);

    const response = await fetch(
      `${ARC_CONFIG.apiUrl}/payment/status/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to check payment status');
    }

    return {
      success: true,
      status: responseData.status,
      transactionId: responseData.transactionId,
      data: responseData,
    };
  } catch (error) {
    console.error('❌ Payment status check error:', error);
    return {
      success: false,
      error: error.message || 'Failed to check payment status',
    };
  }
};

/**
 * Refund a payment
 * @param {Object} refundData - Refund details
 * @returns {Promise<Object>} Refund result
 */
const refundPayment = async (refundData) => {
  try {
    console.log('💰 Processing refund...');

    const { transactionId, amount, reason } = refundData;

    const requestBody = {
      merchantId: ARC_CONFIG.merchantId,
      transactionId,
      amount: amount ? amount.toFixed(2) : undefined,
      reason: reason || 'Customer request',
    };

    const response = await fetch(`${ARC_CONFIG.apiUrl}/payment/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Refund failed');
    }

    return {
      success: true,
      refundId: responseData.refundId,
      amount: responseData.amount,
      status: responseData.status,
      message: responseData.message || 'Refund processed successfully',
      data: responseData,
    };
  } catch (error) {
    console.error('❌ Refund error:', error);
    return {
      success: false,
      error: error.message || 'Refund processing failed',
    };
  }
};

/**
 * Format card expiry date
 * @param {string} expiryDate - Expiry date in MM/YY format
 * @returns {Object} Month and year
 */
const parseExpiryDate = (expiryDate) => {
  const parts = expiryDate.split('/');
  if (parts.length !== 2) {
    throw new Error('Invalid expiry date format. Use MM/YY');
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt('20' + parts[1], 10);

  if (month < 1 || month > 12) {
    throw new Error('Invalid month in expiry date');
  }

  return { month, year };
};

/**
 * Validate card number using Luhn algorithm
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} Is valid
 */
const validateCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '');

  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Mock payment processing for testing (when real API is not available)
 * @param {Object} paymentData - Payment and card details
 * @returns {Promise<Object>} Mock payment result
 */
const processMockPayment = async (paymentData) => {
  console.log('🧪 Processing MOCK payment for testing...');
  
  const { amount, cardNumber, orderReference } = paymentData;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check for test decline card
  if (cardNumber.replace(/\s/g, '') === '4000000000000002') {
    return {
      success: false,
      status: 'DECLINED',
      error: 'Payment declined - insufficient funds',
      transactionId: 'MOCK_DECLINED_' + Date.now(),
    };
  }
  
  // Successful payment for all other test cards
  return {
    success: true,
    transactionId: 'MOCK_TXN_' + Date.now(),
    status: 'APPROVED',
    authorizationCode: 'MOCK_AUTH_' + Math.random().toString(36).substr(2, 9),
    amount: amount.toFixed(2),
    currency: 'USD',
    message: 'Mock payment successful - TEST MODE',
    data: {
      orderReference,
      timestamp: new Date().toISOString(),
      testMode: true
    }
  };
};

const arcPayService = {
  createPaymentSession,
  processPayment: processMockPayment, // Use mock for testing
  checkPaymentStatus,
  refundPayment,
  parseExpiryDate,
  validateCardNumber,
};

export default arcPayService;
