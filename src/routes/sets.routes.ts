import { Router } from 'express'
import {
  addSetController,
  deleteSetsController,
  getSetByIdController,
  searchSetsController,
  updateSetController
} from '~/controllers/sets.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { paginationNavigator } from '~/middlewares/paginations.middlewares'
import { addSetValidator, setsSearchValidator, updateSetValidator } from '~/middlewares/sets.middlwates'
import { accessTokenValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { UpdateSetReqBody } from '~/models/requests/Set.requests'
import { wrapRequestHandler } from '~/utils/handles'
const setsRouter = Router()

/**
 * Description: Search set by name
 * Path: ?search = "" &page = 1 &limit = 10 & order_by & sort_by
 * Method: GET
 * **/
setsRouter.get(
  '/',
  accessTokenValidator,
  paginationNavigator,
  setsSearchValidator,
  wrapRequestHandler(searchSetsController)
)
/**
 * Description: Get set detail
 * Path: /sets/:id
 * Method: Get
 * Body:
 * **/
setsRouter.get('/:id', accessTokenValidator, verifiedUSerValidator, wrapRequestHandler(getSetByIdController))

/**
 * Description: Add new set
 * Path: /sets
 * Method: Post
 * Body: {
    name: string
    type: SetType
    description: string
    user_id?: ObjectId
    number_of_exercise: number
    status?: GeneralStatus
    rating: number
    created_at?: Date
    updated_at?: Date
    set_exercises: SetExercises[]
 * }
 * **/
setsRouter.post('/', accessTokenValidator, verifiedUSerValidator, addSetValidator, wrapRequestHandler(addSetController))

/**
 * Description: Update set
 * Path: /sets/:id
 * Method: patch
 * Body: {
    name: string
    type: SetType
    description: string
    number_of_exercises: number
    status: GeneralStatus
    rating: number
    set_exercises: SetExerciseReqBody[]
 * }
 * **/
setsRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  updateSetValidator,
  filterMiddleware<UpdateSetReqBody>([
    'name',
    'type',
    'description',
    'number_of_exercises',
    'status',
    'rating',
    'set_exercises'
  ]),
  wrapRequestHandler(updateSetController)
)

/**
 * Description: Delete set
 * Path: /sets/:id
 * Method: Delete
 * Body:
 * **/
setsRouter.delete('/:id', accessTokenValidator, verifiedUSerValidator, wrapRequestHandler(deleteSetsController))

export default setsRouter
