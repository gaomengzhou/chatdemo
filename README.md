# 哈希聊天室

# 插件和配置（适用于 VSCODE）

使用 [ESLint] https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint  
使用 [Prettier] - Code formatter https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode  
禁用或删除 [TSLint] TSLint 已经被弃用，请使用 ESLint  
编辑器 [VSCODE] settings.json 设置要包括下面这些  
{  
 "editor.codeActionsOnSave": {  
 "source.organizeImports": false,  
 "source.fixAll": true,  
 "source.fixAll.stylelint": true  
},  
 "files.eol": "\n",  
 "editor.defaultFormatter": "esbenp.prettier-vscode",  
 "editor.formatOnSave": true,  
}

# 样式文件命名必须是\*.module.scss 才能导入

例子: xxx.module.scss

# 开始创建 React 应用程序

这个项目是用 [Create React App](https://github.com/facebook/create-react-app) 引导的。

## 可用脚本

在项目目录中，您可以运行：

### `yarn start`

在开发模式下运行应用程序.\
打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

如果您进行编辑，页面将重新加载.\
您还将在控制台中看到任何 lint 错误。

### `yarn test`

在交互式观看模式下启动测试运行器.\
有关详细信息，请参阅有关 [运行测试](https://facebook.github.io/create-react-app/docs/running-tests) 的部分。

### `yarn build`

将用于生产的应用程序构建到 `build` 文件夹.\
它在生产模式下正确捆绑 React 并优化构建以获得最佳性能。

构建被缩小，文件名包括哈希.\
您的应用已准备好部署！

有关详细信息，请参阅有关 [部署](https://facebook.github.io/create-react-app/docs/deployment) 的部分。

### `yarn eject`

**注意：这是一种单向操作。一旦你`eject`，你就不能回去了！**

如果您对构建工具和配置选择不满意，您可以随时“弹出”。此命令将从您的项目中删除单个构建依赖项。

相反，它会将所有配置文件和传递依赖项（webpack、Babel、ESLint 等）直接复制到您的项目中，以便您完全控制它们。除了 `eject` 之外的所有命令仍然有效，但它们将指向复制的脚本，以便您可以调整它们。在这一点上，你是你自己的。
你不必使用 `eject`。精选功能集适用于中小型部署，您不应该觉得有义务使用此功能。但是，我们知道，如果您在准备好后无法对其进行自定义，则该工具将毫无用处。

## 学到更多

您可以在 [创建 React 应用程序文档](https://facebook.github.io/create-react-app/docs/getting-started) 中了解更多信息。

要学习 React，请查看 [React 文档](https://reactjs.org/)。
