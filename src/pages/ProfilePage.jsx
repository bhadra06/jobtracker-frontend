import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const {  login } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/user/profile');
            setProfile(res.data);
            setName(res.data.name);
            setSkills(res.data.skills || []);
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (!trimmed) return;
        if (skills.includes(trimmed)) {
            toast.error('Skill already added');
            return;
        }
        setSkills([...skills, trimmed]);
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        setSaving(true);
        try {
            const res = await api.put('/api/user/profile', { name, skills });
            toast.success('Profile updated successfully!');
            // Update auth context with new name
            const token = localStorage.getItem('token');
            login({ name: res.data.name, email: res.data.email }, token);
            setProfile(res.data);
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const suggestedSkills = [
        'Java', 'Spring Boot', 'React', 'Node.js', 'Python',
        'PostgreSQL', 'MongoDB', 'MySQL', 'AWS', 'Docker',
        'Kubernetes', 'REST APIs', 'Microservices', 'Git',
        'TypeScript', 'JavaScript', 'Hibernate', 'Maven',
        'CI/CD', 'Linux', 'Agile', 'Scrum', 'System Design',
        'Tableau', 'Pandas', 'Scikit-learn', 'Machine Learning',
    ];

    const availableSuggestions = suggestedSkills.filter(s => !skills.includes(s));

    if (loading) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div style={styles.loading}>Loading profile...</div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.topRow}>
                    <h1 style={styles.heading}>My Profile</h1>
                    <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Profile Info Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Personal Information</h2>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={{ ...styles.input, background: '#F9FAFB', color: '#9CA3AF' }}
                            value={profile?.email || ''}
                            disabled
                        />
                        <span style={styles.hint}>Email cannot be changed</span>
                    </div>
                </div>

                {/* Skills Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>My Skills</h2>
                    <p style={styles.cardDesc}>
                        These skills are used by the AI analyzer to match you against job descriptions.
                        Keep them updated for accurate results.
                    </p>

                    {/* Current skills */}
                    <div style={styles.skillsContainer}>
                        {skills.length === 0 ? (
                            <p style={styles.noSkills}>No skills added yet. Add some below!</p>
                        ) : (
                            skills.map(skill => (
                                <div key={skill} style={styles.skillChip}>
                                    <span>{skill}</span>
                                    <button
                                        style={styles.removeBtn}
                                        onClick={() => removeSkill(skill)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add skill input */}
                    <div style={styles.addSkillRow}>
                        <input
                            style={styles.skillInput}
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a skill and press Enter or click Add"
                        />
                        <button style={styles.addBtn} onClick={addSkill}>
                            + Add
                        </button>
                    </div>

                    {/* Suggested skills */}
                    {availableSuggestions.length > 0 && (
                        <div style={styles.suggestionsSection}>
                            <p style={styles.suggestLabel}>Quick add:</p>
                            <div style={styles.suggestions}>
                                {availableSuggestions.map(skill => (
                                    <button
                                        key={skill}
                                        style={styles.suggestionChip}
                                        onClick={() => setSkills([...skills, skill])}
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Profile Stats</h2>
                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{skills.length}</div>
                            <div style={styles.statLabel}>Skills Listed</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statValue, color: skills.length >= 10 ? '#10B981' : '#F59E0B' }}>
                                {skills.length >= 15 ? 'Strong' : skills.length >= 10 ? 'Good' : skills.length >= 5 ? 'Fair' : 'Weak'}
                            </div>
                            <div style={styles.statLabel}>Profile Strength</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{profile?.email}</div>
                            <div style={styles.statLabel}>Account Email</div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : '💾 Save Profile'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#F9FAFB' },
    content: { maxWidth: '700px', margin: '0 auto', padding: '1.5rem' },
    loading: { textAlign: 'center', padding: '4rem', color: '#9CA3AF' },
    topRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem',
    },
    heading: { fontSize: '22px', fontWeight: '700', color: '#111827' },
    backBtn: {
        padding: '6px 14px', background: 'white',
        border: '1px solid #E5E7EB', borderRadius: '8px',
        fontSize: '13px', cursor: 'pointer', color: '#6B7280',
    },
    card: {
        background: 'white', borderRadius: '12px',
        padding: '1.25rem', border: '1px solid #E5E7EB',
        marginBottom: '1rem',
    },
    cardTitle: {
        fontSize: '16px', fontWeight: '600',
        color: '#111827', marginBottom: '12px',
    },
    cardDesc: {
        fontSize: '13px', color: '#6B7280',
        marginBottom: '1rem', lineHeight: '1.5',
    },
    field: { marginBottom: '12px' },
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '500', color: '#374151', marginBottom: '4px',
    },
    input: {
        width: '100%', padding: '9px 12px',
        border: '1px solid #D1D5DB', borderRadius: '8px',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    },
    hint: { fontSize: '11px', color: '#9CA3AF', marginTop: '3px', display: 'block' },
    skillsContainer: {
        display: 'flex', flexWrap: 'wrap',
        gap: '8px', marginBottom: '1rem',
        minHeight: '40px',
    },
    noSkills: { fontSize: '13px', color: '#9CA3AF' },
    skillChip: {
        display: 'flex', alignItems: 'center',
        gap: '6px', padding: '5px 12px',
        background: '#EFF6FF', border: '1px solid #BFDBFE',
        borderRadius: '20px', fontSize: '13px', color: '#1D4ED8',
    },
    removeBtn: {
        background: 'none', border: 'none',
        color: '#93C5FD', cursor: 'pointer',
        fontSize: '11px', padding: '0',
        lineHeight: '1',
    },
    addSkillRow: {
        display: 'flex', gap: '8px', marginBottom: '1rem',
    },
    skillInput: {
        flex: 1, padding: '8px 12px',
        border: '1px solid #D1D5DB', borderRadius: '8px',
        fontSize: '13px', outline: 'none',
    },
    addBtn: {
        padding: '8px 16px', background: '#3B82F6',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '13px',
        cursor: 'pointer', fontWeight: '500',
        whiteSpace: 'nowrap',
    },
    suggestionsSection: { marginTop: '4px' },
    suggestLabel: {
        fontSize: '12px', color: '#9CA3AF', marginBottom: '6px',
    },
    suggestions: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    suggestionChip: {
        padding: '4px 10px', background: '#F9FAFB',
        border: '1px solid #E5E7EB', borderRadius: '20px',
        fontSize: '12px', color: '#6B7280', cursor: 'pointer',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
    },
    statItem: {
        textAlign: 'center', padding: '1rem',
        background: '#F9FAFB', borderRadius: '8px',
    },
    statValue: {
        fontSize: '20px', fontWeight: '600',
        color: '#3B82F6', marginBottom: '4px',
        wordBreak: 'break-all',
    },
    statLabel: { fontSize: '12px', color: '#9CA3AF' },
    saveBtn: {
        width: '100%', padding: '12px',
        background: '#3B82F6', color: 'white',
        border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600',
        cursor: 'pointer', marginBottom: '2rem',
    },
};