# 面试-basic

## Level 1

### **从浏览器地址栏输入url到显示页面的步骤?**

**基础版本**
1. 浏览器根据请求的URL交给DNS域名解析，找到真实IP，向服务器发起请求；
2. 服务器交给后台处理完成后返回数据，浏览器接收文件（HTML、JS、CSS、图象等）；
3. 浏览器对加载到的资源（HTML、JS、CSS等）进行语法解析，建立相应的内部数据结构（如HTML的DOM）；
4. 载入解析到的资源文件，渲染页面，完成。


**详细简版**
1. 从浏览器接收url到开启网络请求线程（这一部分可以展开浏览器的机制以及进程与线程之间的关系）

2. 开启网络线程到发出一个完整的http请求（这一部分涉及到dns查询，tcp/ip请求，五层因特网协议栈等知识）

3. 从服务器接收到请求到对应后台接收到请求（这一部分可能涉及到负载均衡，安全拦截以及后台内部的处理等等）

4. 后台和前台的http交互（这一部分包括http头部、响应码、报文结构、cookie等知识，可以提下静态资源的cookie优化，以及编码解码，如gzip压缩等）。

还有，单独拎出来的缓存问题，http的缓存（这部分包括http缓存头部，etag，catch-control等）

5. 浏览器接收到http数据包后的解析流程（解析html-词法分析然后解析成dom树、解析css生成css规则树、合并成render树，然后layout、painting渲染、复合图层的合成、GPU绘制、外链资源的处理、loaded和domcontentloaded等）

6. CSS的可视化格式模型（元素的渲染规则，如包含块，控制框，BFC，IFC等概念）

7. JS引擎解析过程（JS的解释阶段，预处理阶段，执行阶段生成执行上下文，VO，作用域链、回收机制等等）

8. 其它（可以拓展不同的知识模块，如跨域，web安全，hybrid模式等等内容）

**详细版**

1. 在浏览器地址栏输入URL
2. 浏览器查看缓存，如果请求资源在缓存中并且新鲜，跳转到转码步骤
	1. 如果资源未缓存，发起新请求
	2. 如果已缓存，检验是否足够新鲜，足够新鲜直接提供给客户端，否则与服务器进行验证。
	3. 检验新鲜通常有两个HTTP头进行控制Expires和Cache-Control：
		- HTTP1.0提供Expires，值为一个绝对时间表示缓存新鲜日期
		- HTTP1.1增加了Cache-Control: max-age=,值为以秒为单位的最大新鲜时间
3. 浏览器**解析URL**：获取协议，主机，端口，path
4. 浏览器**组装一个HTTP（GET）请求报文**
5. 浏览器**获取主机ip地址**，过程如下：
	1. 浏览器缓存
	2. 本机缓存
	3. hosts文件
	4. 路由器缓存
	5. ISP DNS缓存
	6. DNS递归查询（可能存在负载均衡导致每次IP不一样）
6. **打开一个socket 与目标IP地址、端口建立TCP链接**，三次握手。
7. TCP链接建立后**发送HTTP请求**。
8. 服务器接受请求并解析，将请求转发到服务程序，如虚拟主机使用HTTP Host头部判断请求的服务程序。
9. 服务器检查**HTTP请求头是否包含缓存验证信息**如果验证缓存新鲜，返回**304**等对应状态码。
10. 处理程序读取完整请求并准备HTTP响应，可能需要查询数据库等操作。
11. 服务器将**响应报文通过TCP连接发送回浏览器**。
12. 浏览器接收HTTP响应，然后根据情况选择关闭TCP连接或者保留重用，关闭TCP连接的四次握手
13. 浏览器检查响应状态吗：是否为1XX，3XX， 4XX， 5XX，这些情况处理与2XX不同
14. 如果资源可缓存，进行缓存
15. 对响应进行解码（例如gzip压缩）
16. 根据资源类型决定如何处理（假设资源为HTML文档）。解析HTML文档，构件DOM树，下载资源，构造CSSOM树，执行js脚本**。
17. 构建DOM树：
	1. **Tokenizing**：根据HTML规范将字符流解析为标记
	2. **Lexing**：词法分析将标记转换为对象并定义属性和规则
	3. **DOM construction**：根据HTML标记关系将对象组成DOM树
18. 解析过程中遇到图片、样式表、js文件，启动下载。
19. 构建CSSOM树：
	1. **Tokenizing**：字符流转换为标记流
	2.  **Node**：根据标记创建节点
	3.  **CSSOM**：节点创建CSSOM树
20. [根据DOM树和CSSOM树构建渲染树](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) :
	1. 从DOM树的根节点遍历所有**可见节点**，不可见节点包括：
		1. script,meta这样本身不可见的标签。
		2. 被css隐藏的节点，如display: none
	2. 对每一个可见节点，找到恰当的CSSOM规则并应用
	3. 发布可视节点的内容和计算样式
21. js解析：
	1. 浏览器创建Document对象并解析HTML，将解析到的元素和文本节点添加到文档中，此时document.readystate为loading
	2. HTML解析器遇到没有async和defer的脚本时，将他们添加到文档中，然后执行行内或外部脚本。这些脚本会同步执行，并且在脚本下载和执行时解析器会暂停。这样就可以用document.write()把文本插入到输入流中。
	3. 当解析器遇到设置了**async**属性的script时，开始下载脚本并继续解析文档。脚本会在它下载完成后尽快执行，但是解析器不会停下来等它下载。
	4. 当文档完成解析，document.readState变成interactive
	5. 所有 defer 脚本会按照在文档出现的顺序执行，延迟脚本能访问完整文档树
	6. 浏览器在Document对象上触发DOMContentLoaded事件
	7. 此时文档完全解析完成，浏览器可能还在等待如图片等内容加载，等这些内容完成载入并且所有异步脚本完成载入和执行，document.readState变为complete, window触发load事件。
22. 显示页面（HTML解析过程中会逐步显示页面）

### 关于gzip压缩
[探索HTTP传输中gzip压缩的秘密](https://segmentfault.com/a/1190000012800222)

### SSL/TLS协议运行机制
基本的运行过程：
握手阶段分成五步。

第一步，`Client`给出协议版本号、一个客户端生成的随机数（Client random），以及客户端支持的加密方法。

第二步，`Server`确认双方使用的加密方法，并给出数字证书、以及一个服务器生成的随机数（Server random）。

第三步，`Client`确认数字证书有效，然后生成一个新的随机数（Premaster secret），并使用数字证书中的公钥，加密这个随机数，发给`Server`。

第四步，`Server`使用自己的私钥，获取`Client`发来的随机数（即Premaster secret）。

第五步，`Client`和`Server`根据约定的加密方法，使用前面的三个随机数，生成"对话密钥"（session key），用来加密接下来的整个对话过程。

![SSL_Handshake](./images/SSL_Handshake.png)

握手阶段有三点需要注意。

（1）生成对话密钥一共需要三个随机数。

（2）握手之后的对话使用"对话密钥"加密（对称加密），服务器的公钥和私钥只用于加密和解密"对话密钥"（非对称加密），无其他作用。

（3）服务器公钥放在服务器的数字证书之中。


握手阶段用来建立SSL连接。如果出于某种原因，对话中断，就需要重新握手。

这时有两种方法可以恢复原来的session：一种叫做session ID，另一种叫做session ticket。

session ID的思想很简单，就是每一次对话都有一个编号（session ID）。如果对话中断，下次重连的时候，只要客户端给出这个编号，且服务器有这个编号的记录，双方就可以重新使用已有的"对话密钥"，而不必重新生成一把。

session ID是目前所有浏览器都支持的方法，但是它的缺点在于session ID往往只保留在一台服务器上。所以，如果客户端的请求发到另一台服务器，就无法恢复对话。session ticket就是为了解决这个问题而诞生的，目前只有Firefox和Chrome浏览器支持。

客户端不再发送session ID，而是发送一个服务器在上一次对话中发送过来的session ticket。这个session ticket是加密的，只有服务器才能解密，其中包括本次对话的主要信息，比如对话密钥和加密方法。当服务器收到session ticket以后，解密后就不必重新生成对话密钥了。

[图解SSL/TLS协议](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)


### HTTP状态码及其含义
- 1XX：信息状态码
	-  `100 Continue` 继续，一般在发送post请求时，已发送了http header之后服务端将返回此信息，表示确认，之后发送具体参数信息
- 2XX：成功状态码
	- `200 OK` 正常返回信息
	- `201 Created` 请求成功并且服务器创建了新的资源
	- `202 Accepted` 服务器已接受请求，但尚未处理
- 3XX：重定向
	- `301 Moved Permanently` 请求的网页已永久移动到新位置。
	- `302 Found` 临时性重定向。
	- `303 See Other` 临时性重定向，且总是使用 GET 请求新的 URI。
	- `304 Not Modified` 自从上次请求后，请求的网页未修改过。
- 4XX：客户端错误
	- `400 Bad Request` 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
	- `401 Unauthorized` 请求未授权。
	- `403 Forbidden` 禁止访问。
	- `404 Not Found` 找不到如何与 URI 相匹配的资源。
- 5XX: 服务器错误
	- `500 Internal Server Error`最常见的服务器端错误。
	- `503 Service Unavailable` 服务器端暂时无法处理请求（可能是过载或维护）。

### HTML5的离线储存怎么使用
在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

原理：HTML5的离线存储是基于一个新建的`.appcache`文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

在线的情况下，浏览器发现html头部有 `manifest` 属性，它会请求 `manifest` 文件，如果是第一次访问app，那么浏览器就会根据 `manifest` 文件的内容下载相应的资源并且进行离线存储。如果已经访问过app并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 `manifest` 文件与旧的 `manifest` 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线的情况下，浏览器就直接使用离线存储的资源。

### 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
`cookie`是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）

`cookie`数据始终在同源的http请求中携带（即使不需要），会在浏览器和服务器间来回传递。

`sessionStorage` 和 `localStorage` 不会自动把数据发给服务器，仅在本地保存。

**存储大小：**

`cookie` 数据大小不能超过4k。

`sessionStorage` 和 `localStorage` 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

**有期时间：**

`localStorage` 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据。

`sessionStorage` 数据在当前浏览器窗口关闭后自动删除。

`cookie` 在设置过期时间之前一直有效，即使窗口或浏览器关闭。


### Canvas和SVG有什么区别？
`svg`绘制出来的每一个图形的元素都是独立的DOM节点，能够方便的绑定事件或用来修改。`canvas`输出的是一整幅画布。

`svg`输出的图形是矢量图形，后期可以修改参数来自由放大缩小，不会是真和锯齿。而`canvas`输出标量画布，就像一张图片一样，放大会失真或者锯齿。

### viewport
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
// width    设置viewport宽度，为一个正整数，或字符串‘device-width’
// device-width  设备宽度
// height   设置viewport高度，一般设置了宽度，会自动解析出高度，可以不用设置
// initial-scale    默认缩放比例（初始缩放比例），为一个数字，可以带小数
// minimum-scale    允许用户最小缩放比例，为一个数字，可以带小数
// maximum-scale    允许用户最大缩放比例，为一个数字，可以带小数
// user-scalable    是否允许手动缩放
```

###  HTTP request报文结构是怎样的
1. 首行是Request-Line包括：请求方法，请求URI，协议版本，CRLF(回车)。
2. 首行之后是若干行请求头，包括general-header，request-header或者entity-header，每个一行以CRLF结束。
3. 请求头和消息实体之间有一个空格分隔。
4. 根据实际请求需要可能包含一个消息实体。

打开浏览器 Network 查看。
```
GET /3.1169b2a6cacf9af45186.hot-update.js HTTP/1.1
Host: localhost:8084
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
DNT: 1
Accept: */*
Referer: http://localhost:8084/n-book/interview/2018.html
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7
Cookie: _tact=4183429219
```

### HTTP response报文结构是怎样的
1. 首行是状态行包括：HTTP版本，状态码，状态描述，后面跟一个CRLF(回车)。
2. 首行之后是若干行响应头，包括：通用头部，响应头部，实体头部。
3. 响应头部和响应实体之间用一个空格分隔。
4. 最后是一个可能的消息实体

打开浏览器 Network 查看。
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Type: application/javascript; charset=UTF-8
Content-Length: 110055
Date: Tue, 19 Feb 2019 08:49:26 GMT
Connection: keep-alive
```

## Level 1 - CSS
### 什么是FOUC?如何避免
`Flash Of Unstyled Content`：用户定义样式表加载之前浏览器使用默认样式显示文档，用户样式加载渲染之后再从新显示文档，造成页面闪烁。

解决方法：把样式表放到文档的head。

### **如何创建块级格式化上下文(block formatting context)，BFC有什么用**
* 创建规则：
	* 根元素
	* 浮动元素（float不是none）
	* 绝对定位元素（position取值为absolute或fixed）
	* display取值为`inline-block`,`table-cell`,`table-caption`,`flex`,`inline-flex`之一的元素
	* overflow不是visible的元素
* 作用：
	* 可以包含浮动元素
	* 不被浮动元素覆盖
	* 阻止父子元素的margin折叠

[BFC - MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)


## Level 1 - JavaScript
### Javascript如何实现继承？

### 事件模型
- 冒泡型事件：当你使用事件冒泡时，子级元素先触发，父级元素后触发
- 捕获型事件：当你使用事件捕获时，父级元素先触发，子级元素后触发
- DOM事件流：同时支持两种事件模型：捕获型事件和冒泡型事件
- 阻止冒泡：在W3c中，使用stopPropagation（）方法；在IE下设置cancelBubble = true
- 阻止捕获：阻止事件的默认行为。在W3c中，使用preventDefault（）方法，在IE下设置window.event.returnValue = false
```js
// 阻止冒泡
event.stopPropagation();
```

### 手写ajax请求
简单版
```js
// 1. 创建连接
var xhr = null;
xhr = new XMLHttpRequest()
// 2. 连接服务器
xhr.open('get', url, true)
// 3. 发送请求
xhr.send(null);
// 4. 接受请求
xhr.onreadystatechange = function(){
	if(xhr.readyState == 4){
		if(xhr.status == 200){
			success(xhr.responseText);
		} else { // fail
			fail && fail(xhr.status);
		}
	}
}
```
详细版

[参考](https://zhuanlan.zhihu.com/p/27776535)

[XMLHttpRequest对象的属性](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
```js
<button class="button">发送请求</button>
const param = {
	method: "get",
	url:
		"https://openapi-mls.tutorabc.com.cn/OfficalWebAPI/LandingPageAPI/LandingPageExtend",
	async: true,
	timeout: 1000,
	data: {
		a: 1,
		b: 2,
		c: 3
	}
};
function ajax(param) {
	// 参数拼接需要通过 encodeURIComponent 进行编码
	let paramArr = [];
	let encodeData;
	if (param.data instanceof Object) {
		for (let key in param.data) {
			paramArr.push(
				encodeURIComponent(key) + "=" + encodeURIComponent(param.data[key])
			);
		}
		encodeData = paramArr.join("&");
	}
	// 假如是get请求的处理
	if (param.method === "get") {
			// 检测 url 中是否已存在 ? 及其位置
			const index = param.url.indexOf("?");
		if (index === -1) {
			param.url += "?";
		} else if (index !== param.url.length - 1) {
			param.url += "&";
		}
		// 拼接 url
		param.url += encodeData;
	}

	// 1. 创建XMLHttpRequest对象
	const xhr = new XMLHttpRequest();
	// 设置请求超时时间
	if (param.timeout && param.timeout > 0) {
		xhr.timeout = param.timeout;
	}
	return new Promise((resolve, reject) => {
		// 2. 连接服务器
		xhr.open(param.method, param.url, param.async);
		if (param.method === "get") {
			// 3. 发送请求
			xhr.send(null);
		} else {
			// post 方式需要设置请求头
			xhr.setRequestHeader(
				"Content-Type",
				"application/x-www-form-urlencoded;charset=UTF-8"
			);
			// 3. 发送请求
			xhr.send(encodeData);
		}
		// 4. 接受请求
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				console.log('readyState:' ,xhr.readyState, '请求已完成')
				// HTTP 状态在 200-300 之间表示请求成功
				// HTTP 状态为 304 表示请求内容未发生改变，可直接从缓存中读取
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					console.log("请求成功", xhr.responseText);
					resolve && resolve(xhr.responseText);
				} else {
					console.log("请求失败", xhr.responseText);
					reject && reject();
				}
			} else if (xhr.readyState === 0) {
				console.log('readyState:' ,xhr.readyState, '尚未调用 open 方法')
			} else if (xhr.readyState === 1) {
				console.log(xhr.readyState, '已调用 open 但还未发送请求（未调用 send）')
			} else if (xhr.readyState === 2) {
				console.log('readyState:' ,xhr.readyState, '已发送请求（已调用 send）')
			} else if (xhr.readyState === 3) {
				console.log('readyState:' ,xhr.readyState, '已接收到请求返回的数据')
			}
		};
		xhr.onerror = err => reject && reject(err);
		xhr.ontimeout = () => reject && reject("请求超时");
	});
}

var button = document.querySelector(".button");
button.addEventListener("click", function() {
	ajax(param).then(
		res => console.log("请求成功: " + res),
		err => console.log("请求失败: " + err)
	);;
});
```
### defer和async的区别

![1](./images/defer_async.jpg)

*蓝色线代表网络读取，红色线代表执行时间，这俩都是针对脚本的；绿色线代表 HTML 解析。*

`<script src="script.js"></script>`
没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。

`<script defer src="myscript.js"></script>`
有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。

`<script async src="script.js"></script>`
有 async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。

### 事件DOMContentLoaded和load的区别

**DOM文档加载的步骤为:**
1. 解析HTML结构。
2. 加载外部脚本和样式表文件。
3. 解析并执行脚本代码。
4. DOM树构建完成。//DOMContentLoaded
5. 加载图片等外部文件。
6. 页面加载完毕。//load

在第4步，会触发DOMContentLoaded事件。在第6步，触发load事件。

> 当初始HTML文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架完成加载。另一个不同的事件 load 应该仅用于检测一个完全加载的页面。 在使用 DOMContentLoaded 更加合适的情况下使用 load 是一个非常流行的错误，所以要谨慎。  ——MDN

用原生js可以这么写：
```js
// 不兼容老的浏览器，兼容写法见 [jQuery中ready与load事件](http://www.imooc.com/code/3253) ，或用jQuery
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
});
```
```js
window.addEventListener("load", function(event) {
    console.log("All resources finished loading!");
});
```
JQ这么写：
```js
// DOMContentLoaded
$(document).ready(function() {
    // ...代码...
});
```

```js
//load
$(document).load(function() {
    // ...代码...
});
```

### offsetWidth ,clientWidth 与 scrollWidth 的区别
- offsetWidth/offsetHeight返回值包含**content + padding + border**，效果与e.getBoundingClientRect()相同
- clientWidth/clientHeight返回值只包含**content + padding**，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight返回值包含**content + padding** + 溢出内容的尺寸

### javascript有哪些方法定义对象
- 对象字面量： var obj = {};
- 构造函数： var obj = new Object();
- Object.create(): var obj = Object.create(Object.prototype);

### 怎样添加、移除、移动、复制、创建和查找节点
创建新节点
```js
createDocumentFragment()    //创建一个DOM片段
createElement()   //创建一个具体的元素
createTextNode()   //创建一个文本节点
```
添加、移除、替换、插入
```js
appendChild()      //添加
removeChild()      //移除
replaceChild()      //替换
insertBefore()      //插入
```
查找
```js
getElementsByTagName()    //通过标签名称
getElementsByName()     //通过元素的Name属性的值
getElementById()        //通过元素Id，唯一性
```

### 怎么判断两个对象相等？
可以转换为字符串来判断
```js
obj = {
    a:1,
    b:2
}
obj2 = {
    a:1,
    b:2
}
obj3 = {
    a:1,
    b:'2'
}
JSON.stringify(obj)===JSON.stringify(obj2);//true
JSON.stringify(obj)===JSON.stringify(obj3);//false
```

### bind的用法，以及如何实现bind的函数和需要注意的点
bind的作用与call和apply相同，区别是call和apply是立即调用函数，而bind是返回了一个函数，需要调用的时候再执行。 一个简单的bind函数实现如下:
```js
Function.prototype.bind = function(ctx) {
	var fn = this;
	return function() {
		fn.apply(ctx, arguments);
	};
};
```

### BFC
[深入理解BFC](http://www.cnblogs.com/xiaohuochai/p/5248536.html)