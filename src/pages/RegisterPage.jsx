import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', skills: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
            };
            const res = await api.post('/api/auth/register', payload);
            login({ name: res.data.name, email: res.data.email }, res.data.token);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>JobTracker AI</h1>
                <p style={styles.subtitle}>Create your account</p>

                <form onSubmit={handleSubmit}>
                    {[
                        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Bhadra' },
                        { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                        { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                    ].map(({ key, label, type, placeholder }) => (
                        <div key={key} style={styles.field}>
                            <label style={styles.label}>{label}</label>
                            <input
                                style={styles.input}
                                type={type}
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                placeholder={placeholder}
                                required
                            />
                        </div>
                    ))}

                    <div style={styles.field}>
                        <label style={styles.label}>Your Skills (comma separated)</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={form.skills}
                            onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            placeholder="Java, Spring Boot, React, AWS"
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#3B82F6' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F3F4F6',
    },
    card: {
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '4px',
        textAlign: 'center',
    },
    subtitle: {
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '14px',
    },
    field: { marginBottom: '1rem' },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '4px',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '10px',
        background: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    link: {
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '14px',
        color: '#6B7280',
    },
};