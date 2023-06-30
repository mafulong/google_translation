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

开放接口给外面: http server, 3000端口。即时翻译。



popclip有bug在于它会丢掉空行之类的。这个没啥好办法，或者快捷键？


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
```





## CX

![image-20230630104903336](https://cdn.jsdelivr.net/gh/mafulong/mdPic@vv8/v8/202306301049621.png)

## Todo

- mac系统全局快捷键一键唤醒app并到前台
- mac系统 选择文字后 全局快捷键一键唤醒app并到前台并进行翻译
- popclip集成 不丢失换行符。
- alfred集成