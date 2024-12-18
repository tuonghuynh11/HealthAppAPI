import { Router } from 'express'
import {
  addIngredientController,
  deleteIngredientController,
  getIngredientByIdController,
  searchIngredientController,
  updateIngredientController
} from '~/controllers/ingredients.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  addIngredientValidator,
  ingredientsSearchValidator,
  updateIngredientValidator
} from '~/middlewares/ingredients.middlewares'
import { paginationNavigator } from '~/middlewares/paginations.middlewares'
import { accessTokenValidator, adminRoleValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { UpdateIngredientReqBody } from '~/models/requests/Ingredient.requests'
import { wrapRequestHandler } from '~/utils/handles'
const ingredientsRouter = Router()

/**
 * Description: Search ingredient by name
 * Path: ?search = "" &page = 1 &limit = 10 & order_by & sort_by
 * Method: GET
 * **/
ingredientsRouter.get(
  '/',
  accessTokenValidator,
  paginationNavigator,
  ingredientsSearchValidator,
  wrapRequestHandler(searchIngredientController)
)

// /**
//  * Description: Get all ingredients
//  * Path: /all
//  * Method: GET
//  * **/
// ingredientsRouter.get('/all', accessTokenValidator, wrapRequestHandler(getAllExerciseController))

/**
 * Description: Get ingredient detail
 * Path: /:id
 * Method: Get
 * Body:
 * **/
ingredientsRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(getIngredientByIdController)
)

/**
 * Description: Add new ingredient
 * Path: /
 * Method: Post
 * Body: {
 * name: string
 * description: string
 * calories: number
 * image: string
 * cab?: number
 * sodium?: number
 * sugar?: number
 * cholesterol?: number
 * fat?: number
 * protein?: number
 * }
 * **/
ingredientsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  addIngredientValidator,
  wrapRequestHandler(addIngredientController)
)

/**
 * Description: Update ingredient
 * Path: /:id
 * Method: Patch
 * Body: {
 * name: string
 * description: string
 * calories: number
 * image: string
 * cab?: number
 * sodium?: number
 * sugar?: number
 * cholesterol?: number
 * fat?: number
 * protein?: number
 * }
 * **/
ingredientsRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  updateIngredientValidator,
  filterMiddleware<UpdateIngredientReqBody>([
    'name',
    'description',
    'calories',
    'image',
    'cab',
    'sodium',
    'sugar',
    'cholesterol',
    'fat',
    'protein'
  ]),
  wrapRequestHandler(updateIngredientController)
)

/**
 * Description: Delete Ingredient
 * Path:/:id
 * Method: Delete
 * Body:
 * **/
ingredientsRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(deleteIngredientController)
)

export default ingredientsRouter
