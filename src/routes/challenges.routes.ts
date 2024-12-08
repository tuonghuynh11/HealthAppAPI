import { Router } from 'express'
import { addChallengeController } from '~/controllers/challenges.controllers'
import {
  deleteExerciseController,
  getAllExerciseController,
  getExerciseByIdController,
  searchExercisesController,
  updateExerciseController
} from '~/controllers/exercises.controllers'
import { addChallengeValidator } from '~/middlewares/challenges.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { exercisesSearchValidator, updateExerciseValidator } from '~/middlewares/exercises.middlewares'
import { paginationNavigator } from '~/middlewares/paginations.middlewares'
import { accessTokenValidator, adminRoleValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { UpdateExerciseReqBody } from '~/models/requests/Exercise.requests'
import { wrapRequestHandler } from '~/utils/handles'
const challengesRouter = Router()

/**
 * Description: Search exercise by name
 * Path: ?search = "" &page = 1 &limit = 10 & type = ExerciseCategories & order_by & sort_by
 * Method: GET
 * **/
challengesRouter.get(
  '/',
  accessTokenValidator,
  paginationNavigator,
  exercisesSearchValidator,
  wrapRequestHandler(searchExercisesController)
)

/**
 * Description: Get all exercise
 * Path: /all
 * Method: GET
 * **/
challengesRouter.get('/all', accessTokenValidator, wrapRequestHandler(getAllExerciseController))

/**
 * Description: Get exercise detail
 * Path: /exercises/:id
 * Method: Get
 * Body:
 * **/
challengesRouter.get('/:id', accessTokenValidator, verifiedUSerValidator, wrapRequestHandler(getExerciseByIdController))

/**
 * Description: Add new challenge
 * Path: /
 * Method: Post
 * Body: {
  name: string
  description: string
  type: ChallengeType
  prize_image: string
  prize_title: string
  target: ChallengeTarget
  target_image: string
  fat_percent?: number
  weight_loss_target?: number
  image: string
  start_date: Date
  end_date: Date
  meal?: Meals
  workout_plan?: WorkoutPlans
 * }
 * **/
challengesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUSerValidator,
  // adminRoleValidator,
  addChallengeValidator,
  wrapRequestHandler(addChallengeController)
)

/**
 * Description: Update challenges
 * Path: /:id
 * Method: Patch
  Body: {
  name: string
  description: string
  type: ChallengeType
  prize_image: string
  prize_title: string
  target: ChallengeTarget
  target_image: string
  fat_percent?: number
  weight_loss_target?: number
  image: string
  start_date: Date
  end_date: Date
  meal?: Meals
  workout_plan?: WorkoutPlans
 * }
 * **/
challengesRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  updateExerciseValidator,
  filterMiddleware<UpdateExerciseReqBody>([
    'name',
    'description',
    'category',
    'calories_burn_per_minutes',
    'image',
    'video'
  ]),
  wrapRequestHandler(updateExerciseController)
)

/**
 * Description: Delete Exercise
 * Path: /exercises/:id
 * Method: Delete
 * Body:
 * **/
challengesRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(deleteExerciseController)
)

export default challengesRouter
