import api from './api';

export const productService = {

    async getAll(){
        const {data} = await api.get('/productos/');
        return data;
    },

    async getById(id){
        const {data} = await api.get(`/productos/${id}/`);
        return data;
    },





}