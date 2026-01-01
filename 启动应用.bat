@echo off
chcp 65001 >nul
echo ==========================================
echo       🍌 Banana AI 图像生成工具启动中...
echo ==========================================
echo.

cd /d "%~dp0"

IF NOT EXIST "node_modules" (
    echo 首次运行,正在安装依赖...
    npm install
)

echo 正在启动服务...
echo 请勿关闭此窗口,应用正在运行中。
echo.

:: 启动浏览器
start http://localhost:5173

:: 启动开发服务器
npm run dev
