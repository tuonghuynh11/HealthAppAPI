import { Router } from 'express'
import { uploadVideoController } from '~/controllers/medias.controllers'
import { accessTokenValidator, adminRoleValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'
const mediaRouter = Router()

mediaRouter.post('/word/upload-video', accessTokenValidator, wrapRequestHandler(uploadVideoController))
export default mediaRouter
