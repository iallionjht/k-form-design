import Vue from "vue";
import axios from "axios";
/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/jeecg-boot'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */
const apiBaseUrl = "http://127.0.0.1:1880";
//console.log("apiBaseUrl= ",apiBaseUrl)
// 创建 axios 实例
const service = axios.create({
  baseURL: apiBaseUrl, // api base_url
  timeout: 9000 // 请求超时时间
});

const err = error => {
  if (error.response) {
    const data = error.response.data;
    console.log("------异常响应------", error.response.status);
    switch (error.response.status) {
      case 403:
        Vue.prototype.$message.error({
          message: "系统提示",
          description: "拒绝访问",
          duration: 4
        });
        break;
      case 500:
        {
          console.log("------error.response------", error.response);
          // update-begin- --- author:liusq ------ date:20200910 ---- for:处理Blob情况----
          const type = error.response.request.responseType;
          if (type === "blob") {
            blobToJson(data);
            break;
          }
        }
        break;
      case 404:
        Vue.prototype.$message.error({
          message: "系统提示",
          description: "很抱歉，资源未找到!",
          duration: 4
        });
        break;
      case 504:
        Vue.prototype.$message.error({
          message: "系统提示",
          description: "网络超时"
        });
        break;
      case 401:
        Vue.prototype.$message.error({
          message: "系统提示",
          description: "未授权，请重新登录",
          duration: 4
        });
        break;
      default:
        Vue.prototype.$message.error({
          message: "系统提示",
          description: data.message,
          duration: 4
        });
        break;
    }
  } else if (error.message) {
    if (error.message.includes("timeout")) {
      Vue.prototype.$message.error({
        message: "系统提示",
        description: "网络超时"
      });
    } else {
      Vue.prototype.$message.error({
        message: "系统提示",
        description: error.message
      });
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.method == "get") {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(response => {
  return response.data;
}, err);

/**
 * Blob解析
 * @param data
 */
function blobToJson(data) {
  const fileReader = new FileReader();
  fileReader.onload = function() {
    try {
      const jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
      console.log("jsonData", jsonData);
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      console.log("blob解析fileReader返回err", err);
    }
  };
  fileReader.readAsText(data);
}

export { service as axios };
