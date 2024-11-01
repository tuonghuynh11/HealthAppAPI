import express from 'express'
import swaggerUi from 'swagger-ui-express'
import usersRouter from './users.routes'
import mediaRouter from './media.routes'
import path from 'path'
import YAML from 'yaml'
import fs from 'fs'

const file = fs.readFileSync(path.resolve('slda-swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)
const versionOneRouter = express.Router()

versionOneRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
versionOneRouter.use('/users', usersRouter)
versionOneRouter.use('/medias', mediaRouter)

export { versionOneRouter }
