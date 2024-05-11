import axios from 'axios';
import { toast } from "react-toastify";

export const url = 'http://localhost:8000/api/v1/';

const axios_instance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refresh_token = async () => {  
  console.log("refreshing token", localStorage.getItem('refreshToken'))
  return await axios.post(`${url}auth/refreshToken`, { refreshToken: localStorage.getItem('refreshToken') }, {
    withCredentials: true, 
  });
}

let refreshing_token: any = null;

axios_instance.interceptors.response.use(response => {
  return response;
}, async error => {  
  const config = error.config;
  if (error.response && error.response.status === 401 && error?.response?.data?.message === 'jwt expired' && !config._retry) {
    config._retry = true;    
    try {
      refreshing_token = refreshing_token ? refreshing_token : refresh_token();
      let res = await refreshing_token;
      refreshing_token = null;
      return axios_instance(config);
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
});

const getDataFromApi = async (request: any) => {
  try {
    const response: any = await axios_instance(request);
    if (response.status === 200 || response.status === 201 || response?.code === 200 || response.code === 201) {
      return { data: response.data, flag: true };
    }
  } catch (err: any) {
    let errMessage = err?.response?.data?.message;
    let messages = ['Refresh token expired', 'Refresh token expired or used', 'Invalid refresh token','invalid signature', 'invalid token', 'jwt malformed', 'Not authorized to access this route.', 'jwt expired', 'Unauthorized', 'User may not exist.', 'Session expired'];
    if (messages.includes(errMessage)) {
      localStorage.clear();
      window.location.href = "/auth/login";
      window.location.reload();
    } else {
      toast.error(errMessage);
      return { flag: false, error: err.response };
    }
  }
};

export default getDataFromApi;