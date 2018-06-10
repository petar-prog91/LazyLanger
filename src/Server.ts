import * as express from 'express'
import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'

import { subtitleFilter } from './utils';

class Server {
    public express

    constructor() {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes(): void {
        const UPLOAD_PATH = 'uploads';
        const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: subtitleFilter }); // multer configuration
        const router = express.Router()

        router.get('/', (req, res) => {
            res.json({
                message: 'Lazy Language to the rescue for us lazy monkeys trying to learn a new language!'
            })
        })

        router.post('/upload', upload.array('subtitle'), async (req, res) => {
            try {
                res.json({
                    message: 'So you tried to send something! Let\' continue with implementations',
                    file: req.files
                })
            } catch (err) {
                res.sendStatus(400)
            }
        })

        this.express.use('/', router)
    }
}

export default new Server().express