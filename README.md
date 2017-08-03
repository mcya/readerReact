###### 如需转载，请注明出处。


#### 推荐chrome安装如下插件辅助开发:
- React Developer Tools
- Redux DevTools
- livereload

#### 本地安装
```
npm install
npm start
```

```
cnpm install
cnpm start
```

#### 本地访问地址
```
http://localhost:8000
```


#### [页面效果预览，点这里](./showImg/README.md)



## 实现功能
- [x] 移动阅读APP首页(宫格模式和列表模式)
- [x] 移动阅读APP阅读(皮肤[字体/背景]、章节切换、夜间模式、目录)
- [x] 移动阅读APP换源(内容换源)
- [x] 移动阅读APP搜索(历史记录、详细列表)
- [x] 移动阅读APP详情(用户操作和详细信息)
- [x] 下拉刷新列表
- [x] 分享复制
- [x] 阅读设置本地缓存
- [x] 阅读进度本地缓存
- [x] 搜索历史本地缓存

下拉首页小说列表可以刷新小说章节列表信息缓存！

## 目录结构
```
|
|—— api API说明
|—— cfg webpack配置
|—— dist 服务端
| |—— app.js 服务端启动入口文件
| |—— assets 打包后的资源文件
| |—— static 静态资源
| |__ index.html 网页入口
|
|——src 资源文件
| |—— images 图片资源
| |—— components 组件库
| |—— method  一些自定义方法，目前是过滤器
| |—— filters 自定义过滤器
| |—— redux
| | |—— action
| | |—— reducer
| | |__ store
| |—— router 路由管理
| |—— styles 样式文件
| |__ index.jsx 入口
|_________________________________________________

```

## 一些注意事项
项目中使用追书神器的接口，需要使用`http-proxy-middleware`进行转发，开发环境下需要在`cfg/base.js`中的`dev`中添加下列配置即可
```
proxy: {
  '/api': {
    target: 'http://api.zhuishushenqi.com/',
    pathRewrite: {'^/api' : '/'},
    changeOrigin: true
  },
  '/chapter': {
    target: 'http://chapter2.zhuishushenqi.com/',
    pathRewrite: {'^/chapter' : '/chapter'},
    changeOrigin: true
  }
}
```

实际环境中，服务器端配置
```
var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();
app.use('/static', express.static('static'));
app.use('/assets', express.static('assets'));
app.use('/api', proxy({
  target: 'http://api.zhuishushenqi.com/',
  pathRewrite: {'^/api' : '/'},
  changeOrigin: true
}
));

app.use('/chapter', proxy({
  target: 'http://chapter2.zhuishushenqi.com/',
  pathRewrite: {'^/chapter' : '/chapter'},
  changeOrigin: true
}
));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(3001);
```


React 开发规范
========================
###### React内置类型
```
React.PropTypes类型列表 (任何类型在最后加上isRequired则此在使用此组件时必须赋值)
React.PropTypes.array,//数组类型
React.PropTypes.bool,//布尔值类型
React.PropTypes.func,//函数类型
React.PropTypes.number,//数值类型
React.PropTypes.object,//JS对象类型
React.PropTypes.string, //字符串类型
React.PropTypes.node, // 所有可以被渲染的对象    
React.PropTypes.element,  // React 元素
React.PropTypes.oneOf(['News', 'Photos']), //只接受其中一个值的枚举类型
React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number     ]),
React.PropTypes.arrayOf(React.PropTypes.number), // 指定类型组成的数组
// 指定类型的属性构成的对象
 React.PropTypes.objectOf(React.PropTypes.number),
// 特定形状参数的对象
 React.PropTypes.shape({
  color: React.PropTypes.string,
  fontSize: React.PropTypes.number
}),
```
###### React生命周期

  |  function  |  说明  |
  |------------|------------------------------|
  |  componentWillMount  |  挂载前  |
  |  componentDidMount  |  挂载后  |
  |  componentWillUpdate  |  更新前  |
  |  componentDidUpdate  |  更新后  |
  |  componentWillReceiveProps  |  当接收到props时		参数:nextProps  |
  |  shouldComponentUpdate  |  是否执行更新  |
  |  componentWillUnmount  |  卸载  |
	




###### 如需转载，请注明出处。
