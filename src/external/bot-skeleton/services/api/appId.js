import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import APIMiddleware from './api-middleware';
import { DERIV_DEFAULT_APP_ID } from '../../../../ai/lifecycle/deriv-client';

// The bot-skeleton still sends the legacy Deriv WebSocket vocabulary
// (website_status, active_symbols, balance, authorize, etc.). It must not
// connect to the new Options API WebSocket, which only accepts the new
// Options protocol. Keep this transport isolated from the new Options client.
const LEGACY_DERIV_WS_URL =
    typeof process !== 'undefined' && (process as any).env?.PUBLIC_LEGACY_DERIV_WS_URL
        ? String((process as any).env.PUBLIC_LEGACY_DERIV_WS_URL).trim()
        : 'wss://ws.derivws.com/websockets/v3';

export const generateDerivApiInstance = () => {
    const separator = LEGACY_DERIV_WS_URL.includes('?') ? '&' : '?';
    const socket_url = DERIV_DEFAULT_APP_ID
        ? `${LEGACY_DERIV_WS_URL}${separator}app_id=${encodeURIComponent(DERIV_DEFAULT_APP_ID)}`
        : LEGACY_DERIV_WS_URL;

    const deriv_socket = new WebSocket(socket_url);
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
        middleware: new APIMiddleware({}),
    });
    return deriv_api;
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
    const account_list = JSON.parse(localStorage.getItem('accountsList'));
    if (account_list && account_list !== 'null') {
        const active_clientId = Object.keys(account_list).find(key => account_list[key] === token);
        return active_clientId;
    }
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('accountsList')) ?? undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || undefined;
    return {
        token: active_account ?? undefined,
        account_id: active_loginid ?? undefined,
    };
};
