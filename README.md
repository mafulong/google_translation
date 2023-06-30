# google-translate-electron

Open Google Translate at Desktop

Based on https://github.com/laissonsilveira/google-translate-electron

## To Use

```bash
# Clone this repository
git clone https://github.com/laissonsilveira/google-translate-electron.git
# Go into the repository
cd google-translate-electron
# Install dependencies
npm install
# Run the app
npm start
```

> On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q


开放接口给外面: curl -X POST -d "message=Hello, Electron" http://localhost:3000

popclip有bug在于它会丢掉空行，空格之类的。这个没啥好办法，或者快捷键？


```
查看主进程的console.log:
tail -f main.log

curl -X POST -d "message=Hello, Electron" http://localhost:3000


#popclip shellscript example  
name: Say
shell script: curl -X POST -d $POPCLIP_TEXT http://localhost:3000
interpreter: zsh

# popclip shellscript nested in an applescript 
name: Trans2
applescript: do shell script "echo '{popclip text}' > ~/abchh"
```
