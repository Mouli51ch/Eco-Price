const axios = require('axios');

const fetchProducts = async (query) => {
  try {
    console.log('Starting product fetch for query:', query);

    // Amazon API Configuration
    const amazonConfig = {
      method: 'GET',
      url: 'https://real-time-amazon-data.p.rapidapi.com/search',
      params: {
        query: query,
        country: 'IN',
        category_id: 'aps',
        page: '1'
      },
      headers: {
        'X-RapidAPI-Key': '71275edd4bmsh001fb99d46e7ffbp1c4e11jsnc21c2f09161b',
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      }
    };

    // Flipkart API Configuration
    const flipkartConfig = {
      method: 'GET',
      url: 'https://flipkart.dvishal485.workers.dev/search/',
      params: {
        query: query
      }
    };

    // Fetch data from both APIs with individual error handling
    let amazonResponse, flipkartResponse;
    
    try {
      [amazonResponse, flipkartResponse] = await Promise.all([
        axios.request(amazonConfig),
        axios.request(flipkartConfig)
      ]);
    } catch (apiError) {
      console.error('API request failed:', apiError.message);
      if (apiError.response) {
        console.error('API Response data:', apiError.response.data);
        console.error('API Response status:', apiError.response.status);
      }
      throw new Error(`API request failed: ${apiError.message}`);
    }

    // Validate responses
    if (!amazonResponse?.data?.data?.products) {
      console.error('Invalid Amazon response structure:', amazonResponse?.data);
      throw new Error('Invalid Amazon API response structure');
    }

    if (!flipkartResponse?.data?.result) {
      console.error('Invalid Flipkart response structure:', flipkartResponse?.data);
      throw new Error('Invalid Flipkart API response structure');
    }

    const amazonProducts = amazonResponse.data.data.products;
    const flipkartProducts = flipkartResponse.data.result;

    console.log(`Found ${amazonProducts.length} Amazon products and ${flipkartProducts.length} Flipkart products`);

    // Match and combine products with error handling
    const matchedProducts = amazonProducts
      .map(amazonProduct => {
        try {
          const flipkartProduct = findMatchingProduct(amazonProduct, flipkartProducts);
          
          if (!flipkartProduct) {
            return null;
          }

          return {
            id: amazonProduct.asin || `amazon-${Date.now()}`,
            name: amazonProduct.title,
            brand: amazonProduct.brand || extractBrand(amazonProduct.title),
            description: amazonProduct.description || '',
            amazonPrice: extractPrice(amazonProduct.price?.current_price),
            flipkartPrice: extractPrice(flipkartProduct.current_price),
            amazonUrl: amazonProduct.url,
            flipkartUrl: flipkartProduct.link,
            image: amazonProduct.thumbnail,
            ratings: {
              amazon: parseFloat(amazonProduct.rating) || 0,
              flipkart: parseFloat(flipkartProduct.rating) || 0
            },
            ecoScore: calculateEcoScore(amazonProduct, flipkartProduct),
            similarityScore: calculateSimilarity(amazonProduct.title, flipkartProduct.name),
            availability: {
              amazon: amazonProduct.availability_status === "In Stock",
              flipkart: flipkartProduct.stock_status === "In Stock"
            }
          };
        } catch (productError) {
          console.error('Error processing product:', productError);
          return null;
        }
      })
      .filter(Boolean);

    console.log(`Successfully matched ${matchedProducts.length} products`);
    return matchedProducts;

  } catch (error) {
    console.error('ProductService Error:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};
// Helper Functions
const findMatchingProduct = (amazonProduct, flipkartProducts) => {
  return flipkartProducts.find(flipkartProduct => {
    const similarity = calculateSimilarity(amazonProduct.title, flipkartProduct.name);
    return similarity > 70; // Match threshold
  });
};

const calculateSimilarity = (str1, str2) => {
  // Convert to lowercase and split into words
  const words1 = str1.toLowerCase().split(/\W+/);
  const words2 = str2.toLowerCase().split(/\W+/);

  // Find common words
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate similarity percentage
  return (commonWords.length * 2 * 100) / (words1.length + words2.length);
};

const extractPrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  
  // Remove currency symbols and convert to number
  const price = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(price) || 0;
};

const extractBrand = (title) => {
  // Extract first word as brand if no brand is provided
  return title.split(' ')[0];
};

const calculateEcoScore = (amazonProduct, flipkartProduct) => {
  let score = 7; // Base score
  
  // Keywords that might indicate eco-friendliness
  const ecoKeywords = [
    'eco',
    'sustainable',
    'organic',
    'natural',
    'recycled',
    'biodegradable',
    'green'
  ];

  // Check product title and description for eco-friendly keywords
  const productText = `${amazonProduct.title} ${amazonProduct.description || ''} ${flipkartProduct.name}`.toLowerCase();
  
  ecoKeywords.forEach(keyword => {
    if (productText.includes(keyword)) {
      score += 0.5;
    }
  });

  // Cap the score at 10
  return Math.min(10, Math.round(score));
};

// Price history endpoint (if available from APIs)
const getPriceHistory = async (productId) => {
  try {
    const historyConfig = {
      method: 'GET',
      url: `https://real-time-amazon-data.p.rapidapi.com/product-price-history/${productId}`,
      headers: {
        'X-RapidAPI-Key': '71275edd4bmsh001fb99d46e7ffbp1c4e11jsnc21c2f09161b',
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      }
    };

    const response = await axios.request(historyConfig);
    return response.data;
  } catch (error) {
    console.error('Price history error:', error);
    throw error;
  }
};

module.exports = {
  fetchProducts,
  getPriceHistory
};