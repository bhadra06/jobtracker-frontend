import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AnalyzePage() {
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast.error('Please paste a job description first');
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/api/ai/analyze', { jobDescription });
            setResult(res.data);
            toast.success('Analysis complete!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Analysis failed. Try again in a minute.');
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async () => {
        if (!chatInput.trim()) return;
        const userMessage = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);
        try {
            const res = await api.post('/api/ai/chat', {
                message: userMessage,
                history: chatMessages,
            });
            setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            toast.error('Chat failed. Try again in a minute.');
            setChatMessages(prev => prev.slice(0, -1));
        } finally {
            setChatLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return '#10B981';
        if (score >= 40) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.topRow}>
                    <h1 style={styles.heading}>AI Job Analyzer</h1>
                    <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>

                <div style={styles.grid}>
                    {/* Left — JD Analyzer */}
                    <div>
                        <div style={styles.card}>
                            <h2 style={styles.cardTitle}>JD Match Analyzer</h2>
                            <p style={styles.cardDesc}>
                                Paste a job description to see how well your skills match and what's missing.
                            </p>
                            <textarea
                                style={styles.textarea}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                rows={8}
                            />
                            <button
                                style={{ ...styles.analyzeBtn, opacity: loading ? 0.7 : 1 }}
                                onClick={handleAnalyze}
                                disabled={loading}
                            >
                                {loading ? '🤖 Analyzing...' : '🤖 Analyze Match'}
                            </button>
                        </div>

                        {/* Results */}
                        {result && (
                            <div style={styles.card}>
                                <div style={styles.scoreRow}>
                                    <div>
                                        <div style={styles.scoreLabel}>Match Score</div>
                                        <div style={{
                                            ...styles.scoreValue,
                                            color: getScoreColor(result.matchScore)
                                        }}>
                                            {result.matchScore}%
                                        </div>
                                    </div>
                                    <div style={{
                                        ...styles.scoreCircle,
                                        borderColor: getScoreColor(result.matchScore),
                                        color: getScoreColor(result.matchScore),
                                    }}>
                                        {result.matchScore}%
                                    </div>
                                </div>

                                {result.summary && (
                                    <p style={styles.summary}>{result.summary}</p>
                                )}

                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>✅ Matched Skills</div>
                                    <div style={styles.chips}>
                                        {result.matchedSkills?.map(skill => (
                                            <span key={skill} style={styles.greenChip}>{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>❌ Missing Skills</div>
                                    <div style={styles.chips}>
                                        {result.missingSkills?.map(skill => (
                                            <span key={skill} style={styles.redChip}>{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>💡 Suggestions</div>
                                    {result.suggestions?.map((s, i) => (
                                        <div key={i} style={styles.suggestion}>
                                            {i + 1}. {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Chat Assistant */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>AI Career Assistant</h2>
                        <p style={styles.cardDesc}>
                            Ask anything about interview prep, resume tips, or career advice.
                        </p>

                        <div style={styles.chatBox}>
                            {chatMessages.length === 0 && (
                                <div style={styles.chatPlaceholder}>
                                    <div style={styles.placeholderIcon}>🤖</div>
                                    <p>Ask me anything!</p>
                                    <div style={styles.suggestions}>
                                        {[
                                            'How to prepare for a Java interview?',
                                            'Write a cold email to a recruiter',
                                            'What is System Design?',
                                            'Tips for fresher resume',
                                        ].map(q => (
                                            <button
                                                key={q}
                                                style={styles.suggestionBtn}
                                                onClick={() => setChatInput(q)}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        ...styles.message,
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.role === 'user' ? '#3B82F6' : '#F3F4F6',
                                        color: msg.role === 'user' ? 'white' : '#111827',
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ))}

                            {chatLoading && (
                                <div style={{ ...styles.message, background: '#F3F4F6', color: '#9CA3AF' }}>
                                    Thinking...
                                </div>
                            )}
                        </div>

                        <div style={styles.chatInputRow}>
                            <input
                                style={styles.chatInput}
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                                placeholder="Ask anything about your job search..."
                            />
                            <button
                                style={styles.sendBtn}
                                onClick={handleChat}
                                disabled={chatLoading}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#F9FAFB' },
    content: { maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' },
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
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        alignItems: 'start',
    },
    card: {
        background: 'white', borderRadius: '12px',
        padding: '1.25rem', border: '1px solid #E5E7EB',
        marginBottom: '1rem',
    },
    cardTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '6px' },
    cardDesc: { fontSize: '13px', color: '#6B7280', marginBottom: '1rem' },
    textarea: {
        width: '100%', padding: '10px',
        border: '1px solid #D1D5DB', borderRadius: '8px',
        fontSize: '13px', resize: 'vertical',
        boxSizing: 'border-box', outline: 'none',
        fontFamily: 'inherit',
    },
    analyzeBtn: {
        width: '100%', marginTop: '10px',
        padding: '10px', background: '#3B82F6',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '14px',
        fontWeight: '500', cursor: 'pointer',
    },
    scoreRow: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1rem',
    },
    scoreLabel: { fontSize: '13px', color: '#6B7280' },
    scoreValue: { fontSize: '36px', fontWeight: '700' },
    scoreCircle: {
        width: '70px', height: '70px',
        borderRadius: '50%', border: '4px solid',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '16px',
        fontWeight: '700',
    },
    summary: {
        fontSize: '13px', color: '#374151',
        background: '#F9FAFB', padding: '10px',
        borderRadius: '6px', marginBottom: '1rem',
    },
    section: { marginBottom: '1rem' },
    sectionTitle: {
        fontSize: '13px', fontWeight: '600',
        color: '#374151', marginBottom: '6px',
    },
    chips: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    greenChip: {
        padding: '3px 10px', background: '#D1FAE5',
        color: '#065F46', borderRadius: '20px', fontSize: '12px',
    },
    redChip: {
        padding: '3px 10px', background: '#FEE2E2',
        color: '#991B1B', borderRadius: '20px', fontSize: '12px',
    },
    suggestion: {
        fontSize: '13px', color: '#374151',
        padding: '6px 0', borderBottom: '1px solid #F3F4F6',
    },
    chatBox: {
        height: '320px', overflowY: 'auto',
        border: '1px solid #E5E7EB', borderRadius: '8px',
        padding: '12px', marginBottom: '10px',
        display: 'flex', flexDirection: 'column', gap: '8px',
    },
    chatPlaceholder: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', color: '#9CA3AF',
    },
    placeholderIcon: { fontSize: '32px', marginBottom: '8px' },
    suggestions: {
        display: 'flex', flexDirection: 'column',
        gap: '6px', width: '100%', marginTop: '8px',
    },
    suggestionBtn: {
        padding: '6px 12px', background: '#EFF6FF',
        color: '#3B82F6', border: '1px solid #BFDBFE',
        borderRadius: '6px', fontSize: '12px',
        cursor: 'pointer', textAlign: 'left',
    },
    message: {
        padding: '8px 12px', borderRadius: '10px',
        fontSize: '13px', maxWidth: '85%',
        lineHeight: '1.5', whiteSpace: 'pre-wrap',
    },
    chatInputRow: { display: 'flex', gap: '8px' },
    chatInput: {
        flex: 1, padding: '8px 12px',
        border: '1px solid #D1D5DB', borderRadius: '8px',
        fontSize: '13px', outline: 'none',
    },
    sendBtn: {
        padding: '8px 16px', background: '#3B82F6',
        color: 'white', border: 'none',
        borderRadius: '8px', fontSize: '13px',
        cursor: 'pointer', fontWeight: '500',
    },
};