import HttpService from "./htttp.service";

class gptService {
  // authEndpoint = process.env.API_URL;

  generate = async (payload) => {
    const loginEndpoint = 'login';
    return await HttpService.post(loginEndpoint, payload);
  };
}

export default new AuthService();
