import { Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { CHALLENGE_MESSAGES, EXERCISE_MESSAGES } from '~/constants/messages'
import exerciseService from '~/services/exercises.services'
import { ChallengeReqBody, ChallengeReqQuery, UpdateChallengeReqBody } from '~/models/requests/Challenge.requests'
import challengesService from '~/services/challenge.services'
import { MealReqBody } from '~/models/requests/Meal.requests'
import { UpdateWorkoutPlanReqBody } from '~/models/requests/WorkoutPlan.requests'

export const searchChallengesController = async (
  req: Request<ParamsDictionary, any, any, ChallengeReqQuery>,
  res: Response
) => {
  const { search, page, limit, type, sort_by, order_by } = req.query
  const { challenges, total } = await challengesService.search({
    search: search?.toString(),
    type,
    page,
    limit,
    sort_by,
    order_by
  })
  return res.json({
    message: CHALLENGE_MESSAGES.GET_CHALLENGE_SUCCESS,
    result: {
      challenges,
      page: Number(page),
      limit: Number(limit),
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}

export const addChallengeController = async (req: Request<ParamsDictionary, any, ChallengeReqBody>, res: Response) => {
  const { user_id, role } = req.decoded_authorization as TokenPayload

  const result = await challengesService.add({ challenge: req.body, userId: user_id, role })

  return res.json({
    message: CHALLENGE_MESSAGES.ADD_CHALLENGE_SUCCESS,
    challenge: result
  })
}

export const updateChallengeController = async (
  req: Request<ParamsDictionary, any, UpdateChallengeReqBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await challengesService.update({ id, updateChallenge: req.body })

  return res.json({
    message: CHALLENGE_MESSAGES.UPDATE_CHALLENGE_SUCCESS,
    challenge: result
  })
}
export const updateChallengeMealController = async (
  req: Request<ParamsDictionary, any, MealReqBody>,
  res: Response
) => {
  const { id } = req.params

  const result = await challengesService.updateMeal({ id, updateMeal: req.body })

  return res.json({
    message: CHALLENGE_MESSAGES.UPDATE_MEAL_CHALLENGE_SUCCESS,
    meal: result
  })
}
export const updateChallengeWorkoutController = async (
  req: Request<ParamsDictionary, any, UpdateWorkoutPlanReqBody>,
  res: Response
) => {
  const { id } = req.params

  const result = await challengesService.updateWorkout({ id, updateWorkoutPlan: req.body })

  return res.json({
    message: CHALLENGE_MESSAGES.UPDATE_WORKOUT_CHALLENGE_SUCCESS,
    workout: result
  })
}
export const getChallengeByIdController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await challengesService.getById({ id })

  return res.json({
    message: CHALLENGE_MESSAGES.GET_CHALLENGE_SUCCESS,
    challenge: result
  })
}
export const getAllExerciseController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await exerciseService.getAll()

  return res.json({
    message: EXERCISE_MESSAGES.GET_ALL_EXERCISE_SUCCESS,
    exercises: result
  })
}
export const joinChallengeController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await challengesService.join({ user_id, id })

  return res.json({
    message: CHALLENGE_MESSAGES.JOIN_CHALLENGE_SUCCESS,
    user: result
  })
}
export const activateChallengeController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params

  const result = await challengesService.activate({ id })

  return res.json({
    message: CHALLENGE_MESSAGES.ACTIVATE_CHALLENGE_SUCCESS
  })
}
export const deactivateChallengeController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params

  const result = await challengesService.deactivate({ id })

  return res.json({
    message: CHALLENGE_MESSAGES.DEACTIVATE_CHALLENGE_SUCCESS
  })
}
export const deleteChallengeController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await challengesService.delete({ id })

  return res.json({
    message: CHALLENGE_MESSAGES.DELETE_CHALLENGE_SUCCESS
  })
}
