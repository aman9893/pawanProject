if %DEPLOYMENT_GROUP_NAME%==DEV (Del /S /Q C:\Deployments\rtw2-deploy\dev\*)
if %DEPLOYMENT_GROUP_NAME%==UAT (Del /S /Q C:\Deployments\rtw2-deploy\uat\*)
if %DEPLOYMENT_GROUP_NAME%==PROD (Del /S /Q C:\Deployments\rtw2-deploy\prod\*)
