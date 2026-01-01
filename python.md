```
# 导入requests库
import requests
 
# 设置url
url = 'https://api.wuyinkeji.com/api/img/nanoBanana-pro?key=tLdPCRBfuA4nK1Exu9h9lNh2a6'
 
# 发送post请求
response = requests.post(url, data={'key1': 'value1', 'key2': 'value2'})
 
# 获取响应内容
result = response.json()
 
# 打印结果
print(result)
```
