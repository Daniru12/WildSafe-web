import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useFixedNavOffsetClass } from '../hooks/useFixedNavOffsetClass';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, BarChart2, PieChart as PieChartIcon, TrendingUp, MapPin, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const COLORS = ['#5EB946', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
    const navPt = useFixedNavOffsetClass();
    const [trendData, setTrendData] = useState([]);
    const [threatStats, setThreatStats] = useState({});
    const [caseStats, setCaseStats] = useState({});
    const [locationData, setLocationData] = useState([]);
    const [responseTimeData, setResponseTimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30'); // days

    const fetchAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch threat report statistics
            const threatResponse = await api.get(`/threat-reports/stats/overview?days=${timeRange}`);
            setThreatStats({
                statusBreakdown: threatResponse.data.statusBreakdown || [],
                threatTypeBreakdown: threatResponse.data.threatTypeBreakdown || [],
                urgencyBreakdown: threatResponse.data.urgencyBreakdown || []
            });

            // Fetch case statistics
            const caseResponse = await api.get(`/cases/stats/overview?days=${timeRange}`);
            setCaseStats({
                statusBreakdown: caseResponse.data.statusBreakdown || [],
                priorityBreakdown: caseResponse.data.priorityBreakdown || [],
                threatTypeBreakdown: caseResponse.data.threatTypeBreakdown || [],
                resolutionTime: caseResponse.data.resolutionTime || null
            });

            const trendRes = await api.get('/analytics/trends');

            // Format trend data for chart
            const formattedTrends = trendRes.data.map(item => ({
                name: `${item._id.month}/${item._id.year}`,
                count: item.count
            }));
            setTrendData(formattedTrends);

            // Generate mock location data (would come from backend in real implementation)
            const mockLocationData = [
                { location: 'North Region', threats: 45, cases: 38 },
                { location: 'South Region', threats: 32, cases: 28 },
                { location: 'East Region', threats: 28, cases: 25 },
                { location: 'West Region', threats: 38, cases: 32 },
                { location: 'Central Region', threats: 52, cases: 45 }
            ];
            setLocationData(mockLocationData);

            // Generate mock response time data
            const mockResponseData = [
                { month: 'Jan', avgHours: 4.2, targetHours: 3.0 },
                { month: 'Feb', avgHours: 3.8, targetHours: 3.0 },
                { month: 'Mar', avgHours: 3.5, targetHours: 3.0 },
                { month: 'Apr', avgHours: 3.2, targetHours: 3.0 },
                { month: 'May', avgHours: 2.9, targetHours: 3.0 },
                { month: 'Jun', avgHours: 2.7, targetHours: 3.0 }
            ];
            setResponseTimeData(mockResponseData);

        } catch (err) {
            console.error('Failed to fetch analytics', err);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    const formatThreatType = (type) => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getTotalCount = (breakdown) => {
        return breakdown.reduce((sum, item) => sum + item.count, 0);
    };

    if (loading) return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className={`max-w-7xl mx-auto px-6 ${navPt || 'mt-12'}`}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </main>
        </div>
    );

    return (
        <div className="min-h-screen pb-16 bg-surface print:bg-white print:text-black">
            <Navbar />
            <main className={`max-w-7xl mx-auto px-6 animate-fade-in ${navPt || 'mt-12'}`}>
                <div className="flex justify-between items-center mb-10 print:hidden">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Wildlife Threat Analytics</h1>
                        <p className="text-text-muted">Comprehensive insights into threat patterns, case management, and response performance.</p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-surface"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <button className="btn-primary flex items-center gap-2" onClick={() => window.print()}>
                            <Download size={18} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 bg-white border border-border rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-text-muted mb-1">Total Threat Reports</p>
                                <p className="text-3xl font-black text-text">{getTotalCount(threatStats.statusBreakdown)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <AlertTriangle className="text-orange-500" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-border rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-text-muted mb-1">Active Cases</p>
                                <p className="text-3xl font-black text-text">
                                    {caseStats.statusBreakdown?.find(s => s._id === 'IN_PROGRESS')?.count || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Clock className="text-blue-500" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-border rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-text-muted mb-1">Resolved Cases</p>
                                <p className="text-3xl font-black text-primary">
                                    {caseStats.statusBreakdown?.find(s => s._id === 'RESOLVED')?.count || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                                <CheckCircle className="text-primary" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-border rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-text-muted mb-1">Avg Resolution Time</p>
                                <p className="text-3xl font-black text-text">
                                    {caseStats.resolutionTime ? `${caseStats.resolutionTime.avgResolutionTime?.toFixed(1)}d` : 'N/A'}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                                <TrendingUp className="text-purple-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Threat Types Distribution */}
                    <div className="p-8 bg-white border border-border rounded-3xl shadow-sm overflow-hidden print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <BarChart2 size={20} className="text-primary" />
                            Threat Types Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={threatStats.threatTypeBreakdown?.map(t => ({ 
                                    category: formatThreatType(t._id), 
                                    count: t.count 
                                })) || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                                    <XAxis dataKey="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px' }}
                                        itemStyle={{ color: '#111827' }}
                                        cursor={{ fill: 'rgba(94,185,70,0.05)' }}
                                    />
                                    <Bar dataKey="count" fill="#5EB946" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Case Status Distribution */}
                    <div className="p-8 bg-white border border-border rounded-3xl shadow-sm overflow-hidden print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <PieChartIcon size={20} className="text-primary" />
                            Case Status Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={caseStats.statusBreakdown?.map(s => ({ 
                                            name: s._id.replace(/_/g, ' '), 
                                            value: s.count 
                                        })) || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {(caseStats.statusBreakdown || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Geographic Distribution */}
                    <div className="p-8 bg-white border border-border rounded-3xl shadow-sm overflow-hidden print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <MapPin size={20} className="text-primary" />
                            Geographic Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={locationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                                    <XAxis dataKey="location" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Area type="monotone" dataKey="threats" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="cases" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Response Time Trends */}
                    <div className="p-8 bg-white border border-border rounded-3xl shadow-sm overflow-hidden print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                            <Clock size={20} className="text-primary" />
                            Response Time Trends
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={responseTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                                    <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgHours"
                                        stroke="#5EB946"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#5EB946', strokeWidth: 2, stroke: '#ffffff' }}
                                        name="Average Response Time"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="targetHours"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Target Response Time"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Incident Trends (Legacy) */}
                <div className="p-8 bg-white border border-border rounded-3xl shadow-sm overflow-hidden md:col-span-2 print:mb-8 print:border print:border-slate-200 print:bg-white print:shadow-none print:break-inside-avoid">
                    <h3 className="flex items-center gap-3 mb-8 text-text text-lg font-bold">
                        <TrendingUp size={20} className="text-primary" />
                        Historical Incident Trends
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px' }}
                                    itemStyle={{ color: '#111827' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8b5cf6"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
