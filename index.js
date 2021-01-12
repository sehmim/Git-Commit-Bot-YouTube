const puppeteer = require('puppeteer')
const cron = require('node-cron');
const dotenv = require('dotenv')
dotenv.config()

const URL = "https://github.com/login"
const REPO = "https://github.com/batman500/dummy"

const USERNAME = "batman500"
const PASSWORD = "JokerSucks500"

const CODE_CHANGE = "Commit Change"
const COMMIT_MESSAGE = "Commit Message"


let browser
let page

const puppet = async (username, password, code, commitMessage) => {
    browser = await puppeteer.launch({ headless: false })
    page =  await browser.newPage()

    await page.goto(URL, { waitUntil: 'networkidle2' })

    // Login
    await page.type("input[name='login']", username, { delay: 100 })
    await page.type("input[name='password']", password, { delay: 100 })
    await page.click("input[name='commit']", { delay: 200 })

    await page.waitFor(500)

    // Go to repo
    await page.goto(REPO, { waitUntil: 'networkidle2' }, { delay: 500 })
    await page.click("a[class='Box-btn-octicon btn-octicon float-right']", { delay: 200 })

    // Write Change
    await page.waitForSelector("pre[class=' CodeMirror-line ']")
    await page.click("div[class='CodeMirror-scroll']", { delay: 200 })
    await page.waitForSelector("pre[class=' CodeMirror-line ']")
    await page.type("pre[class=' CodeMirror-line ']", code, { delay: 500 })

    // Write commit message
    await page.type("input[id='commit-summary-input']", commitMessage, { delay: 500 })
    await page.click("button[class='btn btn-primary js-blob-submit flex-auto mx-3 ml-md-3 mr-md-0 ml-lg-0 mb-3 mb-md-0", { delay: 500 })

    await browser.close()
}   

// Running Everyday at midnight
cron.schedule('0 0 0 * * *', () => {
    console.log('------------RUNNING JOB--------------');
    puppet(process.env.USERNAME, process.env.PASSWORD, process.env.CODE_CHANGE, process.env.COMMIT_MESSAGE).then(() => {
        console.log("Message committed")
    }).catch(err => console.log(err))
  });

