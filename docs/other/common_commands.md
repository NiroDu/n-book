
# OSX上的一些常用命令

<!-- more -->
## Mac端
### 将系统隐藏文件显示出来：
```bash
$ defaults write com.apple.Finder AppleShowAllFiles YES 
$ killall Finder
```

### 在Finder顶部看见完整的路径地址
```bash
$ defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
```
『复制路径可以用 Option+Command+C』 在终端中 Command+V 粘贴即可。

### 安全和隐私-调出“任何来源”
```bash
sudo spctl --master-disable
```

### 查看当前目录下各个文件和子目录各占多少空间
```bash
du -sh *
```

### 使用sips命令批量处理图片。
如果你想批量修改一批图片（尺寸、旋转、反转等），但是你不会或没有PS，怎么办呢？使用sips命令可以高效完成这些功能，例如：

把当前用户图片文件夹下的所有JPG图片宽度缩小为800px，高度按比例缩放
```bash
sips -Z 800 ~/Pictures/*.JPG
```

顺时针旋转90˚
```bash
sips -r 90 ~/Pictures/*.JPG
```

垂直反转
```bash
sips -f vertical ~/Pictures/*.JPG
```

更多命令可以用sips -h查看

###  系统默认截图格式是png，你可以通过如下命令修改截图文件类型，例如：
```bash
defaults write com.apple.screencapture type -string JPEG
```


### mdfind是一个非常灵活的全局搜索命令，类似Spotlight的命令行模式，可以在任何目录执行文件名、文件内容进行检索，例如：

搜索文件内容或文件名包含Sword的文件
```bash
mdfind Sword    
```

在桌面上搜索文件内容或文件名包含Sword的文件
```bash
mdfind -onlyin ~/Desktop Sword
```

统计搜索到的结果
```bash
mdfind -count -onlyin ~/Desktop Sword
```

搜索文件名包含Sword的文件
```bash
mdfind -name Sword
```
查看本机IP
```
curl ip.cn
```
###  打开终端输入history，所有的历史命令都会显示出来，想找某一条执行过的命令，还可以这样：
 ```bash
 history|grep apache
 ```

 找到左边的命令编号（例如时1001），在终端输入
 ```bash
 !1001
 ```
 就可以执行原来那条命令了。

## Sass
### 单个sass文件编译
```
$ sass style.scss style.css
```

## 文件操作命令
```bash
$ ls -l  # 列出文件夹内容(详情模式)
$ ls -al  # 列出文件夹内容(包括隐藏文件)
$ touch <file>  # 新建文件
$ mkdir <dir>  # 新建文件夹
$ rm [-rf] <file/dir>  # 删除文件
$ mv <source> <target>  # 修改文件名字
$ cp [-R] <source> <target>  # 复制文件
$ ln -s  <source> <target>  # 建立符号链接
$ rar x <file> #解压
$ tar -zxvf <file>
$ unzip  <file>
```

## 权限相关
```bash
$ sudo chown -R <owner>:<group>  <file>  # 修改表文件ownership/group
$ sudo chmod 600 <file>  # 只有所有者有读和写的权限
$ sudo chmod 644 <file>  # 所有者有读和写的权限
$ sudo chmod 700 <file>  # 只有所有者有读和写以及执行的权限
$ sudo chmod 666 <file>  # 每个人都有读和写的权限
$ sudo chmod 777 <file>  # 开放全部权限
```

```bash
$ cat  # 由第一行开始显示档案内容
$ tac  # 从最后一行开始显示，可以看出 tac 是 cat 的反向显示！
$ nl  # 显示的时候，随便输出行号！
$ more  # 一页一页的显示档案内容
$ less  # 与 more 类似，但是比 more 更好的是，他可以[pg dn][pg up]翻页！
$ head  # 查看头几行
$ tail  # 查看尾几行
$ ctrl-a  # 在终端中跳到命令最前面
$ ctrl-e  # 在终端中跳到命令最后面
$ ctrl-x e # 打开默认编辑器
$ man <something> #帮助
$ !!  # 上一条命令
$ cd -  # 回到上一次目录
$ pwd  # 查看路径
$ ps -A | grep -i apache2  # 查找相关进程
$ kill 1285 (to kill the process apache2)  # 杀死进程
$ cal  # 日历
$ date  # 日期
$ bc  # 计算器
```