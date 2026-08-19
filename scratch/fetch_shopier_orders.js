require('dotenv').config();

async function fetchOrders() {
  try {
    const response = await fetch('https://api.shopier.com/v1/orders?limit=5', {
      headers: {
        'Authorization': `Bearer ${process.env.SHOPIER_PAT}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching from Shopier:', err.message);
  }
}

fetchOrders();
