import { GeneralStatus, SetType } from '~/constants/enums'
import { SetExerciseReqBody, SetExerciseUpdateReqBody } from './SetExercise.requests'

export interface SetReqBody {
  name: string
  type: SetType
  description?: string
  number_of_exercises: number
  set_exercises: SetExerciseReqBody[]
}
export interface UpdateSetReqBody {
  name?: string
  type?: SetType
  description?: string
  number_of_exercises?: number
  status?: GeneralStatus
  rating?: number
  set_exercises?: SetExerciseUpdateReqBody[]
}
