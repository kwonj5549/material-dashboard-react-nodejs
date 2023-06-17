import HttpService from "./htttp.service";

class GPTService {
  // authEndpoint = process.env.API_URL;

  generate = async (payload) => {
    const generateEndpoint = 'generate-text';
    return await HttpService.post(generateEndpoint, payload);
  };

 
}

export default new GPTService();
