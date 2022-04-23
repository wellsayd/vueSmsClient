import axios from "axios";
export default {
  /**
   * Get
   * @param  {string} url     [url to get with]
   * @param  {object} request [request]
   * @return {object}         [data or an error]
   */
  get(url, request) {
    return axios
      .get(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  post(url, request, headers) {
    return axios
      .post(url, request, { headers: headers })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },
};
