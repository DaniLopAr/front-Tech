import api from './api';

export const authService = {

    async login(username, password) {
        const { data } = await api.post('/token/', { username, password });
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        return data;
    },

    async registro(username, email, password, password2) {
        const { data } = await api.post('/registro/', { username, email, password, password2 });
        return data;
    },

    logout() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    },

    isAuthenticated() {
        return !!localStorage.getItem('access');
    }

}