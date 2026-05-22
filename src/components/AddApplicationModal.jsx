import { useState, useEffect } from 'react';

export default function AddApplicationModal({ onClose, onSave, existing }) {
    const [form, setForm] = useState({
        companyName: '',
        roleName: '',
        jobDescription: '',
        jobUrl: '',
        status: 'APPLIED',
        priority: 'MEDIUM',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (existing) setForm({ ...form, ...existing });
    }, [existing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        {existing ? 'Edit Application' : 'Add Application'}
                    </h2>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        {[
                            { key: 'companyName', label: 'Company Name', required: true },
                            { key: 'roleName', label: 'Role / Position', required: true },
                            { key: 'jobUrl', label: 'Job URL' },
                            { key: 'appliedDate', label: 'Applied Date', type: 'date' },
                        ].map(({ key, label, required, type }) => (
                            <div key={key} style={styles.field}>
                                <label style={styles.label}>{label}</label>
                                <input
                                    style={styles.input}
                                    type={type || 'text'}
                                    value={form[key]}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    required={required}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Status</label>
                            <select
                                style={styles.input}
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                {['APPLIED','SHORTLISTED','INTERVIEW','OFFER','REJECTED'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Priority</label>
                            <select
                                style={styles.input}
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            >
                                {['LOW','MEDIUM','HIGH'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Job Description</label>
                        <textarea
                            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                            value={form.jobDescription}
                            onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                            placeholder="Paste the job description here..."
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Notes</label>
                        <textarea
                            style={{ ...styles.input, height: '60px', resize: 'vertical' }}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Any notes about this application..."
                        />
                    </div>

                    <div style={styles.footer}>
                        <button type="button" style={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.saveBtn}>
                            {existing ? 'Save Changes' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000,
    },
    modal: {
        background: 'white', borderRadius: '12px',
        padding: '1.5rem', width: '100%',
        maxWidth: '560px', maxHeight: '90vh',
        overflowY: 'auto',
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.25rem',
    },
    title: { fontSize: '18px', fontWeight: '600', color: '#111827' },
    closeBtn: {
        background: 'none', border: 'none',
        fontSize: '18px', cursor: 'pointer', color: '#6B7280',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    field: { marginBottom: '12px' },
    label: {
        display: 'block', fontSize: '13px',
        fontWeight: '500', color: '#374151', marginBottom: '4px',
    },
    input: {
        width: '100%', padding: '8px 10px',
        border: '1px solid #D1D5DB', borderRadius: '6px',
        fontSize: '13px', outline: 'none', boxSizing: 'border-box',
    },
    footer: {
        display: 'flex', justifyContent: 'flex-end',
        gap: '10px', marginTop: '1rem',
    },
    cancelBtn: {
        padding: '8px 16px', background: 'white',
        border: '1px solid #D1D5DB', borderRadius: '8px',
        fontSize: '14px', cursor: 'pointer',
    },
    saveBtn: {
        padding: '8px 16px', background: '#3B82F6',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    },
};