import { FaRecycle, FaCamera, FaBrain, FaLeaf, FaUsers, FaChartLine, FaMobile, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">About EcoReward</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text mb-8 leading-tight">
            Revolutionizing
            <br />
            <span className="text-green-400">Recycling</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            EcoReward is an innovative AI-powered system that transforms the way people recycle bottles. 
            By combining advanced computer vision technology with instant rewards, we're making environmental 
            conservation both accessible and profitable.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                We believe that environmental protection should be rewarding, accessible, and powered by cutting-edge technology. 
                Our mission is to create a sustainable future where every recycling action contributes to both personal rewards 
                and planetary health.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <FaLeaf className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Environmental Impact</h3>
                    <p className="text-gray-400">Reducing waste and promoting proper recycling practices</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <FaUsers className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Community Building</h3>
                    <p className="text-gray-400">Creating a network of environmentally conscious individuals</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <FaBrain className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Innovation</h3>
                    <p className="text-gray-400">Leveraging AI technology for environmental solutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
                    <div className="text-gray-300 text-sm">Bottles Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">Rs. 50K+</div>
                    <div className="text-gray-300 text-sm">Rewards Given</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                    <div className="text-gray-300 text-sm">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">95%</div>
                    <div className="text-gray-300 text-sm">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powered by AI</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our advanced technology stack ensures accurate detection, seamless user experience, and reliable performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TechCard
              Icon={FaCamera}
              title="Computer Vision"
              description="Advanced PyTorch-based object detection using Faster R-CNN for precise bottle identification"
              gradient="from-green-400 to-green-600"
            />
            <TechCard
              Icon={FaBrain}
              title="Machine Learning"
              description="Pre-trained COCO dataset models with real-time inference for instant classification"
              gradient="from-blue-400 to-blue-600"
            />
            <TechCard
              Icon={FaMobile}
              title="Web Technology"
              description="React-based frontend with real-time updates and responsive design for all devices"
              gradient="from-purple-400 to-purple-600"
            />
            <TechCard
              Icon={FaShieldAlt}
              title="Secure Backend"
              description="Flask API with Firebase authentication and secure data storage for user rewards"
              gradient="from-cyan-400 to-cyan-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How EcoReward Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A simple three-step process that turns your recycling efforts into instant rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Camera Detection"
              description="Open the app and point your camera at any bottle. Our AI instantly identifies whether it's plastic, glass, or metal with 95% accuracy."
              Icon={FaCamera}
              color="green"
            />
            <ProcessStep
              step="02"
              title="Smart Classification"
              description="The system analyzes the bottle type and provides intelligent recommendations for proper disposal and recycling methods."
              Icon={FaRecycle}
              color="blue"
            />
            <ProcessStep
              step="03"
              title="Instant Rewards"
              description="Receive immediate monetary rewards in your account and track your environmental impact through our comprehensive dashboard."
              Icon={FaChartLine}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Team & Vision Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-600/20 to-purple-600/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Our Vision</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Global Impact</h4>
                      <p className="text-gray-300">Expanding our technology to cities worldwide, creating a global network of smart recycling systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Technology Evolution</h4>
                      <p className="text-gray-300">Continuously improving our AI models and expanding detection capabilities to more waste types.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Sustainable Future</h4>
                      <p className="text-gray-300">Building a world where environmental responsibility is rewarded and recycling becomes second nature.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Building Tomorrow</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                EcoReward represents the future of environmental technology - where artificial intelligence, 
                user incentives, and environmental responsibility converge to create meaningful change. 
                We're not just building an app; we're creating a movement.
              </p>
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Core Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">Innovation</div>
                    <div className="text-gray-400 text-sm">Cutting-edge AI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">Sustainability</div>
                    <div className="text-gray-400 text-sm">Planet first</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Accessibility</div>
                    <div className="text-gray-400 text-sm">For everyone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">Transparency</div>
                    <div className="text-gray-400 text-sm">Open & honest</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Be part of the movement that's changing how the world thinks about recycling and environmental responsibility
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                Start Detecting Now
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-green-500/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TechCard({ Icon, title, description, gradient }) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 group text-center">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({ step, title, description, Icon, color }) {
  const colorClasses = {
    green: "from-green-400 to-green-600 text-green-400",
    blue: "from-blue-400 to-blue-600 text-blue-400",
    purple: "from-purple-400 to-purple-600 text-purple-400"
  };

  return (
    <div className="text-center relative">
      {/* Step Number */}
      <div className={`text-6xl font-bold bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} bg-clip-text text-transparent mb-4`}>
        {step}
      </div>
      
      {/* Icon */}
      <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
        <Icon className="text-white text-2xl" />
      </div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default About;
