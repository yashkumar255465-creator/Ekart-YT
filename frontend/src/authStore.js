import createStore from 'react-auth-kit/store';

export const authStore = createStore('cookie', {
    authName: '_auth',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
});