import * as express from 'express'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Lazy Language to the rescue for us lazy monkeys trying to learn a new language!'
      })
    })
    this.express.use('/', router)
  }
}

export default new App().express