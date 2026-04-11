import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Globe, Shield, Zap, TrendingUp, Users, ArrowRight, 
  Layers, Lock, Landmark, ChevronRight, ChevronLeft,
  Leaf, Droplets, TreePine, Heart, Award, Sparkles,
  Play, CheckCircle, Star, MapPin, Camera, Search,
  Phone, Mail, MessageSquare, Radar, Activity, Eye,
  Target, ShieldCheck, Clock, UserCheck
} from 'lucide-react';

// Using the generated images
const HERO_IMAGE = "/assets/hero_ranger.png";
const ABOUT_IMAGE = "/assets/about_center.png";
const SERVICE_IMAGE = "/assets/service_drone.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                <Shield size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Trusted Wildlife Professionals</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-text mb-8 leading-[1.1] tracking-tight">
                Protecting homes with <br />
                <span className="text-primary">expert wildlife safety</span>
              </h1>
              
              <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
                Our trained specialists use advanced, eco-friendly AI solutions to track and manage everything from forest elephants to local wildlife encounters.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-primary" size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text">Safe & Eco-Friendly</span>
                    <span className="text-[11px] text-text-muted">Wildlife Management</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="text-primary" size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text">Verified Rangers</span>
                    <span className="text-[11px] text-text-muted">On-Field Support</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 items-center">
                <Link to="/register" className="btn-primary group">
                  Get Started Flow
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center gap-3 text-text font-bold hover:text-primary transition-all group">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play size={18} fill="currentColor" />
                  </div>
                  Watch Video
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={HERO_IMAGE} 
                  alt="Professional Ranger" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 bg-white p-6 rounded-3xl shadow-xl border border-border animate-fade-in hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-text leading-none">4.9/5</h4>
                    <p className="text-xs text-text-muted">Over 4200 Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="text-lg font-black text-text-muted flex items-center gap-2">
                <Globe size={20} /> WILDLIFE TRUST
             </div>
             <div className="text-lg font-black text-text-muted flex items-center gap-2">
                <Shield size={20} /> ECO GUARD
             </div>
             <div className="text-lg font-black text-text-muted flex items-center gap-2">
                <TreePine size={20} /> NATURE ORG
             </div>
             <div className="text-lg font-black text-text-muted flex items-center gap-2">
                <Activity size={20} /> VITAL WILD
             </div>
             <div className="text-lg font-black text-text-muted flex items-center gap-2">
                <Users size={20} /> COMMUNITY FIRST
             </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 items-end">
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4]">
                  <img src={ABOUT_IMAGE} alt="Response Center" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-6">
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                    <img src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=500&q=80" alt="Elephant" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-primary p-8 rounded-3xl text-white">
                    <h3 className="text-4xl font-black mb-1">25+</h3>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Ranger Hubs active <br /> globally</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">About WildSafe</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-text mb-8 tracking-tight">
                Dedicated to protecting your <br />
                environment from wildlife
              </h2>
              <p className="text-text-muted mb-8 text-lg">
                Our mission is to provide comprehensive and reliable wild management solutions that ensure the safety and comfort of your community while respecting nature.
              </p>
              
              <ul className="space-y-4 mb-10 text-text-muted">
                {[
                  "Certified & Experienced Rangers",
                  "AI Driven Species Recognition",
                  "Transparent Pricing & No Hidden Costs"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle size={14} className="text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/about" className="btn-primary !rounded-full group">
                Learn More About Us
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-text tracking-tight mb-8">
              Reliable <span className="text-primary">Wildlife Protection</span> <br />
              solutions for your safety
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Radar size={32} />, 
                title: "Threat Monitoring", 
                desc: "Real-time AI surveillance for dangerous wildlife movements.",
                img: "https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=400&q=80"
              },
              { 
                icon: <Zap size={32} />, 
                title: "AI Insights", 
                desc: "Predictive analytics to prevent future conflicts and incidents.",
                img: SERVICE_IMAGE
              },
              { 
                icon: <Activity size={32} />, 
                title: "Ranger Missions", 
                desc: "Immediate on-field response for reported wildlife threats.",
                img: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=400&q=80"
              },
              { 
                icon: <MessageSquare size={32} />, 
                title: "Alert System", 
                desc: "Instant notifications for surrounding community members.",
                img: "https://images.unsplash.com/photo-1516233221993-81c24b9a8e2e?auto=format&fit=crop&w=400&q=80"
              }
            ].map((service, i) => (
              <div key={i} className="premium-card text-center group">
                <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-text mb-4 tracking-tight">{service.title}</h3>
                <p className="text-text-muted mb-8 text-sm leading-relaxed">{service.desc}</p>
                <Link to="/services" className="text-primary font-bold inline-flex items-center gap-2 group-hover:underline">
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section (Dark) */}
      <section className="py-24 bg-surface-dark text-white rounded-[60px] mx-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-8">
              Core features that set our <br />
              <span className="text-primary">wildlife services</span> apart
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Shield size={32} />, title: "Safety First", desc: "Our prioritized goal is to keep humans and wildlife safe." },
              { icon: <Target size={32} />, title: "Precise Tracking", desc: "Using high-precision GPS and satellite thermal imaging." },
              { icon: <Clock size={32} />, title: "24/7 Response", desc: "Always available rangers ready to deploy at any moment." },
              { icon: <UserCheck size={32} />, title: "Verified Hubs", desc: "Every mission is logged and verified on the blockchain." }
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-8 flex items-center justify-center text-primary border border-white/5">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Species ID Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Species Identification Center</h2>
            <p className="text-text-muted">Know your flora and fauna to stay safe</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Elephant", img: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=200&q=80" },
              { name: "Tiger", img: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=200&q=80" },
              { name: "Bear", img: "https://images.unsplash.com/photo-1516233221993-81c24b9a8e2e?auto=format&fit=crop&w=200&q=80" },
              { name: "Leopard", img: "https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=200&q=80" },
              { name: "Gorilla", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=200&q=80" },
              { name: "Rhino", img: "https://images.unsplash.com/photo-1547144918-05b1c5905f01?auto=format&fit=crop&w=200&q=80" }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-full aspect-square rounded-full overflow-hidden mb-4 border-2 border-border group-hover:border-primary transition-all">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold text-text-muted uppercase text-xs tracking-widest">{s.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-primary mx-6 mb-6 rounded-[60px] text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-10 leading-tight">
              Ready to protect your <br />
              community today?
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-full font-black hover:bg-gray-100 transition-all shadow-xl">
                 Get Started Now
              </Link>
              <Link to="/contact" className="bg-primary-dark text-white px-10 py-4 rounded-full font-black border border-white/20 hover:bg-opacity-90 transition-all shadow-xl">
                 Contact Experts
              </Link>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
