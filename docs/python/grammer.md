#  语法
> 熟悉 JavaScript 的基础上，对Python的学习。

##  标准数据类型
Python3 中有六个标准的数据类型：

`Number（数字）`
`String（字符串）`
`List（列表）`
`Tuple（元组）`
`Set（集合）`
`Dictionary（字典）`

Python3 的六个标准数据类型中：
不可变数据（3 个）：Number（数字）、String（字符串）、Tuple（元组）；
可变数据（3 个）：List（列表）、Dictionary（字典）、Set（集合）。

##  数字(Number)类型
python中数字有四种类型：整数、布尔型、浮点数和复数。
int (整数), 如 1, 只有一种整数类型 int，表示为长整型，没有 python2 中的 Long。
bool (布尔), 如 True。
float (浮点数), 如 1.23、3E-2
complex (复数), 如 1 + 2j、 1.1 + 2.2j

内置的` type()`函数可以用来查询变量所指的对象类型。

##   字符串(String)
反斜杠可以用来转义，使用r可以让反斜杠不发生转义。
如 `r"this is a line with \n"` 则`\n`会显示，并不是换行。
这里的 `r` 指 raw，即 raw string。

转义符 `\`

字符串可以用 `+` 运算符连接在一起，用 `*` 运算符重复。

Python 中的字符串有两种索引方式，从左往右以 `0` 开始，从右往左以 `-1` 开始。

字符串的截取的语法格式如下：`变量[头下标:尾下标:步长]`

####  字符串运算符
a值为字符串 "Hello"，b变量值为 "Python"

|操作符        |      描述    |    例子与结果|
|  ----  | ----  |----  |
|+            |      字符串连接    |   a + b 输出结果： HelloPython|
|*        |      重复输出字符串	|  a*2 输出结果：HelloHello  |
|[]	| 通过索引获取字符串中字符	|a[1] 输出结果 e|
|[ : ]	| 截取字符串 |	a[1:4] 输出结果 ell|
|in	| 成员运算符 - 如果字符串中包含给定的字符返回 True | 'H' in a 输出结果 True|
|not in	| 成员运算符 - 如果字符串中不包含给定的字符返回 True | 'M' not in a 输出结果 True|

####  字符串格式化
```python
print("我叫%s，今年%d岁!" % ('小明', 10))
##  我叫小明，今年10岁!
```

使用format函数：
```python
print("网站名：{name}, 地址 {url}".format(name="菜鸟教程", url="www.runoob.com"))
 
##  通过字典设置参数
site = {"name": "菜鸟教程", "url": "www.runoob.com"}
print("网站名：{name}, 地址 {url}".format(**site))
 
##  通过列表索引设置参数
my_list = ['菜鸟教程', 'www.runoob.com']
print("网站名：{0[0]}, 地址 {0[1]}".format(my_list))  ##  "0" 是必须的

##  输出结果皆为：
##  网站名：菜鸟教程, 地址 www.runoob.com
```

##   List（列表）
列表截取的语法格式如下：`变量[头下标:尾下标:步长]`
![](./_image/2019-09-16/2019-09-16-18-47-58.jpg)
**什么是步长？**
以下实例在索引 1 到索引 4 的位置并设置为步长为 2（间隔一个位置）来截取字符串：
![](./_image/2019-09-16/2019-09-16-18-49-49.jpg)

如果步长为负数表示逆向读取，以下实例用于翻转字符串：
```python
def reverseWords(input):

    ##  通过空格将字符串分隔符，把各个单词分隔为列表
    inputWords = input.split(" ")
 
    ##  翻转字符串
    ##  假设列表 list = [1,2,3,4],  
    ##  list[0]=1, list[1]=2 ，而 -1 表示最后一个元素 list[-1]=4 ( 与 list[3]=4 一样)
    ##  inputWords[-1::-1] 有三个参数
    ##  第一个参数 -1 表示最后一个元素
    ##  第二个参数为空，表示移动到列表末尾
    ##  第三个参数为步长，-1 表示逆向
    inputWords=inputWords[-1::-1]
 
    ##  重新组合字符串
    output = ' '.join(inputWords)
     
    return output
 
if __name__ == "__main__":
    input = 'I like runoob'
    rw = reverseWords(input)
    print(rw) ##  输出结果：runoob like I
```

##  Tuple（元组）

元组（tuple）与列表类似，不同之处在于元组的元素不能修改。元组写在小括号 () 里，元素之间用逗号隔开。
虽然元组的元素不可改变，但它可以包含可变的对象，比如list列表。

元组中的元素类型也可以不相同：
```python
tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  )
```
```python
tup3 = "a", "b", "c", "d";   ##   不需要括号也可以
tup4 = tup3, (1, 2, 3, 4, 5)
print(tup3)
print(tup4)
##  输出：('a', 'b', 'c', 'd')
##       (('a', 'b', 'c', 'd'), (1, 2, 3, 4, 5))
```

构造包含 0 个或 1 个元素的元组比较特殊，所以有一些额外的语法规则：
```python
tup1 = ()    ##  空元组
tup2 = (20,) ##  一个元素，需要在元素后添加逗号
```

##  Set（集合）
集合（set）是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员。

基本功能是进行成员关系测试和删除重复元素。

可以使用大括号 `{ }` 或者 `set()` 函数创建集合。

> 注意：创建一个空集合必须用 `set()` 而不是 `{ }`，因为 `{ }` 是用来创建一个空字典。

```python
student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'}
print(student)   ##  输出集合，重复的元素被自动去掉

##  成员测试
if 'Rose' in student :
    print('Rose 在集合中')
else :
    print('Rose 不在集合中')

##  set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')
 
print(a)         ##  去重输出，顺序是随机的
print(a - b)     ##  a 和 b 的差集
print(a | b)     ##  a 和 b 的并集
print(a & b)     ##  a 和 b 的交集
print(a ^ b)     ##  a 和 b 中不同时存在的元素
```

##  Dictionary（字典）
列表是有序的对象集合，字典是无序的对象集合。两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。

字典是一种映射类型，字典用 `{ }` 标识，它是一个无序的 `键(key) : 值(value)`的集合。
键(key)必须使用不可变类型。
在同一个字典中，键(key)必须是唯一的。

```python
dict = {}
dict['one'] = "1 - 菜鸟教程"
dict[2]     = "2 - 菜鸟工具"
 
tinydict = {
'name': 'runoob',
'code':1, 
'site': 'www.runoob.com'
}
 
print (dict['one'])       ##  输出键为 'one' 的值
print (dict[2])           ##  输出键为 2 的值
print (tinydict)          ##  输出完整的字典
print (tinydict.keys())   ##  输出所有键
print (tinydict.values()) ##  输出所有值
```

构造函数 `dict()` 可以直接从键值对序列中构建字典如下：
```python
dict1 = dict([('Runoob', 1), ('Google', 2), ('Taobao', 3)])
dict2 = {x: x**2 for x in (2, 4, 6)}
dict3 = dict(Runoob=1, Google=2, Taobao=3)

##  输出：
##  dict1
{'Runoob': 1, 'Google': 2, 'Taobao': 3}
##  dict2
{2: 4, 4: 16, 6: 36}
##  dict3
{'Runoob': 1, 'Google': 2, 'Taobao': 3}
```

使用推导式（字典推导）
```python
{x: x**2 for x in (2, 4, 6)}
##  输出：{2: 4, 4: 16, 6: 36}
```

**注意：**
1、字典是一种映射类型，它的元素是键值对。
2、字典的关键字必须为不可变类型，且不能重复。
3、创建空字典使用 { }。

##  import 与 from...import
在 python 用 import 或者 from...import 来导入相应的模块。

将整个模块(somemodule)导入，格式为： `import somemodule`

从某个模块中导入某个函数,格式为： `from somemodule import somefunction`

从某个模块中导入多个函数,格式为： `from somemodule import firstfunc, secondfunc, thirdfunc`

将某个模块中的全部函数导入，格式为： `from somemodule import *`

##  循环语句
####  **while 循环**
```python
sum = 0
counter = 1
while counter <= n:
    sum = sum + counter
    counter += 1
```

while 循环使用 else 语句
```python
count = 0
while count < 5:
   print (count, " 小于 5")
   count = count + 1
else:
   print (count, " 大于或等于 5")
```

####  for循环
```python
for <variable> in <sequence>:
    <statements>
else:
    <statements>
```

```python
languages = ["C", "C++", "Perl", "Python"] 
    for x in languages:
    print (x)
```

在字典中遍历时，关键字和对应的值可以使用 `items()` 方法同时解读出来：
```python
knights = {'gallahad': 'the pure', 'robin': 'the brave'}
for key, value in knights.items():
    print(key, value)
##  输出：gallahad the pure
##       robin the brave
```
在序列中遍历时，索引位置和对应值可以使用 `enumerate()` 函数同时得到：
```python
for i, v in enumerate(['tic', 'tac', 'toe']):
    print(i, v)
##  输出：0 tic
##       1 tac
##       2 toe
```
同时遍历两个或更多的序列，可以使用 `zip()` 组合：
```python
##  同时遍历两个或更多的序列，可以使用 zip() 组合：
questions = ['name', 'quest', 'favorite color']
answers = ['lancelot', 'the holy grail', 'blue']
for q, a in zip(questions, answers):
    print('What is your {0}?  It is {1}.'.format(q, a))

##  What is your name?  It is lancelot.
##  What is your quest?  It is the holy grail.
##  What is your favorite color?  It is blue.
```

要反向遍历一个序列，首先指定这个序列，然后调用 `reversed()` 函数：
```python
for i in reversed(range(1, 10, 2)):
    print(i)
##  输出 9 7 5 3 1 
```

要按顺序遍历一个序列，使用 `sorted()` 函数返回一个已排序的序列，并不修改原值：
```python
basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
for f in sorted(set(basket)):
    print(f)
##  输出：apple banana orange pear
```

####  range()循环
如果你需要遍历数字序列，可以使用内置range()函数。它会生成数列
```python
for i in range(5):
    print(i)
    ##  0 1 2 3 4
##  第二个参数是范围
for i in range(5, 9) :
    print(i)
    ##  5 6 7 8
##  第三个参数是步长
for i in range(0, 10, 3) :
    print(i)
    ##  0 3 6 9

##  使用range()函数来创建一个列表
list(range(5))
##  [0, 1, 2, 3, 4]
```
####  pass 语句
Python pass是空语句，是为了保持程序结构的完整性。
pass 不做任何事情，一般用做占位语句。

##  函数
####  参数
**必需参数**
**关键字参数**
```python
def printinfo(name, age):
   print ("名字: ", name)
   print ("年龄: ", age)
   return
 
printinfo(age=50, name="runoob")
```

**默认参数**
```python
def printinfo(name, age = 35):
   print ("名字: ", name)
   print ("年龄: ", age)
   return
 
printinfo(name="runoob")
```

**不定长参数**
你可能需要一个函数能处理比当初声明时更多的参数。这些参数叫做不定长参数。

加了星号 `*` 的参数会以元组(tuple)的形式导入，存放所有未命名的变量参数。
```python
def printinfo( arg1, *vartuple ):
   print (arg1)
   print (vartuple)
 
printinfo( 70, 60, 50 )
##  输出: 70
##       (60, 50)
```

加了两个星号 `**` 的参数会以字典的形式导入。
```python
def printinfo( arg1, **vardict ):
   print (arg1)
   print (vardict)
 
##  调用printinfo 函数
printinfo(1, a=2,b=3)
##  输出: 1
##       {'a': 2, 'b': 3}
```

声明函数时，参数中星号 `*` 可以单独出现，例如:

```python
def f(a,b,*,c):
    return a+b+c
```
但如果单独出现星号 `*` 后的参数必须用关键字传入。

####  mutable对象与immutable对象
python 中一切都是对象，严格意义我们不能说值传递还是引用传递，我们应该说传不可变对象和传可变对象。
>  python 函数的参数传递：
> 不可变类型：类似 c++ 的值传递，如 整数、字符串、元组。如fun（a），传递的只是a的值，没有影响a对象本身。比如在 fun（a）内部修改 a 的值，只是修改另一个复制的对象，不会影响 a 本身。
> 可变类型：类似 c++ 的引用传递，如 列表，字典。如 fun(la)，则是将 la 真正的传过去，修改后fun外部的la也会受影响

传不可变对象实例
```python
def ChangeInt( a ):
    a = 10
 
b = 2
ChangeInt(b)
print( b ) ##  结果是 2
```

传可变对象实例
```python
##  可写函数说明
def changeme( mylist ):
   "修改传入的列表"
   mylist.append([1,2,3,4])
   print ("函数内取值: ", mylist)
   return

##  调用changeme函数
mylist = [10,20,30]
changeme( mylist )
print ("函数外取值: ", mylist)
##  输出：函数内取值:  [10, 20, 30, [1, 2, 3, 4]]
##  输出：函数外取值:  [10, 20, 30, [1, 2, 3, 4]]
```

####  匿名函数
使用 `lambda` 来创建匿名函数。
所谓匿名，意即不再使用 `def` 语句这样标准的形式定义一个函数。
lambda 只是一个表达式，函数体比 def 简单很多。
lambda的主体是一个表达式，而不是一个代码块。仅仅能在lambda表达式中封装有限的逻辑进去。
lambda 函数拥有自己的命名空间，且不能访问自己参数列表之外或全局命名空间里的参数。
虽然lambda函数看起来只能写一行，却不等同于C或C++的内联函数，后者的目的是调用小函数时不占用栈内存从而增加运行效率。

```python
lambda [arg1 [,arg2,.....argn]]:expression
```

```python
##  可写函数说明
sum = lambda arg1, arg2: arg1 + arg2
 
##  调用sum函数
print(sum( 10, 20 )) ##  30
print(sum( 20, 20 )) ##  40
```

##  列表推导式
列表推导式 把某种操作应用于序列或可迭代对象的每个元素上，然后使用其结果来创建列表，或者通过满足某些特定条件元素来创建子序列。
```python
[(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
##  等价于
##  等价于
##  combs = []
##  for x in [1,2,3]:
##      for y in [3,1,4]:
##          if x != y:
##              combs.append((x, y))
##  combs
```

看代码理解用法：
```python
vec = [2, 4, 6]
##  我们将列表中每个数值乘三，获得一个新的列表：
[3*x for x in vec]
##  输出：[6, 12, 18]

[[x, x**2] for x in vec]
##  输出：[[2, 4], [4, 16], [6, 36]]

##  我们可以用 if 子句作为过滤器：
[3*x for x in vec if x > 3]
##  输出：[12, 18]
[3*x for x in vec if x < 2]
##  输出：[]
```

```python
vec1 = [2, 4, 6]
vec2 = [4, 3, -9]
[x*y for x in vec1 for y in vec2]
##  输出：[8, 6, -18, 16, 12, -36, 24, 18, -54]
[x+y for x in vec1 for y in vec2]
##  输出：[6, 5, -7, 8, 7, -5, 10, 9, -3]
[vec1[i]*vec2[i] for i in range(len(vec1))]
##  输出：[8, 12, -54]
```

这里我们对序列里每一个元素逐个调用某方法：
```python
freshfruit = ['  banana', '  loganberry ', 'passion fruit  ']
[weapon.strip() for weapon in freshfruit]
##  输出：['banana', 'loganberry', 'passion fruit']
```

##  迭代器(Iterators)
迭代器是一个可以记住遍历的位置的对象，是访问集合元素的一种方式。
迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。
迭代器有两个基本的方法：`iter()` 和` next()`。

迭代器对象可以使用常规for语句进行遍历：
```python
list_iter = [1, 2, 3, 4]
it = iter(list_iter)    ##  创建迭代器对象
print(next(it))   ##  输出迭代器的下一个元素
print(next(it))
for x in it:
    print(x, end=" ")
##  输出： 1
##        2
##        3 4
```

把一个类作为一个迭代器使用需要在类中实现两个方法 __iter__() 与 __next__() 。
```python
##  __iter__() 方法返回一个特殊的迭代器对象， 这个迭代器对象实现了 __next__() 方法并通过 StopIteration 异常标识迭代的完成。
##  __next__() 方法会返回下一个迭代器对象。
##  在 `__next__()` 方法中我们可以设置在完成指定循环次数后触发 `StopIteration` 异常来结束迭代。
class MyNumbers:
    def __iter__(self):
        self.a = 6
        return self

    def __next__(self):
        if self.a <= 10:
            x = self.a
            self.a += 1
            return x
        else:
            raise StopIteration


instanceClass = MyNumbers()
instanceIter = iter(instanceClass)

##  print(next(instanceIter))
for x in instanceIter:
    print(x)
```

##  生成器（generator）
使用了 yield 的函数被称为生成器（generator），跟普通函数不同的是，生成器是一个返回迭代器的函数，只能用于迭代操作。
调用一个生成器函数，返回的是一个迭代器对象。
在调用生成器运行的过程中，**每次遇到 yield 时函数会暂停并保存当前所有的运行信息，返回 yield 的值**, 并在下一次执行 next() 方法时从当前位置继续运行。

```python
import sys


def fibonacci(n):  ##  生成器函数 - 斐波那契
    a, b, counter = 0, 1, 0
    while True:
        if counter > n:
            print('当前计数器：', counter)
            return
        yield a, b
        a, b = b, a + b
        counter += 1


f = fibonacci(10)  ##  f 是一个迭代器，由生成器返回生成

while True:
    try:
        print(next(f))
    except StopIteration:
        sys.exit()
##  输出：
##  (0, 1)
##  (1, 1)
##  (1, 2)
##  (2, 3)
##  (3, 5)
##  (5, 8)
##  (8, 13)
##  (13, 21)
##  (21, 34)
##  (34, 55)
##  (55, 89)
##  当前计数器： 11
```

