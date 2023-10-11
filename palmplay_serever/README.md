# 项目说明文档wiki

## note

## mark

## git

```

Command line instructions

Git global setup
git config --global user.name "topbrids"
git config --global user.email "1373978075@qq.com"

Create a new repository
git clone git@git.ehw8.com:management/palmplay_serever.git
cd palmplay_serever
touch README.md
git add README.md
git commit -m "add README"

Existing folder
cd existing_folder
git init
git remote add origin git@git.ehw8.com:management/palmplay_serever.git
git add .
git commit -m "Initial commit"

Existing Git repository
cd existing_repo
git remote rename origin old-origin
git remote add origin git@git.ehw8.com:management/palmplay_serever.git

```