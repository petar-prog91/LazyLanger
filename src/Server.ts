import * as express from 'express'
import * as multer from 'multer'
import * as fs from 'fs'

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
                const rawData = this.readFilesData(req.files)
                const cleanText = this.cleanupText(rawData)
                const cleanArray = this.convertToArray(cleanText)
                const sortedByFrequency = this.sortByFrequency(cleanArray)
                const sortedByOccurence = this.sortProperties(sortedByFrequency)
                const prettyArray = this.prettyArray(sortedByOccurence)
                res.json({
                    message: 'So you tried to send something! Let\' continue with implementations',
                    subtitleText: prettyArray
                })
            } catch (err) {
                res.sendStatus(400)
            }
        })

        this.express.use('/', router)
    }

    private readFilesData(subtitleFiles: Array<multer.Files>): String {
        let filesData = ''
        subtitleFiles.forEach(element => {
            const subtitleText = fs.readFileSync(element.path, 'UTF-8')

            filesData = filesData + subtitleText
            this.deleteFile(element.path)
        })

        return filesData
    }

    private deleteFile(filePath: string): void {
        fs.unlink(filePath)
    }

    private convertToArray(subtitleTexts: String): Array<String> {
        return subtitleTexts.split(/\n/)
    }

    private cleanupText(subtitleTexts: String): String {
        const cleanText = subtitleTexts
                            .replace(/[^a-zA-Z]+/g, ' ') // Remove everything except letters
                            .replace(/(?:\\[rn]|[\r\n]+)+/g, ' ') // Remove \r\n etc
                            .replace(/^ /g, '') // Remove beginning empty space
                            .replace(/ /g, '\n') // Replace every space with new line
                            .toLowerCase() // Convert everything to lower case
        return cleanText
    }

    private sortByFrequency(array: Array<any>) {
        var freqMap = {};

        array.forEach(function(word) {
            if (!freqMap[word]) {
                freqMap[word] = 0;
            }
            freqMap[word] += 1;
        });
    
        return freqMap;
    }

    /**
     * Sort object properties (only own properties will be sorted).
     * @param {object} obj object to sort properties
     * @returns {Array} array of items in [[key,value],[key,value],...] format.
     */
    private sortProperties(obj: Object): Array<any> {
        const sortable = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortable.push([key, obj[key]]);
            }
                
            sortable.sort((a, b) => {
                return a[1] - b[1];
            })
        }

        return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
    }

    private prettyArray(array: Array<String>): Array<any> {
        const prettifiedArray = array.reverse().map((el) => { 
            return { word: el[0], count: el[1] }
        })

        return prettifiedArray
    }
}

export default new Server().express