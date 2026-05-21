export type AuthResponse = {
  success: boolean
  message: string
  access_token?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}