export const formatCurrency = (value: number, currency: string = 'USD') => {
    if (value == null || isNaN(value)) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
    }).format(value);
};