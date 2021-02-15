const logger = require('./controllers/Logger.controller')

logger.log({
	level: 'hello',
	message: 'this is a test message',
	meta: {
		a: 'b',
		b: 'c'
	}
})
