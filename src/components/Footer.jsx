import React from 'react';
import { Globe, Shield, Github, Twitter, Linkedin, Heart, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-surface-dark text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                                <Globe className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                Wild<span className="text-primary">Safe</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Dedicated to providing the world's most advanced wildlife safety solutions through AI monitoring and professional ranger services.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                                    <Icon size={18} className="text-gray-400 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
                            <li><Link to="/analytics" className="hover:text-primary transition-colors">Analytics Hub</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Our Services
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Threat Monitoring</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Species Recognition</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Ranger Dispatch</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Community Alerts</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Predictive Analytics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Contact Info
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-5 text-sm text-gray-400">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-primary" />
                                </div>
                                <span>123 Wildlife Ave, <br /> Conservation Park, CP 56789</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Phone size={18} className="text-primary" />
                                </div>
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-primary" />
                                </div>
                                <span>safety@wildsafe.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-gray-500">
                        © 2026 <span className="text-white font-bold">WildSafe</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

