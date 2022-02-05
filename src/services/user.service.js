import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://localhost:44366/api/users/check';

class UserService {

  getAdminBoard() {
    return axios.get(API_URL, { headers: authHeader() });
  }


}

export default new UserService();