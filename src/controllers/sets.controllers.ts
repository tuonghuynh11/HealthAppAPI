import { Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { SETS_MESSAGES } from '~/constants/messages'
import setService from '~/services/sets.services'
import { SetReqBody, UpdateSetReqBody } from '~/models/requests/Set.requests'
import { BaseReqQuery } from '~/models/requests/Index.request'

export const searchSetsController = async (req: Request<ParamsDictionary, any, any, BaseReqQuery>, res: Response) => {
  const { user_id, role } = req.decoded_authorization as TokenPayload

  const { search, type, page, limit, sort_by, order_by } = req.query
  const { sets, total } = await setService.search({
    search: search?.toString(),
    page,
    limit,
    sort_by,
    order_by,
    type,
    user_id,
    role
  })
  return res.json({
    message: SETS_MESSAGES.GET_SET_SUCCESS,
    result: {
      sets,
      page: Number(page),
      limit: Number(limit),
      total_items: total,
      total_pages: Math.ceil(total / limit)
    }
  })
}

export const addSetController = async (req: Request<ParamsDictionary, any, SetReqBody>, res: Response) => {
  const { user_id, role } = req.decoded_authorization as TokenPayload

  const result = await setService.add({ set: req.body, user_id, role })

  return res.json({
    message: SETS_MESSAGES.ADD_SET_SUCCESS,
    set: result
  })
}

export const updateSetController = async (req: Request<ParamsDictionary, any, UpdateSetReqBody>, res: Response) => {
  const { id } = req.params
  const result = await setService.update({ id, updateSet: req.body })

  return res.json({
    message: SETS_MESSAGES.UPDATE_SET_SUCCESS,
    set: result
  })
}
export const getSetByIdController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id, role } = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await setService.getById({ id, user_id, role })

  return res.json({
    message: SETS_MESSAGES.GET_SET_SUCCESS,
    set: result
  })
}

export const deleteSetsController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id, role } = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await setService.delete({ id, user_id, role })

  return res.json({
    message: SETS_MESSAGES.DELETE_SET_SUCCESS
  })
}
