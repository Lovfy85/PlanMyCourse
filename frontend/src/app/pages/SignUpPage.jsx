import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  username: z.string()
    .nonempty("Username must be not empty")
    .max(20, "Username must be less than 20 characters"),
  password: z.string()
    .nonempty("Password must be not empty")
    .min(5, "Password Must be at least 5 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

function SignUpPage() {
  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    const userData = {
      username: data.username,
      password: data.password
    }
    console.log(userData)

  }

  return (
    <div className='registrationContainer'>
        <form className='registrationCard' onSubmit={handleSubmit(onSubmit)}>
          <div className='registrationTitle'>Registration</div>
          <p> Username </p>
          <input className='usernameInput' 
            placeholder='Enter Username'
            {...register("username")}
          />
          <p className='errorMessage'>{errors.username?.message}</p>
          <p> Password </p>
          <input className='passwordInput' 
            type='password' 
            placeholder='Enter Password'
            {...register("password")}
          />
          <p className='errorMessage'>{errors.password?.message}</p>
          <p> Confirm Password </p>
          <input className='confirmPasswordInput' 
            type='password' 
            placeholder='Confirm Password'
            {...register("confirmPassword")}
          />
          <p className='errorMessage'>{errors.confirmPassword?.message}</p>
          <button className='saveBtn' type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default SignUpPage