import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { 
  FileText, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  Users,
  Plus,
  Save,
  X
} from 'lucide-react';

const CaseManagement = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [officers, setOfficers] = useState([]);
    const [threatReports, setThreatReports] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        threatType: '',
        search: ''
    });
    const [newCase, setNewCase] = useState({
        threatReportId: '',
        threatType: 'POACHING',
        location: { lat: 0, lng: 0, address: '' },
        reporterInfo: { name: '', email: '', phone: '', isAnonymous: false },
        dateTime: new Date().toISOString().slice(0, 16),
        priority: 'MEDIUM',
        assignedOfficer: ''
    });
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        inProgress: 0,
        resolved: 0
    });

    useEffect(() => {
        fetchCases();
        fetchStats();
        fetchOfficers();
        fetchThreatReports();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await api.get('/auth/users');
            const officers = response.data.filter(user => user.role === 'OFFICER');
            setOfficers(officers || []);
        } catch (err) {
            console.error('Failed to fetch officers:', err);
        }
    };

    const fetchThreatReports = async () => {
        try {
            const response = await api.get('/threat-reports');
            setThreatReports(response.data.reports || []);
        } catch (err) {
            console.error('Failed to fetch threat reports:', err);
        }
    };

    const handleThreatReportChange = async (reportId) => {
        setNewCase({ ...newCase, threatReportId: reportId });
        
        if (reportId) {
            try {
                const response = await api.get(`/threat-reports/${reportId}`);
                const report = response.data;
                if (report && report.location) {
                    setNewCase(prev => ({
                        ...prev,
                        threatReportId: reportId,
                        location: report.location,
                        threatType: report.threatType || prev.threatType,
                        dateTime: report.dateTime ? new Date(report.dateTime).toISOString().slice(0, 16) : prev.dateTime,
                        reporterInfo: report.reporterInfo || prev.reporterInfo
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch threat report details:', err);
                if (err.response?.status === 404) {
                    console.warn('Threat report not found, it may have been deleted');
                    // Don't reset the form, just show a warning
                    setError('Selected threat report not found. It may have been deleted.');
                    setTimeout(() => setError(null), 3000);
                } else {
                    console.error('Error fetching threat report:', err);
                }
            }
        } else {
            // Reset form fields when no report is selected
            setNewCase(prev => ({
                ...prev,
                threatReportId: '',
                location: { lat: 0, lng: 0, address: '' },
                reporterInfo: { name: '', email: '', phone: '', isAnonymous: false },
                dateTime: new Date().toISOString().slice(0, 16),
                threatType: 'POACHING'
            }));
        }
    };

    const fetchCases = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.threatType) params.append('threatType', filters.threatType);
            
            const response = await api.get(`/cases?${params.toString()}`);
            setCases(response.data.cases || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cases');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/cases/stats/overview');
            const statusStats = response.data.statusBreakdown || [];
            
            const newStats = {
                total: statusStats.reduce((sum, stat) => sum + stat.count, 0),
                new: statusStats.find(s => s._id === 'NEW')?.count || 0,
                inProgress: statusStats.find(s => s._id === 'IN_PROGRESS')?.count || 0,
                resolved: statusStats.find(s => s._id === 'RESOLVED')?.count || 0
            };
            
            setStats(newStats);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const applyFilters = () => {
        fetchCases();
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            threatType: '',
            search: ''
        });
        setTimeout(fetchCases, 0);
    };

    const handleCreateCase = async () => {
        try {
            console.log('Creating case with data:', newCase);
            console.log('Auth token:', localStorage.getItem('token'));
            
            // If threat report is selected, fetch its details to get location and reporter info
            if (newCase.threatReportId) {
                try {
                    const reportResponse = await api.get(`/threat-reports/${newCase.threatReportId}`);
                    const report = reportResponse.data;
                    
                    // Update case data with report details
                    const caseData = {
                        ...newCase,
                        location: report.location || newCase.location,
                        reporterInfo: report.reporterInfo || newCase.reporterInfo,
                        dateTime: report.dateTime ? new Date(report.dateTime).toISOString().slice(0, 16) : newCase.dateTime,
                        threatType: report.threatType || newCase.threatType
                    };
                    
                    console.log('Updated case data with report details:', caseData);
                    const response = await api.post('/cases', caseData);
                    console.log('Case created successfully:', response.data);
                    
                    setCases([response.data.case, ...cases]);
                    setShowCreateForm(false);
                    resetNewCaseForm();
                    fetchStats();
                } catch (reportError) {
                    console.error('Error fetching threat report details:', reportError);
                    if (reportError.response?.status === 404) {
                        setError('Selected threat report not found. Please select a different report or create case without report.');
                        return;
                    }
                    // If we can't fetch report details due to other errors, proceed with original data
                    const response = await api.post('/cases', newCase);
                    console.log('Case created successfully:', response.data);
                    
                    setCases([response.data.case, ...cases]);
                    setShowCreateForm(false);
                    resetNewCaseForm();
                    fetchStats();
                }
            } else {
                // No threat report selected, proceed with original data
                const response = await api.post('/cases', newCase);
                console.log('Case created successfully:', response.data);
                
                setCases([response.data.case, ...cases]);
                setShowCreateForm(false);
                resetNewCaseForm();
                fetchStats();
            }
        } catch (err) {
            console.error('Error creating case:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to create case');
        }
    };

    const resetNewCaseForm = () => {
        setNewCase({
            threatReportId: '',
            threatType: 'POACHING',
            location: { lat: 0, lng: 0, address: '' },
            reporterInfo: { name: '', email: '', phone: '', isAnonymous: false },
            dateTime: new Date().toISOString().slice(0, 16),
            priority: 'MEDIUM',
            assignedOfficer: ''
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'NEW': 'bg-blue-100 text-blue-800',
            'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
            'UNDER_INVESTIGATION': 'bg-orange-100 text-orange-800',
            'RESOLVED': 'bg-green-100 text-green-800',
            'CLOSED': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': 'bg-gray-100 text-gray-800',
            'MEDIUM': 'bg-blue-100 text-blue-800',
            'HIGH': 'bg-orange-100 text-orange-800',
            'CRITICAL': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const formatThreatType = (type) => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const filteredCases = cases.filter(case_ => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                case_.caseId?.toLowerCase().includes(searchLower) ||
                case_.threatType?.toLowerCase().includes(searchLower) ||
                case_.location?.address?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen pb-16">
                <Navbar />
                <main className="max-w-7xl mx-auto px-6 mt-12">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 mt-12 animate-fade-in">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Case Management</h1>
                            <p className="text-text-muted">Manage and track wildlife threat cases</p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center gap-2 btn-primary"
                        >
                            <Plus size={20} />
                            <span>File New Case</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 glass-morphism">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Total Cases</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="text-primary" size={24} />
                        </div>
                    </div>

                    <div className="p-6 glass-morphism">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">New Cases</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                            </div>
                            <AlertTriangle className="text-blue-600" size={24} />
                        </div>
                    </div>

                    <div className="p-6 glass-morphism">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">In Progress</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                            </div>
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                    </div>

                    <div className="p-6 glass-morphism">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-muted">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                            </div>
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 glass-morphism mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter size={20} className="text-primary" />
                        <h3 className="text-lg font-semibold">Filters</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="form-group">
                            <label className="text-sm font-medium text-text-muted">Search</label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                                <input
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="Search cases..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="text-sm font-medium text-text-muted">Status</label>
                            <select
                                className="input-field"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-sm font-medium text-text-muted">Priority</label>
                            <select
                                className="input-field"
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                            >
                                <option value="">All Priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-sm font-medium text-text-muted">Threat Type</label>
                            <select
                                className="input-field"
                                value={filters.threatType}
                                onChange={(e) => handleFilterChange('threatType', e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="POACHING">Poaching</option>
                                <option value="FOREST_FIRE">Forest Fire</option>
                                <option value="INJURED_ANIMAL">Injured Animal</option>
                                <option value="ILLEGAL_LOGGING">Illegal Logging</option>
                                <option value="HUMAN_WILDLIFE_CONFLICT">Human-Wildlife Conflict</option>
                            </select>
                        </div>

                        <div className="flex gap-2 items-end">
                            <button
                                onClick={applyFilters}
                                className="btn-primary flex-1"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cases Table */}
                <div className="glass-morphism">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Cases ({filteredCases.length})</h3>
                    </div>
                    
                    {error ? (
                        <div className="p-6 text-center text-danger">
                            {error}
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div className="p-12 text-center text-text-muted">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No cases found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-4 font-semibold">Case ID</th>
                                        <th className="text-left p-4 font-semibold">Threat Type</th>
                                        <th className="text-left p-4 font-semibold">Location</th>
                                        <th className="text-left p-4 font-semibold">Assigned Officer</th>
                                        <th className="text-left p-4 font-semibold">Priority</th>
                                        <th className="text-left p-4 font-semibold">Status</th>
                                        <th className="text-left p-4 font-semibold">Created</th>
                                        <th className="text-left p-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCases.map((case_) => (
                                        <tr key={case_._id} className="border-b border-border hover:bg-surface-light transition-colors">
                                            <td className="p-4">
                                                <span className="font-mono text-sm font-medium">{case_.caseId}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{formatThreatType(case_.threatType)}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-text-muted" />
                                                    <span className="text-sm truncate max-w-xs">
                                                        {case_.location?.address || 'Unknown location'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {case_.assignedOfficer ? (
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-text-muted" />
                                                        <span className="text-sm">{case_.assignedOfficer.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-text-muted">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                                                    {case_.priority}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                                                    {case_.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-text-muted" />
                                                    <span className="text-sm">
                                                        {new Date(case_.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => navigate(`/cases/${case_.caseId}`)}
                                                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    <span className="text-sm">View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Create Case Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">File New Case</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Threat Report</label>
                                        <select
                                            className="input-field"
                                            value={newCase.threatReportId}
                                            onChange={(e) => handleThreatReportChange(e.target.value)}
                                        >
                                            <option value="">Select Threat Report</option>
                                            {threatReports.map(report => (
                                                <option key={report._id} value={report._id}>
                                                    {report.reportId} - {report.threatType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Threat Type</label>
                                        <select
                                            className="input-field"
                                            value={newCase.threatType}
                                            onChange={(e) => setNewCase({ ...newCase, threatType: e.target.value })}
                                        >
                                            <option value="POACHING">Poaching</option>
                                            <option value="FOREST_FIRE">Forest Fire</option>
                                            <option value="INJURED_ANIMAL">Injured Animal</option>
                                            <option value="ILLEGAL_LOGGING">Illegal Logging</option>
                                            <option value="HUMAN_WILDLIFE_CONFLICT">Human-Wildlife Conflict</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="text-sm font-medium text-text-muted">Location Address</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Enter location address"
                                        value={newCase.location.address}
                                        onChange={(e) => setNewCase({ 
                                            ...newCase, 
                                            location: { ...newCase.location, address: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="input-field"
                                            value={newCase.dateTime}
                                            onChange={(e) => setNewCase({ ...newCase, dateTime: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Priority</label>
                                        <select
                                            className="input-field"
                                            value={newCase.priority}
                                            onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="CRITICAL">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="text-sm font-medium text-text-muted">Assign Officer</label>
                                    <select
                                        className="input-field"
                                        value={newCase.assignedOfficer}
                                        onChange={(e) => setNewCase({ ...newCase, assignedOfficer: e.target.value })}
                                    >
                                        <option value="">Select Officer (Optional)</option>
                                        {officers.map(officer => (
                                            <option key={officer._id} value={officer._id}>
                                                {officer.name} - {officer.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Reporter Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Optional"
                                            value={newCase.reporterInfo.name}
                                            onChange={(e) => setNewCase({ 
                                                ...newCase, 
                                                reporterInfo: { ...newCase.reporterInfo, name: e.target.value }
                                            })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Reporter Email</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="Optional"
                                            value={newCase.reporterInfo.email}
                                            onChange={(e) => setNewCase({ 
                                                ...newCase, 
                                                reporterInfo: { ...newCase.reporterInfo, email: e.target.value }
                                            })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="text-sm font-medium text-text-muted">Reporter Phone</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            placeholder="Optional"
                                            value={newCase.reporterInfo.phone}
                                            onChange={(e) => setNewCase({ 
                                                ...newCase, 
                                                reporterInfo: { ...newCase.reporterInfo, phone: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        checked={newCase.reporterInfo.isAnonymous}
                                        onChange={(e) => setNewCase({ 
                                            ...newCase, 
                                            reporterInfo: { ...newCase.reporterInfo, isAnonymous: e.target.checked }
                                        })}
                                    />
                                    <label htmlFor="anonymous" className="text-sm text-text-muted">
                                        Anonymous reporter
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCase}
                                    className="flex items-center gap-2 btn-primary"
                                >
                                    <Save size={16} />
                                    <span>File Case</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CaseManagement;
