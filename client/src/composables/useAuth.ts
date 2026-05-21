import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doLogin, doRegister } from '@/api/auth'
import Cookies from 'js-cookie'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import axios from 'axios'
import { toast } from 'vue-sonner'

const useAuth = () => {
  const router = useRouter()
  const isLoading = ref(false)

  const login = async (payload: LoginPayload) => {
    isLoading.value = true

    const loginPromise = doLogin(payload)
      .then((token) => {
        Cookies.set('access_token', token, { expires: 1 })
        router.push('/')
        return token
      })
      .finally(() => {
        isLoading.value = false
      })

    toast.promise(loginPromise, {
      loading: 'Logging in...',
      success: 'Welcome back!',
      error: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          return err.response?.data?.errors || 'Invalid login details'
        }
        return 'An unexpected error occurred'
      },
    })
  }

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true

    const registerPromise = doRegister(payload)
      .then((response) => {
        if (response.success) {
          router.push('/login')
        }
        return response
      })
      .finally(() => {
        isLoading.value = false
      })

    toast.promise(registerPromise, {
      loading: 'Creating account...',
      success: (data: AuthResponse) => data?.message || 'Account created successfully!',
      error: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          return err.response?.data?.errors || 'Registration failed'
        }
        return 'An unexpected error occurred'
      },
    })
  }

  const logout = () => {
    Cookies.remove('access_token')

    toast.info('Logged out safely.')
    router.push('/login')
  }

  return { login, register, logout, isLoading }
}

export default useAuth
