import axios from "axios";
import authHeader from '../services/auth-header';

const API_URL = "https://localhost:44366/api/Users/authenticate";

class AuthService {
    
  login(username, password) {
    const data = { Name:username,Password:password };
    return axios
      .post(API_URL,data)
      .then(response => {     
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  checkToken(){
    return axios.get(`https://localhost:44366/api/Users/check`,{ headers: authHeader() })
    .then((response) => {
         return response

    })
    .catch(error => {return error.response});
  }



  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();