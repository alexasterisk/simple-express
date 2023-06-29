const express = require("express")
const http = require("node:http")
const https = require("node:https")
const { json } = require("body-parser")
const { dirname, join } = require("node:path")
const { readdirSync, mkdirSync, readFileSync } = require("node:fs")
const callsite = require("callsite")
const { exec } = require("node:child_process")
const { CronJob } = require("cron")

class Port {
    static HTTP = 80
    static HTTPS = 443
    static Local = 3000

    static Ports = new Map([
        [80, "HTTP"],
        [443, "HTTPS"],
        [3000, "HTTP - dev"],
        [8080, "HTTP - dev"],
        [8443, "HTTPS - dev"]
    ])

    static use(port) {
        return this.Ports.get(port) ?? "Unknown"
    }
}

class Server {
    #caller = dirname(callsite()[2].getFileName()) ?? ""
    #app = express()
    #ssl = false
    #options = {}

    constructor(ssl_cert) {
        if (ssl_cert) {
            this.#ssl = true
            this.#options = {
                cert: readFileSync(join(this.#caller, ssl_cert, "fullchain.pem")),
                key: readFileSync(join(this.#caller, ssl_cert, "privkey.pem"))
            }

            this.use((req, res, next) => {
                if (req.protocol === "https") next()
                else res.redirect("https://" + req.headers.host + req.url)
            })

            this.use(json())

            this.use((req, _, next) => {
                console.log(`\n${req.method} - ${req.url}`)
                console.log(` - QUERY: ${JSON.stringify(req.query)}`)
                console.log(` - BODY: ${JSON.stringify(req.body)}`)
                next()
            })
        }
    }

    use(...args) { this.#app.use(...args) }
    get(path, ...args) { this.#app.get(path, ...args) }

    addFolder(path) {
        path = join(this.#caller, path)
        const files = readdirSync(path)
        for (const file of files) {
            if (file.match(/\.js$/)) {
            const endpoint = require(join(path, file))
                endpoint.link(this.#app)
            } else if (!file.match(/\./)) {
                const subpath = join(path, file)
                const subfiles = readdirSync(subpath).filter(file => file.match(/\.js$/))
                for (const subfile of subfiles) {
                    const endpoint = require(join(subpath, subfile))
                    endpoint.link(this.#app, file)
                }
            }
        }
    }

    start(port) {
        if (port !== undefined) {
            this.#app.listen(port, () => {
                console.log(`Listening on port ${port} (${Port.use(port)})`)
            })
        } else {
            if (this.#ssl) {
                https.createServer(this.#options, this.#app).listen(Port.HTTPS, () => {
                    console.log(`Listening on port ${Port.HTTPS} (${Port.use(Port.HTTPS)})`)
                })

                exec("certbot -h", (err) => {
                    if (err) {
                        console.error("Certbot is not installed, if you would like to automatically renew your SSL certificate, please install it.")
                        console.error("You can install it by running 'sudo apt-get install certbot'")
                    } else {
                        new CronJob("0 0 * * *", () => {
                            exec("certbot renew", (err, stdout, stderr) => {
                                if (err) console.error(err)
                                if (stderr) console.error(stderr)
                                console.log(stdout)
                            })
                        }).start()
                    }
                })
            }

            http.createServer(this.#app).listen(Port.HTTP, () => {
                console.log(`Listening on port ${Port.HTTP} (${Port.use(Port.HTTP)})`)
            })
        }
    }
}

exports.Port = Port
exports.Server = Server