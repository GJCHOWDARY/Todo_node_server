# TODO APP
Web app

*project structure*

```
.
|
├── dist/angular /*client files*/
|
└── config
│       ├── config.json /*dev,test,production*/
|       |
│       └── environment.js  
|
└── controllers
│     ├── todo.js
│     └── user.js        
|
├── middleware
│     ├── auth.js
│     ├── authorize.js
│     ├── erro-handler.js
│     └── request-handler.js
|
├── models
│     ├── todo.js
│     └── user.js
|
├── routes
│     ├── todo.js
│     └── user.js
|
|── app.js
|
├── README.md
|
└── package.json

```
---

*Run server*

## Linux/Mac

* sudo NODE_ENV=development npm start || sudo NODE_ENV=development node app.js

## windows

* set NODE_ENV=development&node app.js

