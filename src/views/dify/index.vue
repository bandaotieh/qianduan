<template>
    <div style="line-height: 5vh;padding:2vh 5vw;">
        <h2>一、Dify简介</h2>
     <div>Dify 是一个开源的大语言模型（LLM）应用开发平台，旨在让构建 AI 应用变得更加简单、高效。通过直观的可视化界面，让开发者或非技术人员都能像搭积木一样，快速搭建出聊天机器人、智能助手、自动化工作流等 AI 应用。</div>
     <h2>二、Dify安装教程</h2>
      <h3>2.1下载Docker Desktop</h3>
      下载地址:
        <a href="https://docs.docker.com/desktop/setup/install/windows-install/">https://docs.docker.com/desktop/setup/install/windows-install/</a>
      <img src="../../assets/dify/docker.png" alt="docker" style="zoom:80%;">
      <h3>2.2系统要求</h3>
      <div>注意：有两种安装方式：WSL或者Hyper-V。各有优缺点，具体取决于配置和使用场景</div>
      <h3>基于WSL安装(默认方式)</h3>
      <img src="../../assets/dify/wsl.png" alt="wsl" style="zoom:150%;">
      <div>基于Haper-v安装</div>
<img src="../../assets/dify/hvper.png" alt="hvper">
      <h3>2.3启用虚拟机管理程序</h3>

      <div>控制面板 ---》 程序 -----》 启用或关闭window功能</div>
      <img src="../../assets/dify/xuni.png" alt="xuni" style="zoom:100%;">
<h3>
 2.4 WSL验证和设置
</h3>
<div>通过终端运行以下命令来验证安装的版本是否满足系统要求</div>
<div>wsl --version</div>
<div>如未显示版本详细信息，则可能正在使用wsl的默认版本，此版本不支持最新功能，必须更新</div>
<div>更新方法：
  wsl --install,wsl --update
</div>
<h3>2.5安装docker</h3>
<h3>2.6设置资源下载位置</h3>
      <img src="../../assets/dify/docker-file.png" alt="file" style="zoom:80%;">
<h3>2.7设置镜像</h3>
            <CodeBlock :code="codeBlock69" language="javascript" :show-run="true" @run="executeCode"  style="width: 60%;margin-left: 20%;"/>
            <div>替换掉原有的</div>
<img src="../../assets/dify/jingxiang.png" alt="jingxiang">
<h3>2.8验证docker</h3>
<div>打开cmd执行以下命令：docker --version</div>
<div>拉取镜像操作 ： docker pull hello-world</div>
<div>拉取成功显示</div>
      <img src="../../assets/dify/world.png" alt="world" >
 <h3>三、克隆Didy仓库</h3>
    <div>git clone https://github.com/langgenius/dify.git</div>
    <h2>3.1进入Docker目录(配置环境)</h2>
    <div>进入到dify文件夹下的docker文件夹，将env.example文件名改为.env</div>
    <div>
    使用命令
      cd  dify/docker <br>
      cd .env.example .env
    </div>
  <h2>启动Dify</h2>
  <div>进入dify文件夹找到docker文件，进入终端，输入以下命令： docker compose up -d</div>
  <div>
    修改.env文件的80端口，改成 ：<br>
NGINX_PORT=8080； <br>
EXPOSE_NGINX_PORT=8080<br>

然后docker compose down <br>
docker compose up -d --build<br>
最后http://localhost:8080/signin访问
  </div>
    </div>

    </template>
    <script setup lang="ts">
    /////代码块
import CodeBlock from '../../components/CodeBlock .vue'
const codeBlock69 =`
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
`
const executeCode = () => {




}
  </script>