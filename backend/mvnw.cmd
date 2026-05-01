@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

for %%i in ("%~dp0.") do set MAVEN_PROJECTBASEDIR=%%~fi
if "%MAVEN_PROJECTBASEDIR%"=="" set MAVEN_PROJECTBASEDIR=.

set WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  echo Maven Wrapper jar not found. Please download it to .mvn\wrapper\maven-wrapper.jar
  exit /b 1
)

if defined JAVA_HOME (
  "%JAVA_HOME%\bin\java.exe" -classpath "%WRAPPER_JAR%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
) else (
  java -classpath "%WRAPPER_JAR%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
)
endlocal

