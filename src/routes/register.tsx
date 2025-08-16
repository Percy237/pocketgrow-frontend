import { createFileRoute } from '@tanstack/react-router'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Logo } from '@/assets/images'
import { useRegister } from '@/hooks/useAuth'

export const Route = createFileRoute('/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  const { formMethods, onSubmit, isPending } = useRegister()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = formMethods

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="relative flex justify-center">
          <img src={Logo} alt="PocketGrow Logo" className="h-20 w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          Welcome to PocketGrow
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Save smarter, grow faster — your daily 100 FCFA habit made easy.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...registerField('email')}
            error={errors.email?.message}
          />
          <Input
            id="name"
            label="Name"
            type="text"
            placeholder="John Doe"
            {...registerField('name')}
            error={errors.name?.message}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            showPasswordToggle={true}
            {...registerField('password')}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Registering ...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
