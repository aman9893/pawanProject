
@echo %path%
SET PATH=%PATH%;C:\Program Files\7-Zip
@echo %path%
if %DEPLOYMENT_GROUP_NAME%==DEV (7z x C:\codedeploy\rtw2.zip -oC:\Deployments\rtw2-deploy\dev)
if %DEPLOYMENT_GROUP_NAME%==UAT (7z x C:\codedeploy\rtw2.zip -oC:\Deployments\rtw2-deploy\uat)
if %DEPLOYMENT_GROUP_NAME%==PROD (7z x C:\codedeploy\rtw2.zip -oC:\Deployments\rtw2-deploy\prod)

Del /S /Q C:\codedeploy\rtw2.zip
iisreset /restart
