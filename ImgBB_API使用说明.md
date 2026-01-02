# ImgBB 图床 API 集成说明 (前端直连版)

本项目集成了 ImgBB 服务，用于将本地上传的参考图转为公网 URL，以适配速创 AI 接口的要求。

---

## 1. 核心策略：前端直连 (Client-Side Direct Upload)

为了解决传统后端中转可能出现的 500 错误或跨域限制，本项目采用了**前端直连模式**。

- **优势**: 绕过服务器中转，直接由用户浏览器向 ImgBB 发起请求，稳定性更高，速度更快。
- **协议**: 使用 `multipart/form-data` 格式，支持跨域 (CORS)。

---

## 2. 鉴权与配置

- **API 端点**: `https://api.imgbb.com/1/upload`
- **鉴权方式**: 将 Key 拼接在 URL Query 中。


---

## 3. 实现细节 (`laozhangApi.js`)

前端通过 `FormData` 对象构造请求。以下是本项目中使用的核心代码逻辑：

```javascript
export const uploadImage = async (base64) => {
  const apiKey = 'bd521134b0e14ad15cf962e2d002544e';
  const formData = new FormData();
  
  // 必须剔除 Base64 的 Data-URI 前缀
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
  formData.append('image', cleanBase64);

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.data.url; // 返回公网直链
};
```

---

## 4. 常见问题排查 (Troubleshooting)

| 问题现象 | 可能原因 | 解决方法 |
| :--- | :--- | :--- |
| **upload failed (500)** | 后端中转接口失效 | **已通过前端直连策略解决**。无需再修复 `api/upload.js`。 |
| **Invalid Key** | 图床 Key 额度用光或失效 | 需在 `laozhangApi.js` 中更换新的 ImgBB Key。 |
| **图片过大上传慢** | 原始图片未压缩 | 本项目在上传前通过 `compressImage` 函数将图片限制在 1024px 左右，已极大优化此问题。 |

---

## 5. 安全建议

虽然直连模式下 API Key 暴露在前端代码中，但由于 ImgBB 免费 Key 权限有限且本应用主要用于个人/内部创作，该方案是稳定性的最优解。
