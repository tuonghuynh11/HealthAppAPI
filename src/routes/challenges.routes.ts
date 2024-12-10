import { Router } from 'express'
import {
  activateChallengeController,
  addChallengeController,
  deactivateChallengeController,
  deleteChallengeController,
  getChallengeByIdController,
  joinChallengeController,
  searchChallengesController,
  updateChallengeController,
  updateChallengeMealController,
  updateChallengeWorkoutController
} from '~/controllers/challenges.controllers'
import {
  addChallengeValidator,
  challengeSearchValidator,
  updateChallengesValidator
} from '~/middlewares/challenges.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { paginationNavigator } from '~/middlewares/paginations.middlewares'
import { accessTokenValidator, adminRoleValidator, verifiedUSerValidator } from '~/middlewares/users.middlewares'
import { UpdateChallengeReqBody } from '~/models/requests/Challenge.requests'
import { wrapRequestHandler } from '~/utils/handles'
const challengesRouter = Router()

/**
 * Description: Search challenge by name
 * Path: ?search = "" &page = 1 &limit = 10 & type = ExerciseCategories & order_by & sort_by
 * Method: GET
 * **/
challengesRouter.get(
  '/',
  accessTokenValidator,
  paginationNavigator,
  challengeSearchValidator,
  wrapRequestHandler(searchChallengesController)
)

/**
 * Description: Get challenge detail
 * Path: /:id
 * Method: Get
 * Body:
 * **/
challengesRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(getChallengeByIdController)
)

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
  adminRoleValidator,
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
  status: ChallengeStatus
 * }
 * **/
challengesRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  updateChallengesValidator,
  filterMiddleware<UpdateChallengeReqBody>([
    'name',
    'description',
    'type',
    'prize_image',
    'prize_title',
    'target',
    'target_image',
    'fat_percent',
    'weight_loss_target',
    'image',
    'start_date',
    'end_date',
    'status'
  ]),
  wrapRequestHandler(updateChallengeController)
)

/**
 * Description: Update meal challenges
 * Path: /:id/meal
 * Method: Put
 * Body: {
 *  name: string
 *  date: Date
 *  description: string
 *  calories: number
 *  pre_time: number
 *  type: MealType
 *  dishes: Dishes[]
 * }
 * }
 * **/
challengesRouter.put(
  '/:id/meal',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(updateChallengeMealController)
)
/**
 * Description: Update workout challenges
 * Path: /:id/workout
 * Method: Put
 * Body: {
 *  name: string
 *  description: string
 *  number_of_set: number
 *  estimated_calories_burned: number
 *  type: WorkoutType
 *  start_date?: Date
 *  end_date?: Date
 *  status: GeneralStatus
 * }
 * **/
challengesRouter.put(
  '/:id/workout',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(updateChallengeWorkoutController)
)

/**
 * Description: Join a challenges
 * Path: /join/:id
 * Method: Post
 * **/
challengesRouter.post(
  '/join/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  wrapRequestHandler(joinChallengeController)
)
/**
 * Description: Activate challenges
 * Path: /:id/activate
 * Method: Post
 * **/
challengesRouter.post(
  '/:id/activate',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(activateChallengeController)
)
/**
 * Description: Deactivate challenges
 * Path: /:id/deactivate
 * Method: Post
 * **/
challengesRouter.post(
  '/:id/deactivate',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(deactivateChallengeController)
)

/**
 * Description: Delete challenges
 * Path: /:id
 * Method: Delete
 * Body:
 * **/
challengesRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUSerValidator,
  adminRoleValidator,
  wrapRequestHandler(deleteChallengeController)
)

export default challengesRouter
