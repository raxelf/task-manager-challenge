import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doLogin, doRegister } from '@/api/auth'
import Cookies from 'js-cookie'
import type { LoginPayload, RegisterPayload } from '@/types/auth'
import axios, { AxiosError } from 'axios'
import { toast } from 'vue-sonner'

const useAuth = () => {
  const router = useRouter()
  const isLoading = ref(false)

  const login = async (payload: LoginPayload) => {
    try {
      isLoading.value = true

      const token = await doLogin(payload)
      Cookies.set('access_token', token, { expires: 1 })

      toast.success('Welcome back!')
      router.push('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ errors?: string }>

        toast.error(axiosError.response?.data?.errors || 'Invalid login details')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      isLoading.value = true

      const response = await doRegister(payload)

      if (response.success) {
        toast.success(response.message || 'Account created successfully!')

        router.push('/login')
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ errors?: string }>

        toast.error(axiosError.response?.data?.errors || 'Registration failed')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    Cookies.remove('access_token')

    toast.info('Logged out safely.')
    router.push('/login')
  }

  return { login, register, logout, isLoading }
}

export default useAuth
