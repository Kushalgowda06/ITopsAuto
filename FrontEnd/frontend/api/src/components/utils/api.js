import { apiClient, finopsClient } from '../../api/customAxios'
import axios from 'axios'

export const Api = {
  getData: async function (endPoint) {
    const response = await apiClient.request({
      url: `${endPoint}`,
      method: "GET",
    })
    return response.data.data
  },
  getCall: async function (url) {
    const response = await apiClient.get(url)
    return response;
  },
  getCallOptions: async function (url, options = {}, postbody = {}) {
    const response = await apiClient.request({
      url,
      method: "GET",
      data: postbody,
      ...options,
    });
    return response;
  },
  
  // Dedicated function for ServiceNow authentication
  serviceNowAuth: async function (url, options = {}) {
    // Use raw axios to avoid interference from apiClient interceptors
    const response = await axios.request({
      url,
      method: "GET",
      timeout: 30000,
      ...options,
    });
    return response;
  },
  getCallAuth: async function (url) {
    const response = await apiClient.get(url, {
      headers: {
        'Authorization': ' key 3cDr1pIarR2GaUUdZjWC29waPPyL30v85JMcZsoP',
      },
    }
    );
    return response;
  },
  postCall: async function (url, postbody) {
    const response = await apiClient.post(url, postbody)
    return response
  },
  postImage: async function (url, postbody) {
    const response = await apiClient.post(url, postbody ,{
      headers:{
        'Content-Type' : "multipart/form-data"
      }
    })
    return response
  },
  postData: async function (endPoint, postbody) {
    const response = await apiClient.request({
      url: `${endPoint}`,
      method: "POST",
      data: postbody
    })
    return response
  },
  postAuthData: async function (endPoint, postbody) {
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
  postFinopsData: async function (endPoint, postbody, token) {
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
  getDataByID: async function (endPoint, id) {
    const response = await apiClient.request({
      url: `${endPoint}${id}`,
      method: "GET",
    })
    return response.data.data
  },
  putData: async function (endPoint, postbody, id) {
    const response = await apiClient.request({
      url: `${endPoint}${id}`,
      method: "PUT",
      data: postbody
    })
    return response
  },
  postCallOptions: async function (url, options = {},postbody) {
    const response = await apiClient.request({
      url,
      method: "POST",
      data: postbody,
      ...options,
    })
    return response
  },
  postTechAssistData: async function (endPoint, postbody, token) {
    const response = await apiClient.request({
      url: `${endPoint}`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: postbody,
    })
    return await response
  },
} 