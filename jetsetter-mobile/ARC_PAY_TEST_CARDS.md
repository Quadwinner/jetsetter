# 💳 ARC Pay Test Card Numbers

## 🔑 Test Environment Configuration
Your ARC Pay test environment is already configured in `.env`:
```
ARC_PAY_MERCHANT_ID=TESTARC05511704
ARC_PAY_API_URL=https://api.arcpay.travel/api/rest/version/100/merchant/TESTARC05511704
ARC_PAY_API_USERNAME=Administrator
ARC_PAY_API_PASSWORD=Jetsetters@2025
```

## 💳 Test Card Numbers

### Visa Test Cards
```
Card Number: 4012 0000 9876 5439
Expiry Date: 12/25
CVV: 999
Cardholder Name: Test User
```

### Mastercard Test Cards
```
Card Number: 5146 3150 0000 0055
Expiry Date: 12/25
CVV: 999
Cardholder Name: Test User
```

### American Express Test Cards
```
Card Number: 3714 4963 5392 376
Expiry Date: 12/25
CVV: 9997
Cardholder Name: Test User
```

### Discover Test Cards
```
Card Number: 6011 0009 9302 6909
Expiry Date: 12/25
CVV: 999
Cardholder Name: Test User
```

## 🧪 Test Scenarios

### Successful Payment
Use any of the above test cards with:
- **Amount**: Any amount (e.g., $100.00)
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: 999 (or 9997 for Amex)

### Declined Payment
For testing declined payments, use:
```
Card Number: 4000 0000 0000 0002
Expiry Date: 12/25
CVV: 999
```

### Insufficient Funds
For testing insufficient funds:
```
Card Number: 4000 0000 0000 9995
Expiry Date: 12/25
CVV: 999
```

## 🔧 Implementation

### Payment Form Fields
```javascript
const paymentData = {
  amount: 100.00,
  currency: 'USD',
  orderReference: 'CRUISE-' + Date.now(),
  customerEmail: 'test@example.com',
  customerPhone: '+1234567890',
  customerName: 'Test User',
  cardNumber: '4012 0000 9876 5439',
  cardHolder: 'Test User',
  expiryMonth: 12,
  expiryYear: 2025,
  cvv: '999',
  description: 'Cruise booking payment'
};
```

### Example Usage
```javascript
import arcPayService from '../services/arcPayService';

const processTestPayment = async () => {
  const result = await arcPayService.processPayment({
    amount: 100.00,
    currency: 'USD',
    orderReference: 'TEST-' + Date.now(),
    customerEmail: 'test@example.com',
    customerPhone: '+1234567890',
    customerName: 'Test User',
    cardNumber: '4012 0000 9876 5439',
    cardHolder: 'Test User',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '999',
    description: 'Test cruise payment'
  });

  if (result.success) {
    console.log('✅ Payment successful:', result.transactionId);
  } else {
    console.log('❌ Payment failed:', result.error);
  }
};
```

## 📱 Payment Screen Integration

### Quick Test Button
Add a test button to your payment screens:
```javascript
<TouchableOpacity
  style={styles.testButton}
  onPress={() => {
    // Auto-fill test card details
    setCardNumber('4012 0000 9876 5439');
    setExpiryDate('12/25');
    setCvv('999');
    setCardHolder('Test User');
  }}
>
  <Text style={styles.testButtonText}>🧪 Fill Test Card</Text>
</TouchableOpacity>
```

## ⚠️ Important Notes

1. **Test Environment Only**: These cards only work in test/sandbox mode
2. **No Real Charges**: These cards will not charge real money
3. **Expiry Dates**: Use future dates (e.g., 12/25, 01/26)
4. **CVV Values**: 
   - Visa, Mastercard, Discover: Use `999`
   - American Express: Use `9997`
5. **Cardholder Name**: Can be any name for testing

## 🚀 Testing Steps

1. **Open Payment Screen**
2. **Click "Fill Test Card" button** (if available)
3. **Or manually enter**:
   - Card: `4012 0000 9876 5439`
   - Expiry: `12/25`
   - CVV: `999`
   - Name: `Test User`
4. **Submit Payment**
5. **Check Console** for payment response logs

## 📊 Expected Results

### Successful Payment Response
```json
{
  "success": true,
  "transactionId": "TXN123456789",
  "status": "APPROVED",
  "authorizationCode": "AUTH123",
  "amount": "100.00",
  "currency": "USD",
  "message": "Payment successful"
}
```

### Failed Payment Response
```json
{
  "success": false,
  "status": "DECLINED",
  "error": "Payment declined",
  "data": {
    "reason": "Insufficient funds"
  }
}
```

---

**Status**: ✅ Ready for Testing

Use these test card numbers to verify your ARC Pay integration works correctly in the test environment.



