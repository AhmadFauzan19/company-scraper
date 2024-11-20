import 'dotenv/config'

const config: Config = {
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    proxy: {
        enabled: process.env.PROXY_ENABLED?.toLowerCase() === 'true',
        proxyv6ApiKey: process.env.PROXYV6_API_KEY,
        lunaProxyUri: process.env.LUNAPROXY_URI,
        v6proxiesUri: process.env.V6PROXIES_URI,
    },
    rabbitMqUri: process.env.RABBITMQ_URI ?? 'amqp://127.0.0.1:5672/',
    mongoUri: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/youtube',
    realAccountMongoUri: 
        process.env.REAL_ACCOUNT_MONGO_URI ?? 'mongodb://127.0.0.1:27017/medsos',
    screenshot: {
        enabled: process.env.SCREENSHOT_ENABLED?.toLowerCase() === 'true',
        folder: process.env.SCREENSHOT_FOLDER ?? '/screenshots',
    },
    scrapingProxy: {
        enabled: process.env.SCRAPING_PROXY_ENABLED?.toLowerCase() === 'true',
        proxyUri: process.env.SCRAPING_PROXY_URI,
    },
    openaiApiKey: process.env.OPENAI_API_KEY,
}

export const SCROLL_LOOP_LIMIT = 2

interface Config {
    logLevel: string
    proxy: Proxy
    rabbitMqUri: string
    mongoUri: string
    realAccountMongoUri: string
    screenshot: Screenshot
    scrapingProxy: ScrapingProxy
    openaiApiKey?: string
}

interface Proxy {
    enabled: boolean
    proxyv6ApiKey?: string
    lunaProxyUri?: string
    v6proxiesUri?: string
}

interface ScrapingProxy {
    enabled: boolean
    proxyUri?: string | URL
}

interface Screenshot {
    enabled: boolean
    folder: string
}

export default config
