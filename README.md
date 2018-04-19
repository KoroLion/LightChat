# LightChat

Incredibly fast and simple ready to use chat server with built-in web server and client.

Supports HTTPS and WebSocket Secure.

## How-to run:
- Install [NodeJS](https://nodejs.org/en/ "NodeJS")
- Clone or download this repository
- Enter LightChat directory
- Install requirements with `npm install`
- Run with `npm start`

## Enabling HTTPS and WebSocket Secure:
- Open **index.js**
- If you don't have SSL certificate - generate new with `openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365`
- Specify path to your key and cert with **sslKeyFile** and **sslCertFile** options
- Also you can disable http and automatically redirect to https by changing **httpRedirect** option to true
