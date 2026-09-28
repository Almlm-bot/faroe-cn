@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  探访法罗站点启动中...
echo  打开浏览器访问: http://127.0.0.1:5173/
echo  关闭本窗口即停止服务
echo.
start "" "http://127.0.0.1:5173/"
python -m http.server 5173
if errorlevel 1 (
  echo Python 不可用，尝试使用 npx serve...
  npx --yes serve -l 5173 .
)
pause
