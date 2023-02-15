import axios from "axios";

const BASE_URL = "http://localhost:8001";

export const httpGet = async ({ url, params, headers, ...rest }) => {
  try {
    const apiUrl = BASE_URL + url;
    const response = await axios.get(apiUrl, {
      params,
      headers,
      ...rest,
    });
    
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error,
      };
    }
    throw error;
  }
};

export const httpPost = async ({ url, data, ...rest }) => {
  try {
    const apiUrl = BASE_URL + url;
    const response = await axios.post(apiUrl, data, rest);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error,
      };
    }
    throw error;
  }
};
