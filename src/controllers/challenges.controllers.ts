import { Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { CHALLENGE_MESSAGES, EXERCISE_MESSAGES } from '~/constants/messages'
import { ExerciseReqQuery, UpdateExerciseReqBody } from '~/models/requests/Exercise.requests'
import exerciseService from '~/services/exercises.services'
import { ChallengeReqBody } from '~/models/requests/Challenge.requests'
import challengesService from '~/services/challenge.services'

export const searchExercisesController = async (
  req: Request<ParamsDictionary, any, any, ExerciseReqQuery>,
  res: Response
) => {
  const { search, page, limit, type, sort_by, order_by } = req.query
  const { exercises, total } = await exerciseService.search({
    search: search?.toString(),
    type,
    page,
    limit,
    sort_by,
    order_by
  })
  return res.json({
    message: EXERCISE_MESSAGES.GET_EXERCISE_SUCCESS,
    result: {
      exercises,
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

export const updateExerciseController = async (
  req: Request<ParamsDictionary, any, UpdateExerciseReqBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await exerciseService.update({ id, updateExercise: req.body })

  return res.json({
    message: EXERCISE_MESSAGES.UPDATE_EXERCISE_SUCCESS,
    exercise: result
  })
}
export const getExerciseByIdController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await exerciseService.getById({ id })

  return res.json({
    message: EXERCISE_MESSAGES.GET_EXERCISE_SUCCESS,
    exercise: result
  })
}
export const getAllExerciseController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await exerciseService.getAll()

  return res.json({
    message: EXERCISE_MESSAGES.GET_ALL_EXERCISE_SUCCESS,
    exercises: result
  })
}
export const deleteExerciseController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.params
  const result = await exerciseService.delete({ id })

  return res.json({
    message: EXERCISE_MESSAGES.DELETE_EXERCISE_SUCCESS
  })
}
