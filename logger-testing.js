const logger = require('./controllers/Logger.controller')

// logger.log({
// 	level: 'info',
// 	message: 'this is a test message',
// 	meta: {
// 		a: 'b',
// 		b: 'c'
// 	}
// })

logger.log('info', "[STARTUP] Connecting to DB...", {tags: 'startup,mongo'})
