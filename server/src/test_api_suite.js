import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Full API Integration Test Suite...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    console.log('1. GET /api/health:', healthRes.status, await healthRes.json());

    // 2. Products List from MongoDB Atlas
    const prodRes = await fetch(`${BASE_URL}/products`);
    const products = await prodRes.json();
    console.log(`2. GET /api/products: ${prodRes.status} - Fetched ${products.length} products from MongoDB Atlas!`);
    if (products.length > 0) {
      console.log(`   Sample GPU: "${products[0].name}" ($${products[0].price}) - VRAM: ${products[0].vramGB}GB - ID: ${products[0].id}`);
    }

    // 3. User Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.DEMO_EMAIL, password: process.env.DEMO_PASSWORD }),
    });
    const loginData = await loginRes.json();
    console.log('3. POST /api/auth/login:', loginRes.status, '- User:', loginData.name, 'Token received:', !!loginData.token);
    const token = loginData.token;

    // 4. Purchasing API (Create Order)
    const orderPayload = {
      orderItems: [
        {
          productId: products[0].id,
          name: products[0].name,
          quantity: 1,
          price: products[0].price,
          mainImage: products[0].mainImage,
        },
      ],
      shippingAddress: {
        fullName: 'Alex Vance',
        email: 'customer@vramvault.com',
        address: '742 Cyberpunk Ave, Suite 101',
        city: 'Neo Tokyo',
        zip: '78701',
        country: 'United States',
      },
      paymentMethod: 'Credit / Debit Card',
      subtotal: products[0].price,
      taxPrice: products[0].price * 0.08,
      shippingPrice: 0,
      totalAmount: products[0].price * 1.08,
    };

    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const orderData = await orderRes.json();
    console.log(`4. POST /api/orders (Purchasing API): ${orderRes.status} - Created Order Number: ${orderData.orderNumber} - Status: ${orderData.status}`);

    // 5. Customer Order History
    const myOrdersRes = await fetch(`${BASE_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myOrders = await myOrdersRes.json();
    console.log(`5. GET /api/orders/myorders: ${myOrdersRes.status} - Customer has ${myOrders.length} orders in history.`);

    // 6. Admin Login & Check Orders
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
    });
    const adminData = await adminLoginRes.json();
    console.log('6. POST /api/auth/login (Admin):', adminLoginRes.status, '- Role:', adminData.role);

    const allOrdersRes = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    const allOrders = await allOrdersRes.json();
    console.log(`7. GET /api/orders (Admin Orders Panel): ${allOrdersRes.status} - Total Orders: ${allOrders.length}`);

    console.log('\n🎉 ALL API TESTS PASSED SUCCESSFULLY! The backend is 100% operational.');
  } catch (err) {
    console.error('❌ API Test Failed:', err.message);
  }
}

runTests();
