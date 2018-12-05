# Vue HTML5 History 模式 (IIS)配置文件

[HTML5 History 模式 · vue-router](https://router.vuejs.org/zh-cn/essentials/history-mode.html)

这里的IIS后端配置文件是有问题的。

正确的如下，把web.config放到项目的index.html同级：

web.config 文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="dynamic routes">
          <match url="(.*)" />
          <conditions>
           <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```