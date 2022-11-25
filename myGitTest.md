# 我的`Git`笔记

---

## 配置环境时的经验总结

1. **共用Public Key**：一个公钥同时可同时使用于GitHub和Gitee平台！
2. **主分支改名**：origin/main：指的是远程分支的分支名称为main，在以前叫master，因为受到“Black Lives Matter”运动和民众情绪的影响，所以推荐改主分支名
3. **免密操作**：把token直接添加远程仓库链接中，这样就可以避免同一个仓库每次提交代码都要输入邮箱、密码了：
    - git remote set-url origin https://填写你的密钥@github.com/2690085099/vue3_project.git
    - git remote set-url origin https://gitee.com/用户名/仓库名称.git

## 常用的`Git`命令

### 1. 能够将项目下所有未提交到暂存区的文件提交

```shell
git add .
```

### 2. 将暂存区的内容提交到本地仓库

```shell
git commit -m 本次提交的描述内容
```

### 3. 将修改推送到远程仓库（如GitHub、Gitee等）

```shell
git push
```

### 4. 丢弃更改所有更改，如果“.”换成文件名，就是丢弃某个文件的更改

```shell
git restore .
```

### 5. 切换当前Git命令所操作的远程仓库

```shell
git remote set-url origin 仓库Git地址 .
```

### 6. 新建分支，并切换到新的分支

```shell
git switch -c 分支名 .
```

### 7. 合并指定分支到当前分支

```shell
git merge 分支名 .
```

### 8. 删除分支

```shell
git branch -d 分支名 .
```

### 9. 切换到指定分支

```shell
git switch 分支名
```

### 10. 删除远程分支

```shell
git push origin --delete 分支名
或
git branch -dr 分支名
```

### 11. 查看当前状态

```shell
git status
```

### 12. 查看分支

- 查看所有分支，白色字体为本地分支，红色字体为远程仓库分支，前面带星号的为当前分支

```shell
git branch -a
```

- 查看本地仓库的分支

```shell
git branch
```

- 查看远程仓库的分支

```shell
git branch -r
```

### 13. 新建分支，但依然停留在当前分支

```shell
git branch 分支名
```

### 14. 查看远程仓库的地址

```shell
git remote -v
```

### 15. 回滚

1. 先查看输出结果里的开头一串字符——commitID

```shell
git reflog --date=iso
```

2. 回滚代码到本地

```shell
git reset --hard HEAD标识符
```

3. （不推荐）强制推送到远程仓库

```shell
git push -f
```

### 15. 版本冲突

- 先在远程仓库拉取`pull`代码，然后检查后合并`merge`，再推送`push`到服务器；或者直接强行让本地分支覆盖远程分支

```shell
git push origin master -f
```

- 如果要强制推送

```shell
git push -f
```

### 16. 将子分支合并到主分支

1. 先切换到主分支

```shell
git switch 主分支名称
```

2. 然后最好拉取主分支最新的代码（和远程仓库保持最新版本）

```shell
git pull
```

3. 然后将子分支合并到当前分支（主分支）

```shell
git merge 子分支名称
```

### 17. 从本地删除远程仓库地址

```shell
git remote rm 仓库名称（不是地址）
```

提交到远程仓库的一系列便捷操作：

```shell
git add .
git commit -m "完善文档"
git push

```

### 18. 强制推送（解决“error: failed to push some refs to···）

```shell
git push -u origin 分支名称 -f 
```

### 19. 撤销全局配置（重点在--unset，即取消设置）

```shell
git config --global --unset 具体命令内容
```

### 20. 把远程仓库和本地同步，消除差异（解决git push与远程仓库冲突）

```shell
git pull origin 分支名 --allow-unrelated-histories
```