#! /usr/bin/env sh

# 生成静态文件
yarn build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
echo 'nirodu.fun' > CNAME

git init
git config user.name 'nirodu'
git config user.email 'nirodu1219@outlook.com'
git add -A
git commit -m 'deploy'
git push -f https://github.com/NiroDu/n-book.git master:gh-pages
