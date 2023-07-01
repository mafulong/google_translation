# google-translate-electron

Open Google Translate at Desktop

Based on https://github.com/laissonsilveira/google-translate-electron

## To Use

```bash
# Clone this repository
git clone git@github.com:mafulong/google_translation.git
# Go into the repository
cd google_translation
# Install dependencies
npm install
# Run the app
npm start
```

> On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q

- 外部软件集成。目前有开放接口给外面: http server, 3000端口。即时翻译。
- popclip集成可通过下面的popclip shellscript安装插件
- 可以自己导出成mac运行的app后缀程序。

```
查看主进程的console.log:
tail -f main.log

外部调用直接翻译。
curl -X POST -d "message=Hello, Electron" http://localhost:3000


集成到popclip
# popclip shellscript nested in an applescript 
name: Trans
shell script: curl -X POST -d $POPCLIP_TEXT http://localhost:3000
interpreter: zsh


# popclip shellscript nested in an applescript 
name: Trans2
applescript: do shell script "echo '{popclip text}' > ~/abchh"


生成mac .app 程序。
electron-packager . --platform=darwin --arch=x64 --out=./dist --overwrite
```



## CX

![image-20230630104903336](https://cdn.jsdelivr.net/gh/mafulong/mdPic@vv8/v8/202306301049621.png)



popclip集成, [CX](https://cdn.jsdelivr.net/gh/mafulong/mdPic@vv8/v8/202306301120951.gif)



![file](https://cdn.jsdelivr.net/gh/mafulong/mdPic@vv8/v8/202306301126598.gif)

## Todo

- mac系统 全局快捷键一键唤醒app并到前台。已支持。默认cmd+e
- mac系统 选择文字后 全局快捷键一键唤醒app并到前台并进行翻译。已支持: cmd+e会使用剪贴板的文字进行翻译。非剪贴板不搞了，直接popclip已满足使用。
- alfred集成: 不搞了。cost和直接快捷键唤醒输入相当。

## 废弃内容 集成alfred

bundleId在package.json里。这个是alfred使用欧陆词典比如eudic://dict//{query}这样协议时使用的。 同时需要告诉mac bundleId对应了哪个app。这个需要改mac系统里的一个plist文件。


mac系统展示bundle Id是多少: 
```
 osascript -e 'id of app "/Users/mafulong/github/google-translate-electron/dist/google-translate-electron-darwin-x64/google-translate-electron.app"'
```


好像没啥用。注册bundleId com.electron.google-translate-electron。如果存在会自动替换的。不搞alfred了
```
/usr/libexec/PlistBuddy -c "Add :LSHandlers:0 dict" ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist
/usr/libexec/PlistBuddy -c "Add :LSHandlers:0:LSHandlerURLScheme string google_trans" ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist
/usr/libexec/PlistBuddy -c "Add :LSHandlers:0:LSHandlerRoleAll string com.electron.google-translate-electron" ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist

/usr/libexec/PlistBuddy -c "Save" ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist
```
