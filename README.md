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