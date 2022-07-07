# 我的`Git`笔记

---

## 配置环境时的经验总结

1. **共用Public Key**：一个公钥同时可同时使用于GitHub和Gitee平台！
2. **主分支改名**：origin/main：指的是远程分支的分支名称为main，在以前叫master，因为受到“Black Lives Matter”运动和民众情绪的影响，所以推荐改主分支名
3. **免密操作**：把token直接添加远程仓库链接中，这样就可以避免同一个仓库每次提交代码都要输入token了：
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

先在远程仓库拉取`pull`代码，然后检查后合并`merge`，再推送`push`到服务器；或者直接强行让本地分支覆盖远程分支

```shell
git push origin master -f
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

注意：本地分支回滚后，版本将落后远程分支，可以使用强制推送覆盖远程分支，否则无法推送到远程分支： 要提交之前可以新建一个分支，然后提交或者直接强制推送到远程分支：“git push -f”