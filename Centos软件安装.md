### 谷歌浏览器

* 配置yum源
```bash
# vim /ect/yum.repos.d/google-chrome.repo
---------------------------------------------------------------
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/$basearch
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
---------------------------------------------------------------

```
* 安装
```bash
# yum -y install google-chrome-stable
//失败请尝试
# yum -y install google-chrome-stable --nogpgcheck
```
***
### VScode
* 配置仓库地址
```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
```
* 安装
```bash
yum check-update
sudo yum install code
```
