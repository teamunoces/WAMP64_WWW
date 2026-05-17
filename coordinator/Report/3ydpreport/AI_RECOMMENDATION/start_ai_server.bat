@echo off
set "PYTHONPATH=C:\Users\ELSIE DANUCO\AppData\Roaming\Python\Python313\site-packages;%PYTHONPATH%"
cd /d "C:\wamp64\www\SYSTEM_VERSION_!\coordinator\Report\3ydpreport\AI_RECOMMENDATION"
"c:\python313\python.exe" "AI.py" >> "ai_server.log" 2>&1
