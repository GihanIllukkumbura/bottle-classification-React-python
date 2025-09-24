import { FaRecycle, FaDollarSign, FaLeaf, FaCamera, FaChartLine, FaMobile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-lg bg-gray-800/40 sticky top-0 z-50 border-b border-green-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <FaRecycle className="text-white text-lg" />
          </div>
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            EcoReward
          </div>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a
            href="#features"
            className="text-gray-300 hover:text-green-400 transition duration-300 font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 hover:text-green-400 transition duration-300 font-medium"
          >
            How It Works
          </a>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </nav>
        {/* Mobile menu button */}
        <button 
          onClick={() => navigate("/login")}
          className="md:hidden bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative flex flex-col justify-center items-center text-center pt-20 pb-32 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Smart Waste Detection System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text mb-8 leading-tight">
            Turn Bottles Into
            <br />
            <span className="text-green-400">Rewards</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-12 leading-relaxed">
            Revolutionary AI-powered bottle detection system that rewards you for recycling. 
            Simply point your camera at bottles and earn instant rewards while saving the planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaCamera className="text-lg" />
              Start Detecting Now
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-green-500/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaDollarSign className="text-lg" />
              View Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-gray-300">Bottles Detected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">Rs. 50K+</div>
              <div className="text-gray-300">Rewards Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered system makes recycling simple and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <FaCamera className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Detect</h3>
              <p className="text-gray-300">Point your camera at bottles and our AI instantly identifies plastic, glass, or metal</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <FaRecycle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Sort</h3>
              <p className="text-gray-300">Dispose the bottle in the correct recycling bin based on our smart recommendations</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <FaDollarSign className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Earn</h3>
              <p className="text-gray-300">Receive instant rewards and track your environmental impact on your dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose EcoReward?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced features that make recycling effortless and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              Icon={FaCamera}
              title="AI Detection"
              description="Advanced computer vision technology for accurate bottle identification and classification."
              gradient="from-green-400 to-green-600"
            />
            <FeatureCard
              Icon={FaDollarSign}
              title="Instant Rewards"
              description="Earn money immediately for every bottle you recycle through our smart reward system."
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard
              Icon={FaChartLine}
              title="Impact Tracking"
              description="Monitor your environmental contribution and see how you're making a difference."
              gradient="from-blue-400 to-blue-600"
            />
            <FeatureCard
              Icon={FaMobile}
              title="Mobile First"
              description="Optimized for smartphones with an intuitive interface for seamless user experience."
              gradient="from-purple-400 to-purple-600"
            />
            <FeatureCard
              Icon={FaLeaf}
              title="Eco-Friendly"
              description="Contribute to a sustainable future by reducing waste and promoting proper recycling."
              gradient="from-green-400 to-cyan-500"
            />
            <FeatureCard
              Icon={FaRecycle}
              title="Smart Sorting"
              description="Get intelligent recommendations for proper waste disposal and recycling methods."
              gradient="from-cyan-400 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already making money while saving the planet
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Join EcoReward Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FaRecycle className="text-white text-sm" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  EcoReward
                </div>
              </div>
              <p className="text-gray-400">
                Making recycling rewarding and environmental protection profitable for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#features" className="text-gray-400 hover:text-green-400 transition duration-300 block">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-green-400 transition duration-300 block">How It Works</a>
                <button onClick={() => navigate("/login")} className="text-gray-400 hover:text-green-400 transition duration-300 block text-left">Dashboard</button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Get Started</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Create Account
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700/50 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} EcoReward System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ Icon, title, description, gradient }) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 group">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default Home;
