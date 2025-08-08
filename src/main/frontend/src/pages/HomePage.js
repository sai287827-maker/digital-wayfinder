import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* <Hero /> */}
      <div className="features-section">
        <div className="hero">
      <div className="hero-content">
        <h1>Digital Wayfinder</h1>
        <p style={{ marginBottom: '60px' }}>
          Welcome to Digital Wayfinder, your comprehensive solution to navigate the complex world of Platform
          solutions. Our platform helps you identify gaps in your current platform solution and compare different
          tools to find the best fit for your business needs.
        </p>

        {/* <HomePage/> */}
        <div className="features-container">
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 26H4V6" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26 8L16 18L12 14L4 22" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            title="Digital Wayfinder"
            description="The Digital Wayfinder is a strategic discovery tool that identifies opportunities, reveals capability gaps, and aligns assets to accelerate value."
            buttonText="Start Analysis"
            onClick={() => navigate('/digital-wayfinder')}
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 22C18.4183 22 22 18.4183 22 14C22 9.58172 18.4183 6 14 6C9.58172 6 6 9.58172 6 14C6 18.4183 9.58172 22 14 22Z" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26 26L20 20" stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            title="Decision Tree"
            description="Compare Platforms - To evaluate their capabilities and determine which best aligns with the organization's needs and objectives."
            buttonText="Start Comparison"
            onClick={() => navigate('/decision-tree')}
          />
        </div>
      </div>
    </div>

        
      </div>
    </div>
  );
}

export default HomePage;


// import React from 'react';
// import bgImage from '../assets/Row8-Stocksy_txpaa54b8f6L2q300_OriginalDelivery_4364319.jpg';

// export default function DigitalWayfinder() {
//   return (
//     <div className="min-h-screen relative" style={{
//       backgroundImage: `url(${bgImage})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat'
//     }}>
//       {/* Background overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-purple-600 to-pink-500 opacity-60"></div>
//       <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
//       {/* Navigation */}
//       <nav className="relative z-10 flex items-center justify-between px-8 py-4 bg-white bg-opacity-10 backdrop-blur-sm">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-purple-600 transform rotate-45 rounded-sm"></div>
//           <span className="text-white font-semibold text-lg">Digital Wayfinder</span>
//         </div>
        
//         <div className="flex items-center space-x-8">
//           <a href="#" className="text-white hover:text-purple-200 transition-colors border-b-2 border-purple-400 pb-1">Home</a>
//           <a href="#" className="text-white hover:text-purple-200 transition-colors">Digital Wayfinder</a>
//           <a href="#" className="text-white hover:text-purple-200 transition-colors">Decision Tree</a>
//           <a href="#" className="text-white hover:text-purple-200 transition-colors">Report</a>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <div className="w-5 h-5 text-white hover:text-purple-200 cursor-pointer transition-colors">🔔</div>
//           <div className="w-5 h-5 text-white hover:text-purple-200 cursor-pointer transition-colors">❓</div>
//           <div className="w-5 h-5 text-white hover:text-purple-200 cursor-pointer transition-colors">👤</div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-8">
//         {/* Hero Section */}
//         <div className="text-center mb-16 max-w-4xl">
//           <h1 className="text-6xl font-bold text-white mb-8 tracking-tight">
//             Digital Wayfinder
//           </h1>
//           <p className="text-white text-lg leading-relaxed opacity-90 max-w-3xl mx-auto">
//             Welcome to Digital Wayfinder, your comprehensive solution to navigate the complex world of Platform 
//             solutions. Our platform helps you identify gaps in your current platform solution and compare different 
//             tools to find the best fit for your business needs.
//           </p>
//         </div>

//         {/* Feature Cards */}
//         <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
//           {/* Digital Wayfinder Card */}
//           <div className="bg-white rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:-translate-y-1">
//             <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
//               <div className="text-2xl text-white">📊</div>
//             </div>
            
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">
//               Digital Wayfinder
//             </h3>
            
//             <div className="w-16 h-1 bg-purple-600 mx-auto mb-6"></div>
            
//             <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-sm mx-auto">
//               The Digital Wayfinder is a strategic discovery tool that identifies 
//               opportunities, reveals capability gaps, and aligns assets to accelerate value.
//             </p>
            
//             <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-0.5 w-full max-w-xs">
//               Start Analysis
//             </button>
//           </div>

//           {/* Decision Tree Card */}
//           <div className="bg-white rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:-translate-y-1">
//             <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
//               <div className="text-2xl text-white">🔍</div>
//             </div>
            
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">
//               Decision Tree
//             </h3>
            
//             <div className="w-16 h-1 bg-purple-600 mx-auto mb-6"></div>
            
//             <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-sm mx-auto">
//               Compare Platforms - To evaluate their capabilities and determine which 
//               best aligns with the organization's needs and objectives.
//             </p>
            
//             <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-0.5 w-full max-w-xs">
//               Start Comparison
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Background Elements for Mountain Effect */}
//       <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent opacity-60"></div>
//       <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent opacity-40"></div>
//     </div>
//   );
// }