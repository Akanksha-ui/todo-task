import axios from 'axios';

const instance = axios.create({
    baseURL: "http://todo.dev.api.iodatalabs.com/api",
    headers: {
        'Content-Type' : 'application/json',
        Accept : 'application/json',
    }
})

export default instance;