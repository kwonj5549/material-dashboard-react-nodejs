import HttpService from "./htttp.service";

class GPTService {
  // authEndpoint = process.env.API_URL;

  generateAppleMusic = async (payload) => {
    const generateAppleMusicEndpoint = 'generate-AppleMusic';
    return await HttpService.post(generateAppleMusicEndpoint, payload);
  };
  sendAppleMusic = async (payload) => {
    const sendAppleMusicEndpoint = 'send-AppleMusic';
    return await HttpService.post(sendAppleMusicEndpoint, payload);
  };
  generateWordpress = async (payload) => {
    const generateWordpressEndpoint = 'generate-Wordpress';
    return await HttpService.post(generateWordpressEndpoint, payload);
  };

 
}

export default new GPTService();
