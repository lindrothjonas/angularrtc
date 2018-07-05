Callcenter demo backend

# How to use

Build and run angularrtc (separate README)

## Run backend

```
npm install
node index.js
```

## Use ngrok to forward traffic

Use [ngrok](https://ngrok.com/) to set up a reverse tunnel for Sinch callbacks. 

```
./ngrok\ 2 http 8080
```

## Configure app 

Configure the callback url from ngrok on [Sinch portal](https://portal.sinch.com/)

Configure a virtual number on your application. 