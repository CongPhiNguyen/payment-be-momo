const emailRouter = require('./email.router')
const momoRouter = require('./momo.router')
const shipRouter = require('./ship.router')

function route(app) {
    app.use('/email', emailRouter)
    app.use('/momo', momoRouter)
    app.use('/ship', shipRouter)
}

module.exports = route;