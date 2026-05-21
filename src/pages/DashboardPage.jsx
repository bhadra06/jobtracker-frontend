import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import ApplicationCard from '../components/ApplicationCard';
import AddApplicationModal from '../components/AddApplicationModal';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [appsRes, statsRes] = await Promise.all([
                api.get('/api/applications'),
                api.get('/api/applications/stats'),
            ]);
            setApplications(appsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (form) => {
        try {
            if (editing) {
                await api.put(`/api/applications/${editing.id}`, form);
                toast.success('Application updated');
            } else {
                await api.post('/api/applications', form);
                toast.success('Application added');
            }
            setShowModal(false);
            setEditing(null);
            fetchAll();
        } catch (err) {
            toast.error('Failed to save application');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this application?')) return;
        try {
            await api.delete(`/api/applications/${id}`);
            toast.success('Deleted');
            fetchAll();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (app) => {
        setEditing(app);
        setShowModal(true);
    };

    const handleStatusChange = async (app, newStatus) => {
        try {
            await api.put(`/api/applications/${app.id}`, { ...app, status: newStatus });
            toast.success(`Moved to ${newStatus}`);
            fetchAll();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filtered = filter === 'ALL'
        ? applications
        : applications.filter(a => a.status === filter);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.topRow}>
                    <h1 style={styles.heading}>My Applications</h1>
                    <button
                        style={styles.addBtn}
                        onClick={() => { setEditing(null); setShowModal(true); }}
                    >
                        + Add Application
                    </button>
                </div>

                <StatsCards stats={stats} />

                <div style={styles.filters}>
                    {['ALL','APPLIED','SHORTLISTED','INTERVIEW','OFFER','REJECTED'].map(s => (
                        <button
                            key={s}
                            style={{
                                ...styles.filterBtn,
                                background: filter === s ? '#3B82F6' : 'white',
                                color: filter === s ? 'white' : '#6B7280',
                                borderColor: filter === s ? '#3B82F6' : '#E5E7EB',
                            }}
                            onClick={() => setFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={styles.empty}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={styles.empty}>
                        No applications yet.{' '}
                        <span
                            style={{ color: '#3B82F6', cursor: 'pointer' }}
                            onClick={() => setShowModal(true)}
                        >
              Add your first one!
            </span>
                    </div>
                ) : (
                    filtered.map(app => (
                        <ApplicationCard
                            key={app.id}
                            app={app}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                )}
            </div>

            {showModal && (
                <AddApplicationModal
                    onClose={() => { setShowModal(false); setEditing(null); }}
                    onSave={handleSave}
                    existing={editing}
                />
            )}
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#F9FAFB' },
    content: { maxWidth: '900px', margin: '0 auto', padding: '1.5rem' },
    topRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem',
    },
    heading: { fontSize: '22px', fontWeight: '700', color: '#111827' },
    addBtn: {
        padding: '8px 18px', background: '#3B82F6',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    },
    filters: {
        display: 'flex', gap: '8px',
        flexWrap: 'wrap', marginBottom: '1rem',
    },
    filterBtn: {
        padding: '5px 14px', border: '1px solid',
        borderRadius: '20px', fontSize: '12px',
        fontWeight: '500', cursor: 'pointer',
    },
    empty: {
        textAlign: 'center', padding: '3rem',
        color: '#9CA3AF', fontSize: '15px',
    },
};