Simply CORS (cross origin resource sharing) is code that tells the browser to allow the website/server to retrieve data from the different server from its own. 

```
app.use(cors())
```

You call the cors middleware like this if you want to allow CORS requests on all routes 

or

you call it like this if you only want CORS allowed for certain routes

```
app.get('/products/:id', cors(), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})
```

CORS config settings are set using an object. You give the settings to the function like this

```
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
})
```

config options: https://expressjs.com/en/resources/middleware/cors.html#configuration-options