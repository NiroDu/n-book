#! /usr/bin/env sh

# 确保脚本在错误时退出
set -e

# 生成静态文件
yarn build

# 进入生成的文件夹
cd .vitepress/dist

# 如果是发布到自定义域名
# echo 'nirodu.fun' > CNAME

git init
# 明确创建并切换到master分支
git checkout -b master
git config user.name 'nirodu'
git config user.email 'nirodu1219@outlook.com'
git add -A
git commit -m 'deploy'

# 使用SSH地址，从master分支推送到gh-pages分支
git push -f git@github.com:NiroDu/n-book.git master:gh-pages

cd -
