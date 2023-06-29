# @made-simple/express

---

Shifts the work of setting up an Express server to an easy to use class. Allowing you to focus on the more important stuff.

## Installation

```bash
npm install @made-simple/express
```

## Example Usage

```js
import { Server } from "@made-simple/express"
const server = new Server() // creates a new http server

server.get("/", (req, res) => {
    res.send("Hello World!")
})

server.start(3000)
```

## Examples

### Adding a folder of routes

```js
server.addFolder("./routes")
```

#### Creating a route file

```js
// ./routes/index.js

export function link(app, ...) {
    app.get(url, (req, res) => {
        res.send("Hello World!")
    })
}
```

### Running HTTPS

```js
const server = new Server("/etc/letsencrypt/live/example.com/")
server.start() // starts the server on port 443 and redirects http to https
```

### Running HTTP

```js
const server = new Server()
server.start()
```

---

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
[Repository](https://github.com/made-simple/express)

## Contributors

[@alexasterisk](https://github.com/alexasterisk)