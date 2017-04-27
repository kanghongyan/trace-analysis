# 统计分析系统
- 适用于高计算量的并发任务的nodejs多进程架构，详见app.js及 bin/www
- 高耗时请求使用websocket绕过Nginx应用层 timeout 404拦截
- 接受打点请求，支持
  - sendBeacon<post请求无回调>; 
  - document.createElement(script)<get请求，max 300ms触发回调>; 
  - new Image<兜底：同步请求，不建议使用。 参考：[mozilla文档](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)>
- 写文件
- vue bootstrap展示数据
