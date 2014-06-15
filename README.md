# Brynhild Project

### 简介

这是前端项目，使用 AngularJS 作为前端框架，利用 api 进行通讯。

### 使用方法

```bash
$ npm install -g grunt-cli bower
$ cd Brynhild
$ npm install
$ bower install

# 运行开发环境
$ grunt server
```

### 代码规范

+ 使用空格代替 tab

+ Javascript

  - 缩进：2空格

  - 回调函数超过3层的，请考虑使用 async, eventproxy 等工具。

  - 其他想到再说

+ AngularJS

  - 目前在 `controller` 中使用 `$scope` 取代 `this` 来暴露变量，主要考虑到 `$scope` 在可读性上会好一点, 使用 `this` 的话需要配合 `Controller as value` 来使用，我觉得对初学 AngularJS 的人来说会不太友好。

+ HTML

  - 缩进：4空格

  - 为了提高可读性，请把 HTML 属性折行

  - 其他想到再说

+ CSS

  - 缩进：4空格

  - 另外我打算使用 CSS 预处理器，把各模块完全分离。（目前预订使用 LESS）

  - 其他想到再说

### 提交规范

+ 确保每个 commit 都是独立的，而且与你的 commit message 相对应。

+ 如果一个 commit 里面修改了很多东西，请把这个 commit 分拆成若干个 commit。

+ 我习惯用 [AngularJS commit message conversation](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w) 来确定我的 commit message 格式。

### 欢迎 Pull Requests & Issues.
