import { Router } from 'express'
import { getMessagesInChatRoomController } from '~/controllers/chats.controllers'
import { getStatisticAboutTopController } from '~/controllers/statistics.controllers'
import { paginationNavigator } from '~/middlewares/paginations.middlewares'
import { accessTokenValidator, adminRoleValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handles'
const statisticsRouter = Router()

/**
 * Description: Get Messages in chat room
 * Path: /:chat_room_id/messages?page = 1 &limit = 10
 * Method: GET
 * **/
statisticsRouter.get(
  '/:chat_room_id/messages',
  accessTokenValidator,
  paginationNavigator,
  wrapRequestHandler(getMessagesInChatRoomController)
)

/**
 * Description: Get top menu, workout_set and exercise
 * Path: /top
 * Method: Get
 * Body:
 * **/
statisticsRouter.get(
  '/top',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(getStatisticAboutTopController)
)

export default statisticsRouter
