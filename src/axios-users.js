import axios from 'axios';

axios.defaults.withCrendentails = true
const instance = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5500/api/users"
})

export default instance;