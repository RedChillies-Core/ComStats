export const getVerificationAmount = (verificationType: 'verified' | 'golden', duration: 'monthly' | 'yearly') => {
    let amount = 5;
    if (verificationType === 'golden') {
        amount = 50;
    }
    const multiplier = duration === 'monthly' ? 1 : 10;
    return amount * multiplier;
}