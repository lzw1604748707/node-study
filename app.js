import express from 'express'
import router from './routes/index.js'
import chalk from 'chalk'

const app = express()

app.all('*', (req, res, next) => {
  const {origin, Origin, referer, Referer} = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) //可以带cookies
  res.header('X-Powered-By', 'Express')
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

router(app)

app.listen(80, () => {
  console.log(chalk.green(`成功监听端口：80`))
})
