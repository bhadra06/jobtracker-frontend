

export default function StatsCards({ stats }) {
    if (!stats) return null;

    const cards = [
        { label: 'Total Applied', value: stats.total, color: '#3B82F6' },
        { label: 'Shortlisted', value: stats.shortlisted, color: '#F59E0B' },
        { label: 'Interviews', value: stats.interview, color: '#8B5CF6' },
        { label: 'Offers', value: stats.offer, color: '#10B981' },
        { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
    ];

    return (
        <div style={styles.grid}>
            {cards.map((card) => (
                <div key={card.label} style={styles.card}>
                    <div style={{ ...styles.value, color: card.color }}>{card.value}</div>
                    <div style={styles.label}>{card.label}</div>
                </div>
            ))}
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '1.5rem',
    },
    card: {
        background: 'white',
        borderRadius: '10px',
        padding: '1rem',
        textAlign: 'center',
        border: '1px solid #E5E7EB',
    },
    value: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '4px',
    },
    label: {
        fontSize: '13px',
        color: '#6B7280',
    },
};