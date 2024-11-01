import { ObjectId } from 'mongodb'
import { GeneralStatus, SetType } from '~/constants/enums'
import Exercise from './Exercises.schema'

interface ISet {
  _id?: ObjectId
  name: string
  type: SetType
  description: string
  user_id?: ObjectId
  number_of_exercise: number
  status?: GeneralStatus
  rating: number
  created_at?: Date
  updated_at?: Date
  exercises: Exercise[]
}

export default class Sets {
  _id?: ObjectId
  name: string
  type: SetType
  description: string
  user_id?: ObjectId
  number_of_exercise: number
  status?: GeneralStatus
  rating: number
  created_at?: Date
  updated_at?: Date
  exercises: Exercise[]

  constructor(set: ISet) {
    const date = new Date()
    this._id = set._id
    this.name = set.name
    this.type = set.type
    this.description = set.description
    this.user_id = set.user_id
    this.number_of_exercise = set.number_of_exercise
    this.status = set.status || GeneralStatus.Undone
    this.rating = set.rating || 0
    this.created_at = set.created_at || date
    this.updated_at = set.updated_at || date
    this.exercises = set.exercises || []
  }
}
