import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(stealthPlugin())

export async function initializeBrowser(
    opts: InitializeBrowserOpts = { headless: 'new' }
): Promise<BrowserPage> {
    const args: string[] = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-remote-fonts',
        '--disable-notifications',
        '--window-size=1920,1080',
    ]

    if (opts.proxy) {
        args.push(`--proxy-server=${opts.proxy.server}`)
    }

    // launch browser
    const browser = await puppeteer.launch({
        // @ts-expect-error
        headless: opts.headless,
        devtools: false,
        args: args,
    })

    const page = (await browser.pages())[0]

    // override user agent
    let userAgent: string
    if (opts.userAgent) {
        userAgent = opts.userAgent
    } else {
        userAgent = (await browser.userAgent()).replace(
            'HeadlessChrome/',
            'Chrome/'
        )
    }
    await page.setUserAgent(userAgent)

    await page.evaluateOnNewDocument(
        `navigator.mediaDevices.getUserMedia = navigator.webkitGetUserMedia = navigator.mozGetUserMedia = navigator.getUserMedia = webkitRTCPeerConnection = RTCPeerConnection = MediaStreamTrack = undefined;`
    )

    await page.setViewport({ width: 1920, height: 1080 })

    // authenticate proxy
    if (opts.proxy && opts.proxy.username && opts.proxy.password) {
        await page.authenticate({
            username: opts.proxy.username,
            password: opts.proxy.password,
        })
    }

    return { browser, page }
}

interface InitializeBrowserOpts {
    headless: 'new' | boolean
    proxy?: Proxy | null
    userAgent?: string | null
}

export interface Proxy {
    server: string
    username?: string | null
    password?: string | null
}

interface BrowserPage {
    browser: Browser
    page: Page
}
