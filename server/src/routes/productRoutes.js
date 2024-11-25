const express = require('express');
const router = express.Router();
const { fetchProducts } = require('../services/productService');

router.get('/products', async (req, res) => {
  const { query } = req.query;
  
  console.log('Received product search request:', { query });
  
  if (!query) {
    return res.status(400).json({
      error: 'Missing query parameter'
    });
  }

  try {
    console.log('Attempting to fetch products for query:', query);
    const products = await fetchProducts(query);
    console.log(`Successfully fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Product fetch error:', {
      error: error.message,
      stack: error.stack
    });
    
    // Check for specific error types
    if (error.isAxiosError) {
      return res.status(502).json({
        error: 'External API Error',
        message: 'Failed to fetch from external service',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;