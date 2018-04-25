# Bitblock Backend

## Requirements

1. [NodeJS](https://nodejs.org/en/download/) + [npm](https://www.npmjs.com/get-npm)
2. [MongoDB](https://www.mongodb.com/download-center)
3. [nvm](https://davidwalsh.name/nvm)

## Installation

1. Ensure you are on node v6 using `nvm install 6`. Otherwise it won't work.
2. Execute `npm install` in base folder. 
3. Create `config` folder in `app/res` and create `app/res/config/config.json` with these lines:

```
{
	"env": "local",
	"gcloud": {
        "projectId": "idhere",
        "keyFilename": "keyfile"
	},

	"cloudStorageBucket": "bucketName",
	"client_domain": "http://localhost:9000",
	"secrets": {
		"session": "secret"
	},
	"port": 8000,
	"ip": "0.0.0.0",
	"mongo": {
		"uri": "mongodb://localhost/bitbloq",
		"options": {
			"db": {
				"safe": true
			},
			"user": "",
			"pass": ""
		}
	},

	"seedDB": false,
	"mailer": {
		"auth": {
			"user": "",
			"pass": ""
		},
		"defaultFromAddress": "algo@algo.com"
	},
	"supportEmail": "algo@algo.com",
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
}
```

## How to run

1. Run `nvm use 6` to ensure you are using NodeJS v6
2. Run MongoDB on [Windows](https://docs.mongodb.com/tutorials/install-mongodb-on-windows/#run-mongodb-community-edition) or Ubuntu: `sudo service mongod start`. You can also just execute `sudo mongod`, but remember not to run Mongo as root on production enviroment.
3. Execute `node index.js` in base path.

## I have successfully ran backend. What now?

You should run [front-end](https://github.com/liaupm/bitbloq-frontend). To do so, you should follow its own `Readme.md`. However, when creating front-end `config.json`, notice that `serverUrl_` field is wrong, it should be `serverUrl`. To make this simpler, you can use instead this other config **front-end** file:

```
{
    "env": "local",
    "defaultLang": "es-ES",
    "supportedLanguages": [
        "es-ES",
        "en-GB",
        "nl-NL",
        "ru-RU",
        "it-IT",
        "eu-ES",
        "ca-ES",
        "fr-FR",
        "de-DE",
        "pt-PT",
        "gl",
        "zh-CN"
    ],
    "saveTime": 2000,
    "serverUrl": "http://localhost:8000/bitbloq/v1/",
    "gCloudUrl": "",
    "compilerUrl": "http://localhost:3000/",
    "bucket": "",
    "chromeAppId": "nlndpbeidnfnjpfkmlcakphlbilpokho",
    "web2boardLinkWindows": "https://github.com/bq/web2board/releases/download/Latest/windows_web2board_installer.exe",
    "web2boardLinkMac": "https://github.com/bq/web2board/releases/download/Latest/mac_web2board_installer.pkg",
    "web2boardLinkLinux": "https://github.com/bq/web2board/releases/download/Latest/linux_64_web2board_installer.zip",
    "web2boardLinkLinux32": "https://github.com/bq/web2board/releases/download/Latest/linux_32_web2board_installer.zip",
    "version": "v3.3.6"
}
```
Once you have followed the front-end instructions, you should be able to access http://localhost:9000/ and sign up as a new user. It will only work if you have correctly set up and launched your back-end. It seems everything is working, but you can check that Software Tab won't respond. To fix this, you must continue with the following instructions.

Once you have registered your user, create `gruntconfig.json` on base **front-end** folder with these lines:
```
{
	"adminUser": "TheUsernameThatYouHaveJustRegistered",
	"adminPassword": "ThePasswordYouChoseForThisUser"
}
```
Then, you must access your MongoDB `bitbloq` database, go to the `users` collection, pick your new user and change its role to `admin`. You can do so using the following lines on your MongoDB Shell:
`mongo`
`use bitbloq`
`db.getCollection('users').update({"username" : "TheUsernameThatYouHaveJustRegistered"}, {$set: {"role": "admin"}})`
Finally, having your back-end running, run on front-end folder: `grunt updateAllCollections`. This command will fill your bloqs collection with necessary data.

## Now everything works, but the hardware components are missing

You might have noticed there are no boards, neither robots or any component to add to a project. They are JSON located at app/static, but you must load them into the JSON. To do so, you must send a couple `POST` requests to the back-end api:

1. POST `http://localhost:8000/bitbloq/v1/auth/local` with a HEADER like:
```
Content-Type: application/json
```
And this BODY:
```
{
	"email": "TheUsernameThatYouHaveJustRegistered",	
	"password": "ThePasswordYouChoseForThisUser"
}
```
You will see a response like this:
```
{
    "token": "eyJ0eXAiOiJds1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1YWIxNDFiMTFlODk4cdlmZmExYjdiMDIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MjQwNjgxqwQsImV4cCI6MTUyNDIxMjE5NH0.2Z7q0nXgcbtEe1j5M-txR-dHulQW-VfyE_NC7c6gMU"
}
```
2. POST `http://localhost:8000/bitbloq/v1/hardware` with these headers:
```
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1YWIxNDFiMTFlODk4ZjlmZmExYjdiMDIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MjQwNjgxOTQsImV4cCI6MTUyNDIxMjE5NH0.2Z7q0nXgcbtET51j5M-txR-dHulQW-VfyE_NC7c6gMU
```
Then paste the `app/static/boards_?-?-?.json` code into the body and send it. If it succeeds, check your MongoDB database. Boards should be filled with content! Repeat this second call with each static and your installation will reach the end.