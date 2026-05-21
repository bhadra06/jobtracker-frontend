import { STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS } from '../utils/constants';

export default function ApplicationCard({ app, onEdit, onDelete, onStatusChange }) {
    const statusOptions = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED'];

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <div style={styles.company}>{app.companyName}</div>
                    <div style={styles.role}>{app.roleName}</div>
                </div>
                <div style={styles.actions}>
                    <button style={styles.editBtn} onClick={() => onEdit(app)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => onDelete(app.id)}>Delete</button>
                </div>
            </div>

            <div style={styles.meta}>
        <span style={{
            ...styles.badge,
            background: STATUS_COLORS[app.status] + '20',
            color: STATUS_COLORS[app.status],
        }}>
          {STATUS_LABELS[app.status]}
        </span>

                {app.priority && (
                    <span style={{
                        ...styles.badge,
                        background: PRIORITY_COLORS[app.priority] + '20',
                        color: PRIORITY_COLORS[app.priority],
                    }}>
            {app.priority}
          </span>
                )}

                {app.appliedDate && (
                    <span style={styles.date}>
            Applied: {new Date(app.appliedDate).toLocaleDateString()}
          </span>
                )}

                {app.aiMatchScore && (
                    <span style={styles.aiScore}>
            🤖 {app.aiMatchScore}% match
          </span>
                )}
            </div>

            <div style={styles.statusRow}>
                <span style={styles.statusLabel}>Move to:</span>
                <div style={styles.statusButtons}>
                    {statusOptions.filter(s => s !== app.status).map(s => (
                        <button
                            key={s}
                            style={{
                                ...styles.statusBtn,
                                borderColor: STATUS_COLORS[s],
                                color: STATUS_COLORS[s],
                            }}
                            onClick={() => onStatusChange(app, s)}
                        >
                            {STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
            </div>

            {app.notes && (
                <div style={styles.notes}>{app.notes}</div>
            )}
        </div>
    );
}

const styles = {
    card: {
        background: 'white',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        border: '1px solid #E5E7EB',
        marginBottom: '12px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
    },
    company: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#111827',
    },
    role: {
        fontSize: '14px',
        color: '#6B7280',
        marginTop: '2px',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    editBtn: {
        padding: '4px 10px',
        fontSize: '12px',
        background: '#EFF6FF',
        color: '#3B82F6',
        border: '1px solid #BFDBFE',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '4px 10px',
        fontSize: '12px',
        background: '#FEF2F2',
        color: '#EF4444',
        border: '1px solid #FECACA',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    meta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '10px',
        alignItems: 'center',
    },
    badge: {
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
    },
    date: {
        fontSize: '12px',
        color: '#9CA3AF',
    },
    aiScore: {
        fontSize: '12px',
        color: '#8B5CF6',
        fontWeight: '500',
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginTop: '8px',
    },
    statusLabel: {
        fontSize: '12px',
        color: '#9CA3AF',
    },
    statusButtons: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
    },
    statusBtn: {
        padding: '2px 8px',
        fontSize: '11px',
        background: 'transparent',
        border: '1px solid',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    notes: {
        marginTop: '8px',
        fontSize: '13px',
        color: '#6B7280',
        borderTop: '1px solid #F3F4F6',
        paddingTop: '8px',
    },
};