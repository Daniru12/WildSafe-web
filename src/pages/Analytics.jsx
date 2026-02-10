import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, statusRes, trendRes] = await Promise.all([
                    api.get('/analytics/incidents-by-category'),
                    api.get('/analytics/incidents-by-status'),
                    api.get('/analytics/trends')
                ]);

                setCategoryData(catRes.data);
                setStatusData(statusRes.data);

                // Format trend data for chart
                const formattedTrends = trendRes.data.map(item => ({
                    name: `${item._id.month}/${item._id.year}`,
                    count: item.count
                }));
                setTrendData(formattedTrends);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-state">Loading insights...</div>;

    return (
        <div className="min-h-screen pb-16 print:bg-white print:text-black">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 mt-12 animate-fade-in">
                <div className="flex justify-between items-center mb-10 print:hidden">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Environmental Insights</h1>
                        <p className="text-text-muted">Analyze patterns and trends to improve forest protection strategies.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2" onClick={() => window.print()}>
                        <Download size={18} />
                        Export Report
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block">
                    <div className="p-8 glass-morphism print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <BarChart2 size={20} className="text-primary" />
                            Incidents by Category
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-8 glass-morphism print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <PieChartIcon size={20} className="text-primary" />
                            Status Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="status"
                                        animationDuration={1500}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-8 glass-morphism md:col-span-2 print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <TrendingUp size={20} className="text-primary" />
                            Incident Trends (Monthly)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                                        activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#f8fafc' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
