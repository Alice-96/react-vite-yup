export interface User {
  id: number
  name: string
  email: string
  phone?: string
  website?: string
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}
