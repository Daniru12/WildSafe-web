import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Globe, Shield, Zap, TrendingUp, Users, ArrowRight, 
  Layers, Lock, Landmark, ChevronRight, ChevronLeft,
  Leaf, Droplets, TreePine, Heart, Award, Sparkles,
  Play, CheckCircle, Star, MapPin, Camera
} from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Wildlife slideshow images with captions
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "African Elephant",
      location: "Savanna Ecosystem",
      description: "Protecting the giants of the wild"
    },
    {
      url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Bengal Tiger",
      location: "Sunderbans Reserve",
      description: "Securing habitats for endangered species"
    },
    {
      url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80",
      title: "Mountain Gorilla",
      location: "Virunga Mountains",
      description: "Preserving biodiversity hotspots"
    },
    {
      url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Great Barrier Reef",
      location: "Marine Protected Area",
      description: "Tokenizing ocean conservation"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Hero Section with Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {/* Slideshow Background */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80 z-10" />
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover transform scale-105 animate-ken-burns"
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-left animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-primary/30">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-white">
                    The Future of Conservation
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                  Tokenizing the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                    Wild Frontier
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                  Secure the future of our planet with the WildAsset Protocol. 
                  Fractional ownership of wildlife assets, powered by blockchain 
                  transparency and RWA tokenization.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                  </Link>
                  
                  <Link
                    to="/about"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <Play size={16} /> Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-primary" />
                    <span className="text-sm text-gray-300">SEC Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-secondary" />
                    <span className="text-sm text-gray-300">Audited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-accent" />
                    <span className="text-sm text-gray-300">15k+ Holders</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Live Stats Card */}
              <div className="hidden lg:block animate-fade-in">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold">Live Conservation Stats</h3>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-300">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Total Value Locked</span>
                        <span className="text-white font-bold">$24.5M</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 w-3/4 animate-pulse" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Acres Protected</span>
                        <span className="text-white font-bold">120,450</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-secondary rounded-full h-2 w-2/3 animate-pulse" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Active Investors</span>
                        <span className="text-white font-bold">15,892</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-accent rounded-full h-2 w-4/5 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-white">42</div>
                        <div className="text-xs text-gray-400">Active Protocols</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-gray-400">Countries</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Controls */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        
      </section>

      {/* Features Section with Animation */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-sm rounded-full">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bridging Conservation with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Web3 Innovation
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join the revolution in wildlife conservation through blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers size={32} />,
                title: "Fractional Ownership",
                desc: "Invest in large-scale wildlife reserves through fractional tokens starting from just $10",
                color: "primary",
                stats: "Min. Investment $10"
              },
              {
                icon: <Lock size={32} />,
                title: "Blockchain Transparency",
                desc: "Every transaction and conservation milestone recorded on-chain for 100% accountability",
                color: "secondary",
                stats: "100% On-chain"
              },
              {
                icon: <Landmark size={32} />,
                title: "RWA Tokenization",
                desc: "Turn real-world ecological assets into liquid digital tokens for global biodiversity",
                color: "accent",
                stats: "$24M+ Tokenized"
              },
              {
                icon: <Shield size={32} />,
                title: "Secure & Compliant",
                desc: "Fully regulated and audited smart contracts ensuring investor protection",
                color: "primary",
                stats: "SEC Compliant"
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Growing Returns",
                desc: "Earn yields from conservation credits and ecosystem appreciation",
                color: "secondary",
                stats: "APY up to 12%"
              },
              {
                icon: <Users size={32} />,
                title: "Community Governed",
                desc: "Vote on conservation projects and protocol upgrades through DAO",
                color: "accent",
                stats: "15k+ Voters"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-${feature.color}/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className={`relative z-10 mb-6 p-4 bg-${feature.color}/10 rounded-2xl inline-block group-hover:scale-110 transition-transform`}>
                  <div className={`text-${feature.color}`}>{feature.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{feature.desc}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold text-${feature.color} bg-${feature.color}/10 px-3 py-1 rounded-full`}>
                    {feature.stats}
                  </span>
                  <ArrowRight size={16} className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Counters */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "24.5M", label: "Total Value Locked", icon: <Landmark size={24} />, color: "primary" },
              { value: "15.8K", label: "Global Holders", icon: <Users size={24} />, color: "secondary" },
              { value: "120K", label: "Acres Protected", icon: <TreePine size={24} />, color: "accent" },
              { value: "42", label: "Active Protocols", icon: <Layers size={24} />, color: "primary" }
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-primary/30 transition-all text-center animate-float"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className={`mb-4 flex justify-center`}>
                  <div className={`p-3 bg-${stat.color}/10 rounded-xl group-hover:scale-110 transition-transform`}>
                    <div className={`text-${stat.color}`}>{stat.icon}</div>
                  </div>
                </div>
                <div className={`text-3xl md:text-4xl font-extrabold text-${stat.color} mb-2`}>
                  ${stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            className="w-full h-full object-cover opacity-10"
            alt="Wildlife background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-primary/30">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-white">
              Join the Movement
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Make an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Impact?
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the first multi-chain protocol dedicated to real-world asset tokenization 
            for wildlife preservation. Be part of the solution.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/register"
              className="group relative px-12 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Waitlist <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              to="/projects"
              className="px-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              View Projects
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <Shield size={16} />
                <span className="text-sm">Audited</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite alternate;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;