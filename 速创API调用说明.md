# 速创 API 调用说明文档 (NanoBanana-pro)

本手册涵盖了如何接入和调用速创 API 的 **NanoBanana-pro** 图像生成服务。该服务为**异步模式**。

---

## 1. 基础信息

- **API 域名**: `https://api.wuyinkeji.com`
- **认证方式**: 统一使用参数 `key` (即你的 API Key)
- **请求格式**: `application/x-www-form-urlencoded` (Form Data)
- **响应格式**: `application/json`

---

## 2. 第一步：提交生成请求

提交提示词和配置。

- **接口地址**: `/api/img/nanoBanana-pro`
- **请求方式**: `POST`

### 请求参数 (Form Data)

| 名称 | 必填 | 类型 | 示例值 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| **key** | 是 | string | `此处填写你的API_KEY` | 你的 API 密钥 |
| **prompt** | 是 | string | "一只猫" | 描述图像的文本指令 |
| **img_url** | 否 | string/array | `["url1"]` | 参考图 URL 数组 (JSON 格式) |
| **aspectRatio** | 否 | string | `16:9` | 比例 (1:1, 16:9, 9:16, 4:3, 3:4 等) |
| **imageSize** | 否 | string | `4K` | 大小 (1K, 2K, 4K) |

### 响应示例
```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "id": 2200303
  }
}
```
> [!IMPORTANT]
> 记录返回的 `id`，它是下一步查询结果的唯一凭证。

---

## 3. 第二步：查询生成结果 (轮询)

由于生成图片需要处理时间（通常 10s-60s），你需要轮询此接口获取结果。

- **接口地址**: `/api/img/drawDetail`
- **请求方式**: `GET`

### 请求参数 (Query)

| 名称 | 必填 | 说明 |
| :--- | :--- | :--- |
| **key** | 是 | 你的 API 密钥 |
| **id** | 是 | 第一步获取的任务 ID |

### 响应示例 & 状态码 (`data.status`)

| 状态码 | 含义 |
| :--- | :--- |
| **0** | 排队中 (继续等待) |
| **1** | 生成中 (继续等待) |
| **2** | **成功** ✅ (可获取 `image_url`) |
| **3** | **失败** ❌ (检查 `fail_reason`) |

**成功响应示例:**
```json
{
  "code": 200,
  "msg": "成功",
  "data": {
    "status": 2,
    "prompt": "...",
    "image_url": "https://cdn.com/xxx.png"
  }
}
```

---

## 4. 示例代码 (Python)

```python
import requests
import time

API_KEY = "你的_API_KEY"
BASE_URL = "https://api.wuyinkeji.com"

# 1. 提交任务
submit_resp = requests.post(f"{BASE_URL}/api/img/nanoBanana-pro", data={
    "key": API_KEY,
    "prompt": "A futuristic city under the ocean, 4K resolution",
    "aspectRatio": "16:9",
    "imageSize": "4K"
}).json()

if submit_resp["code"] == 200:
    task_id = submit_resp["data"]["id"]
    print(f"任务提交成功，ID: {task_id}")

    # 2. 轮询结果
    while True:
        detail_resp = requests.get(f"{BASE_URL}/api/img/drawDetail", params={
            "key": API_KEY,
            "id": task_id
        }).json()

        status = detail_resp["data"]["status"]
        if status == 2:
            print(f"生成成功! URL: {detail_resp['data']['image_url']}")
            break
        elif status == 3:
            print("生成失败")
            break
        
        print("正在生成中...")
        time.sleep(3) # 建议间隔2-3秒
```

---

## 5. 常见问题

1. **参数报错**: 请确保 `aspectRatio` 和 `imageSize` 是驼峰命名。
2. **下载分辨率**: 如果需要 2K/4K，请务必设置 `imageSize` 为 `2K` 或 `4K`。
3. **有效期**: `image_url` 指向速创官方 CDN，建议生成后及时下载转储。
