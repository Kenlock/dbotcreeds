export const generateDerivApiInstance = () => {
    throw new Error(
        'Legacy Deriv bot-skeleton WebSocket transport is disabled. ' +
        'Use the new OAuth + REST + OTP Options API flow instead.'
    );
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const V2GetActiveToken = () => {
    const token = localStorage.getItem('authToken');
    if (token && token !== 'null') return token;
    return null;
};

export const V2GetActiveClientId = () => {
    const token = V2GetActiveToken();
    if (!token) return null;

    const account_list = JSON.parse(localStorage.getItem('accountsList') || '{}');
    if (account_list && Object.keys(account_list).length) {
        return Object.keys(account_list).find(key => account_list[key] === token) || null;
    }

    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('accountsList') || '{}');
    const active_account = (client_accounts && client_accounts[active_loginid]) || undefined;

    return {
        token: active_account ?? undefined,
        account_id: active_loginid ?? undefined,
    };
};
