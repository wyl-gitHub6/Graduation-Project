/*
 * @Description: 跨域配置
 * @Author: Wangyl
 * @Date: 2021-10-05 17:50:03
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-05-09 19:02:27
 */
/* 官方提供的解决跨域问题 */
// 跨域配置
module.exports = {
  devServer: {    //设置本地默认端口
    port: 1234,   //更改前端项目端口
    proxy: {      //设置代理，必须填
      '/api': {  //设置拦截器  拦截器格式   斜杠+拦截器名字，名字随意
        target: 'http://localhost:8080',          //代理的目标地址
        //target: http://192.168.153.133:9000,      //代理的目标地址 docker部署地址
        //target: "http://score.system.com",          //nginx反向代理地址
        changeOrigin: true,              //是否设置同源
        pathRewrite: {                   //路径重写
          '/api': ''                     //选择忽略拦截器里面的单词
        }
      }
    }
  },

}
