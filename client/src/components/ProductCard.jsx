import { Heart, Leaf, TrendingUp, ShoppingCart, ExternalLink } from "lucide-react";
import { useState } from "react";

export const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const placeholderImage = "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
  const priceDifference = product.amazonPrice - product.flipkartPrice;
  const savings = Math.abs(priceDifference);
  const savingsPercentage = ((savings / Math.max(product.amazonPrice, product.flipkartPrice)) * 100).toFixed(1);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-video">
        <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={imageError ? placeholderImage : (product.image || placeholderImage)}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain"
          />
        </a>
        <div className="absolute top-2 right-2">
          <button
            onClick={handleWishlistToggle}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`} 
            />
          </button>
        </div>
        {priceDifference !== 0 && (
          <div className="absolute bottom-2 left-2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Save {savingsPercentage}%
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4 line-clamp-2">{product.name}</h3>

        {/* Price Comparison */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/amazon-logo.png" alt="Amazon" className="h-5 w-5 object-contain" />
                <span className="text-sm text-gray-600">Amazon</span>
              </div>
              <span className="font-medium">₹{product.amazonPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/flipkart-logo.png" alt="Flipkart" className="h-5 w-5 object-contain" />
                <span className="text-sm text-gray-600">Flipkart</span>
              </div>
              <span className="font-medium">₹{product.flipkartPrice?.toLocaleString()}</span>
            </div>
            {priceDifference !== 0 && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">You Save</span>
                  <span className="font-medium text-green-600">
                    ₹{savings.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Scores */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-500" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${product.ecoScore * 10}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{product.ecoScore}/10</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${product.similarityScore}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{product.similarityScore}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Amazon Link */}
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Best Deal</span>
          </a>

          {/* Flipkart Link */}
          <a
            href={product.flipkartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Compare</span>
          </a>
        </div>
      </div>
    </div>
  );
};
