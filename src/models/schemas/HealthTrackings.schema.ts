import { ObjectId } from 'mongodb'
import { HealthTrackingType } from '~/constants/enums'
import HealthTrackingDetail from './HealthTrackingDetails.schema'

interface IHealthTracking {
  _id?: ObjectId
  date: string
  type: HealthTrackingType
  user_id?: ObjectId
  value: number // actual calories
  target: number // expected calories
  created_at?: Date
  updated_at?: Date
  healthTrackingDetails?: HealthTrackingDetail[]
}

export default class HealthTracking {
  _id?: ObjectId
  date: string
  type: HealthTrackingType
  user_id?: ObjectId
  value: number
  target: number
  created_at?: Date
  updated_at?: Date
  healthTrackingDetails: HealthTrackingDetail[]

  constructor(healthTracking: IHealthTracking) {
    const date = new Date()
    this._id = healthTracking._id
    this.date = healthTracking.date
    this.type = healthTracking.type
    this.user_id = healthTracking.user_id
    this.value = healthTracking.value
    this.target = healthTracking.target
    this.created_at = healthTracking.created_at || date
    this.updated_at = healthTracking.updated_at || date
    this.healthTrackingDetails = healthTracking.healthTrackingDetails || []
  }
}
