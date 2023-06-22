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

  oauthWordpress = async (payload) => {
    const oauthWordpressEndpoint = 'auth/wordpress';
    return await HttpService.post(oauthWordpressEndpoint, payload);
  };
  oauthWordpressCallback = async (payload) => {
    const oauthWordpressCallbackEndpoint = 'auth/wordpress/callback';
    return await HttpService.post(oauthWordpressCallbackEndpoint, payload);
  };
}

export default new GPTService();
