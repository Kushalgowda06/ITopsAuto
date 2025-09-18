import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CpuChipIcon, 
  ChartBarIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  SpeakerWaveIcon,
  RocketLaunchIcon,
  CloudIcon,
  CommandLineIcon,
  ChatBubbleBottomCenterTextIcon,
  PlayIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  FilmIcon,
  RocketLaunchIcon as RocketIcon,
  BoltIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const containerRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Enhanced motion background
  const MotionBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-900/30 via-royal-800/20 to-royal-700/30"></div>
        
        {/* Dynamic flowing lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#4f46e5', stopOpacity: 0.8}} />
              <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
            </linearGradient>
          </defs>
          
          {/* Flowing network lines */}
          {[...Array(15)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${Math.random() * 1200},${Math.random() * 800} Q${Math.random() * 1200},${Math.random() * 800} ${Math.random() * 1200},${Math.random() * 800}`}
              stroke="url(#flowGradient)"
              strokeWidth="2"
              fill="none"
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
        
        {/* Floating data nodes */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Large floating orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-royal-500/10 to-neon-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-neon-purple/10 to-royal-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        

      </div>
    );
  };



  const benefits = [
    {
      title: "Intelligent Automation",
      description: "Reduce manual tasks by 80% with AI-powered automation",
      icon: SparklesIcon
    },
    {
      title: "Cost Optimization",
      description: "Cut operational costs by up to 40% through smart resource management",
      icon: CurrencyDollarIcon
    },
    {
      title: "Intelligent Insights",
      description: "Real-time analytics and predictive insights for better decisions",
      icon: LightBulbIcon
    },
    {
      title: "Voice Interaction",
      description: "Natural language processing for seamless voice-based operations",
      icon: SpeakerWaveIcon
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 text-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-light-900 via-light-800 to-light-900"
        style={{ y, opacity }}
      >
        <MotionBackground />
        
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-0 right-0 z-50 p-6"
        >
          <div className="max-w-full mx-auto flex justify-between items-center px-6">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src="/cognizant-logo.png" 
                  alt="Cognizant Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold gradient-text tracking-wide leading-tight whitespace-nowrap">
                  COGNIZANT AUTONOMOUS IT OPERATIONS TOOLKIT
                </h1>
              </div>
            </div>
            
            {/* Right side - Login */}
            <div className="flex-shrink-0">
              <Link
                to="/login"
                className="px-6 py-3 lg:px-8 bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-500 hover:to-royal-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Command Terminal Demonstration */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-16 flex justify-center"
          >
            {/* <div className="glass-card p-8 font-mono text-left max-w-3xl w-full border border-neon-blue/30 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-gray-300 text-sm font-semibold">Cognizant Autonomous IT Operations Toolkit Terminal</div>
                <div className="ml-auto text-xs text-gray-400">production-ready</div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 text-sm"
              >
                <div className="text-gray-400">$ enterprise-ai --capabilities</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="pl-4 space-y-2"
                >
                                     <div className="text-neon-blue">→ Generate Terraform templates with AI in seconds</div>
                  <div className="text-neon-green">→ Monitor 1000+ metrics with AI insights</div>
                  <div className="text-neon-purple">→ Automate CI/CD pipelines intelligently</div>
                  <div className="text-neon-pink">→ Scale workloads based on predictions</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="pt-4 border-t border-gray-600"
                >
                  <div className="text-white mb-2">$ enterprise-ai deploy --stack=production --auto-scale</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, staggerChildren: 0.3 }}
                    className="space-y-1"
                  >
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-green-400"
                                         >
                       ✓ Terraform templates generated (8s)
                     </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-yellow-400"
                    >
                      ✓ CI/CD pipeline configured (8s)
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-blue-400"
                    >
                      ✓ AI monitoring activated (3s)
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-purple-400"
                    >
                      ✓ Auto-scaling agents deployed (5s)
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 5 }}
                    className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg"
                  >
                    <div className="text-neon-green font-bold text-lg flex items-center">
                      🚀 Production environment ready in 28 seconds!
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      85% faster than traditional deployment methods
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div> */}
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl pt-10 lg:text-8xl font-black mb-8 leading-tight">
              <motion.span 
                className="block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 2 }}
              >
                <motion.span 
                  className="gradient-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent font-black tracking-tight inline-block"
                >
                  Redefining IT Operations
                </motion.span>
                <span className="text-white font-bold ml-4">with AI</span>
              </motion.span>
            </h1>
            
            <p className="text-2xl md:text-4xl text-gray-200 max-w-5xl mx-auto leading-relaxed mb-8 font-medium">
              From <span className="text-neon-blue font-bold">zero to production</span> in under 30 seconds
            </p>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Deploy infrastructure, configure monitoring, and activate AI-powered automation with a single command
            </p>
          </motion.div>

          {/* Stats showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-neon-blue mb-3">85%</div>
              <div className="text-gray-300 text-lg">Reduced Complexity</div>
            </div>
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-neon-green mb-3">3x</div>
              <div className="text-gray-300 text-lg">Faster Delivery</div>
            </div>
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-neon-purple mb-3">24/7</div>
              <div className="text-gray-300 text-lg">AI Monitoring</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/login"
              className="group relative px-12 py-6 bg-gradient-to-r from-royal-600 to-royal-700 rounded-full font-bold text-2xl hover:from-royal-500 hover:to-royal-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10 text-white flex items-center">
                <PlayIcon className="w-6 h-6 mr-3" />
                Start Free Trial
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button 
              onClick={() => setShowVideoModal(true)}
              className="px-12 py-6 glass-button rounded-full font-bold text-2xl text-white hover:bg-white/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/40"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>




      </motion.section>



      {/* Benefits Section */}
      <section className="py-20 px-6 particle-bg">
        <div className="max-w-full mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 overflow-visible"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-6 px-6 leading-relaxed break-words text-center">
              <span className="gradient-text font-bold block mb-2 sm:mb-1">Why Choose</span>
              <span className="block">Cognizant Autonomous IT Operations Toolkit?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of next-generation AI operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-royal-500 to-royal-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all duration-300">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-medium mb-3 text-white">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 px-2 bg-gradient-to-br from-dark-900/50 to-royal-900/30">
        <div className="w-full mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 overflow-visible"
          >
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-6 px-4 leading-tight text-center break-words">
              What Our <span className="gradient-text font-black text-lg sm:text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from enterprises that have transformed their IT operations with our AI-powered toolkit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Tony Stark",
                title: "Ironman",
                company: "Marvel Studios",
                rating: 4,
                review: "This AI toolkit is absolutely revolutionary! The automation capabilities have transformed our entire tech infrastructure. FRIDAY would be proud of how efficiently this handles our DevOps workflows. Arc reactor levels of power in software form.",
                avatar: "🦾",
                date: "2 weeks ago"
              },
              {
                name: "John Cena",
                title: "Wrestler",
                company: "WWE Performance Center",
                rating: 5,
                review: "You can't see the complexity anymore because this platform makes everything so simple! The monitoring and analytics have given our team unprecedented visibility into performance metrics. Hustle, Loyalty, and Respect - this platform has all three.",
                avatar: "💪",
                date: "1 month ago"
              },
              {
                name: "Tom Cruise",
                title: "Actor",
                company: "Impossible Mission Force",
                rating: 3,
                review: "When accepting impossible missions, you need impossible technology. This AI toolkit has made our most complex operations feel routine. The security features are mission-critical, and the deployment speed is phenomenal.",
                avatar: "🎬",
                date: "3 weeks ago"
              },
              {
                name: "Elon Musk",
                title: "Chief Technology Officer, SpaceX & Tesla",
                company: "SpaceX & Tesla",
                rating: 5,
                review: "The terraform automation is almost as impressive as landing a rocket. We're using this for both our Mars mission planning and Tesla's autonomous systems. The AI integration reminds me of the early days of neural networks - pure innovation.",
                avatar: "🚀",
                date: "2 months ago"
              },
              {
                name: "Oprah Winfrey",
                title: "Media Executive, Harpo Productions",
                company: "Harpo Productions",
                rating: 5,
                review: "You get efficiency! You get automation! You get AI-powered insights! Everybody gets transformed operations! This platform has revolutionized how we manage our media infrastructure and content delivery systems.",
                avatar: "🎤",
                date: "1 month ago"
              },
              {
                name: "Dwayne Johnson",
                title: "Chief Executive, Seven Bucks Productions",
                company: "Seven Bucks Productions",
                rating: 4,
                review: "Can you smell what the AI is cooking? Because it's cooking up some serious infrastructure magic! The rock-solid reliability and the people's champion level of support make this our go-to platform for all operations.",
                avatar: "🗿",
                date: "3 weeks ago"
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-royal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">{review.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{review.name}</h4>
                    <p className="text-gray-400 text-sm">{review.title}</p>
                    <p className="text-neon-blue text-xs">{review.company}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                  <span className="text-gray-400 text-sm ml-2">{review.date}</span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{review.review}"
                </p>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Verified Customer</span>
                    <span className="text-neon-green">✓ Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-neon-blue mb-1">98%</div>
                  <div className="text-gray-400 text-sm">Customer Satisfaction</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold text-neon-green mb-1">500+</div>
                  <div className="text-gray-400 text-sm">Enterprise Clients</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">70%</div>
                  <div className="text-gray-400 text-sm">Average Time Savings</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">AI Support Available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-4 sm:p-6 md:p-8"
          >
            <RocketLaunchIcon className="w-16 h-16 text-neon-blue mx-auto mb-6" />
            
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-6 px-4 leading-tight text-center break-words">
              Ready to <span className="gradient-text font-black text-lg sm:text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Transform</span> Your Operations?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of enterprises already leveraging AI for operational excellence
            </p>
            
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-gradient-to-r from-royal-600 to-royal-700 rounded-full font-semibold text-lg hover:from-royal-500 hover:to-royal-600 transition-all duration-300 transform hover:scale-105 neon-glow"
            >
              Start Your AI Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-full mx-auto text-center px-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6">
              <img 
                src="/cognizant-logo.png" 
                alt="Cognizant Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold break-words text-center">
              <span className="gradient-text font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">Cognizant Autonomous IT Operations Toolkit</span>
            </span>
          </div>
                      <p className="text-gray-400">© 2024 Cognizant Autonomous IT Operations Toolkit. All rights reserved.</p>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Video Player */}
            <div className="w-full h-full">
              {/* Replace this with your actual video URL */}
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                poster="/cognizant-logo.png" // Using logo as poster until you add a video thumbnail
              >
                {/* Replace with your actual video file path */}
                <source src="/demo-video.mp4" type="video/mp4" />
                <source src="/demo-video.webm" type="video/webm" />
                {/* Fallback for browsers that don't support video */}
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-royal-900 to-royal-700 text-white">
                  <div className="text-center">
                    <FilmIcon className="w-16 h-16 mx-auto mb-4 text-neon-blue" />
                    <h3 className="text-2xl font-bold mb-2">Demo Video</h3>
                    <p className="text-gray-300 mb-4">
                      Experience the power of Cognizant Autonomous IT Operations Toolkit
                    </p>
                    <p className="text-sm text-gray-400">
                      Video will be available soon. Please check back later.
                    </p>
                  </div>
                </div>
              </video>
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Cognizant Autonomous IT Operations Toolkit Demo
              </h3>
              <p className="text-gray-300 text-sm">
                See how our AI-powered platform transforms IT operations in under 30 seconds
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage; 