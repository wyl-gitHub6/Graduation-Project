import axios from 'axios'
import router from '../router'
const request = axios.create({
  timeout: 5000  //超时时间
})


// request 拦截器
request.interceptors.request.use(config => {
  //请求头的编码格式
  config.headers['Content-Type'] = 'application/json;charset=utf-8';

  //广阔天地，大有作为！！！
  /*if(null == sessionStorage.getItem("user")){
    router.push('/')
  }*/

  return config
}, error => {
  return Promise.reject(error)
});


// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
        response => {
          let res = response.data;
          // 如果是返回的文件
          if (response.config.responseType === 'blob') {
            return res
          }
          // 兼容服务端返回的字符串数据
          if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
          }
          return res;
        },
        error => {
          console.log('err' + error) // for debug
          return Promise.reject(error)
        }
)

export default request
