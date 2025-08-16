import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ApiError } from '@/types/api.types'
import type { LoginFormData, RegisterFormData } from '@/types/auth.types'
import { loginUser, registerUser } from '@/services/auth.service'
import { loginSchema, registerSchema } from '@/types/auth.types'
import { useAuth } from '@/contexts/AuthContext'

export const useRegister = () => {
  const formMethods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful!')
      navigate({ to: '/login' })
    },
    onError: (error: ApiError) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          formMethods.setError(field as keyof RegisterFormData, {
            type: 'server',
            message: messages.join(', '),
          })
        })
      }
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data)
  }

  return {
    formMethods,
    onSubmit,
    isPending: mutation.isPending,
  }
}

export const useLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      console.log('data:', data)
      login(data.token, data.user)
      if (data.user.role === 'colleague') {
        navigate({ to: '/my-savings' })
      } else if (data.user.role === 'admin') {
        navigate({ to: '/admin' })
      }
      toast.success('Login successful!')
    },
    onError: (error: ApiError) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          formMethods.setError(field as keyof LoginFormData, {
            type: 'server',
            message: messages.join(', '),
          })
        })
      } else {
        toast.error(error.message || 'Login failed')
      }
    },
  })

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data)
  }

  return {
    formMethods,
    onSubmit,
    isPending: mutation.isPending,
  }
}
