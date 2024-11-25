import React, { useState } from 'react';
import { SearchBar, ProductCard } from '../components';
import { searchProducts } from '../services/api';
import { Search, ChevronUp } from 'lucide-react';

export const Home = () => {
 const [query, setQuery] = useState('');
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [showScrollTop, setShowScrollTop] = useState(false);

 const handleSearch = async () => {
   if (!query.trim()) return;
   setLoading(true);
   setError(null);
   try {
     const data = await searchProducts(query);
     setProducts(data || []);
   } catch (error) {
     setError('Failed to fetch products');
     setProducts([]);
   } finally {
     setLoading(false);
   }
 };

 React.useEffect(() => {
   const handleScroll = () => {
     setShowScrollTop(window.scrollY > 300);
   };
   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToTop = () => {
   window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
   <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50">
     <nav className="w-full bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
       <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
         <div className="flex items-center justify-between max-w-7xl mx-auto">
           <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
             EcoPrice
           </h1>
           <div className="flex gap-4">
             <a href="#" className="text-green-600 hover:text-green-700">About</a>
             <a href="#" className="text-green-600 hover:text-green-700">Contact</a>
           </div>
         </div>
       </div>
     </nav>

     <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
       <div className="max-w-2xl mx-auto mb-12">
         <h2 className="text-xl sm:text-2xl text-center mb-6 text-gray-700">
           Compare eco-friendly products across platforms
         </h2>
         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
           <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
         </div>
       </div>

       {loading && (
         <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
         </div>
       )}

       {error && (
         <div className="max-w-md mx-auto bg-red-50 text-red-500 p-4 rounded-lg text-center mb-8">
           {error}
         </div>
       )}

       {!loading && !error && products.length === 0 && (
         <div className="text-center text-gray-500 py-12">
           <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
           <p className="text-lg">Search for eco-friendly products to compare prices</p>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
         {products.map(product => (
           <ProductCard key={product._id || product.id} product={product} />
         ))}
       </div>
     </main>

     {showScrollTop && (
       <button 
         onClick={scrollToTop}
         className="fixed bottom-8 right-8 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
       >
         <ChevronUp className="h-6 w-6" />
       </button>
     )}

     <footer className="bg-white mt-12 py-8 text-center text-gray-600">
       <div className="max-w-7xl mx-auto px-4">
         <p>&copy; {new Date().getFullYear()} EcoPrice. Save money, save planet.</p>
       </div>
     </footer>
   </div>
 );
};