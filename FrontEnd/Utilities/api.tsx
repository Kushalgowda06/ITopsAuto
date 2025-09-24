
import { apiClient, finopsClient } from '../../api/customAxios'



export const Api = {
  getData: async function (endPoint: any) {
    const response = await apiClient.request({
      url: `${endPoint}`,
      method: "GET",
    })
    return response.data.data
  },
  getCall: async function (url: any) {
    const response = await apiClient.get(url)
    return response;
  },
  getCallOptions: async function (url: any, options = {}) {
    const response = await apiClient(url, options);
    return response;
  },
  getCallAuth: async function (url: any) {
    const response = await apiClient.get(url, {
      headers: {
        'Authorization': ' key 3cDr1pIarR2GaUUdZjWC29waPPyL30v85JMcZsoP',
      },
    }
    );
    return response;
  },
  postCall: async function (url: any, postbody: any) {
    const response = await apiClient.post(url, postbody)
    return response
  },
  postImage: async function (url: any, postbody: any) {
    const response = await apiClient.post(url, postbody ,{
      headers:{
        'Content-Type' : "multipart/form-data"
      }
    })
    return response
  },
  postData: async function (endPoint: any, postbody: any) {
    const response = await apiClient.request({
      url: `${endPoint}`,
      method: "POST",
      data: postbody
    })
    return response
  },
  postAuthData: async function (endPoint: any, postbody: any) {
    const response = await finopsClient.request({
      url: `${endPoint}`,
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: postbody,
    })
    return await response
  },
  postFinopsData: async function (endPoint: any, postbody: any, token: any) {
    const response = await finopsClient.request({
      url: `${endPoint}`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: postbody,
    })
    return await response
  },
  getDataByID: async function (endPoint: any, id: any) {
    const response = await apiClient.request({
      url: `${endPoint}${id}`,
      method: "GET",
    })
    return response.data.data
  },
  putData: async function (endPoint: any, postbody: any, id: any) {
    const response = await apiClient.request({
      url: `${endPoint}${id}`,
      method: "PUT",
      data: postbody
    })
    return response
  },
  postCallOptions: async function (url: any, options = {},postbody: any) {
    const response = await apiClient.request({
      url,
      method: "POST",
      data: postbody,
      ...options,
    })
    return response
  },
}
