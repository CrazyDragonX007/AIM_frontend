import axios from "axios";

const base_url = process.env.REACT_APP_BACKEND_URL

export const login = async (creds) => {
  return axios.post(base_url+'/users/login',creds).then(res=>res).catch(err=>console.log(err));
}

export const register = async (data) => {
  return axios.post(base_url+'/users/register',data).then(res=>res).catch(err=>console.log(err));
}