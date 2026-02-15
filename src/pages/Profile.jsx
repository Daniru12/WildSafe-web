import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Wallet, BarChart3, Settings, TrendingUp, History } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - User Info */}
                    <div className="space-y-8">
                        <div className="p-8 glass-morphism text-center">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-4 border-surface shadow-2xl">
                                <User size={64} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                            <p className="text-text-muted text-sm mb-6">{user.role} Account</p>
                            <div className="flex justify-center gap-3">
                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase">Verified</span>
                                <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full uppercase">Lvl 4 Impact</span>
                            </div>
                        </div>

                        <div className="p-8 glass-morphism space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Shield size={18} className="text-primary" />
                                Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-text-muted" size={18} />
                                    <div>
                                        <div className="text-xs text-text-muted uppercase font-bold tracking-tighter">Email</div>
                                        <div className="text-white text-sm">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Wallet className="text-text-muted" size={18} />
                                    <div>
                                        <div className="text-xs text-text-muted uppercase font-bold tracking-tighter">Wallet Address</div>
                                        <div className="text-white text-sm font-mono">0x71C...492b</div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full btn-primary py-2 text-sm">Edit Profile</button>
                        </div>
                    </div>

                    {/* Right Column - Stats & Assets */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Total Asset Value", value: "$4,250.00", icon: <TrendingUp className="text-green-500" /> },
                                { label: "Tokenized Holdings", value: "12 Assets", icon: <BarChart3 className="text-blue-500" /> },
                                { label: "Impact Score", value: "850", icon: <Zap className="text-amber-500" /> }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 glass-morphism">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-surface rounded-lg">{stat.icon}</div>
                                        <span className="text-xs text-green-500 font-bold">+12%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-text-muted">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Holdings Table */}
                        <div className="glass-morphism overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Your WildAssets</h3>
                                <button className="text-sm text-primary font-bold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-surface/50 text-xs text-text-muted uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Asset Name</th>
                                            <th className="px-6 py-4">Fractional Share</th>
                                            <th className="px-6 py-4">Value</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { name: "Serengeti Corridor A", share: "2.5%", value: "$1,250", status: "Active" },
                                            { name: "Rhino Sanctuary Alpha", share: "0.8%", value: "$800", status: "Pledged" },
                                            { name: "Coastal Mangrove Beta", share: "5.0%", value: "$2,200", status: "Active" }
                                        ].map((asset, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-white font-medium">{asset.name}</td>
                                                <td className="px-6 py-4 text-text-muted">{asset.share}</td>
                                                <td className="px-6 py-4 text-white">{asset.value}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${asset.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                                        {asset.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-8 glass-morphism">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                <History size={20} className="text-primary" />
                                Recent Activity
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { action: "Dividend Distribution", detail: "Received $45.20 from Serengeti project", date: "2 days ago" },
                                    { action: "Governance Vote", detail: "Voted YES on Rhino Sanctuary expansion", date: "5 days ago" },
                                    { action: "Token Purchase", detail: "Acquired 500 $MANG tokens", date: "1 week ago" }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-start">
                                        <div>
                                            <div className="text-white font-medium mb-1">{item.action}</div>
                                            <div className="text-sm text-text-muted">{item.detail}</div>
                                        </div>
                                        <div className="text-xs text-text-muted font-bold whitespace-nowrap">{item.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
