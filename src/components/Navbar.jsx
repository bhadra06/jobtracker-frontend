import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand} onClick={() => navigate('/dashboard')}>
                JobTracker <span style={styles.ai}>AI</span>
            </div>
            <div style={styles.right}>
  <span
      style={{ ...styles.name, cursor: 'pointer' }}
      onClick={() => navigate('/profile')}
  >
    👋 {user?.name}
  </span>
                <button style={styles.btn} onClick={() => navigate('/analyze')}>
                    AI Analyzer
                </button>
                <button style={styles.btn} onClick={() => navigate('/profile')}
                        style={{ ...styles.btn, background: '#8B5CF6' }}>
                    Profile
                </button>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '60px',
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
        cursor: 'pointer',
    },
    ai: {
        color: '#3B82F6',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    name: {
        fontSize: '14px',
        color: '#6B7280',
    },
    btn: {
        padding: '6px 14px',
        background: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    logoutBtn: {
        padding: '6px 14px',
        background: 'transparent',
        color: '#EF4444',
        border: '1px solid #EF4444',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer',
    },
};