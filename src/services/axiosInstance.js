import axios from "axios";
import { APP_URL } from "../config/config";
import { auth } from "../config/firebase";

const axiosInstance = axios.create({
    baseURL: APP_URL,
    headers:{
        "Content-Type":"application/json"
    },
});

axiosInstance.interceptors.request.use(
    async(config)=>{
        if(auth.currentUser){
            const token = await auth.currentUser.getIdToken();
            config.headers.Authorization= `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        if (error.response && error.response.status === 401) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
    }
);

export default axiosInstance;