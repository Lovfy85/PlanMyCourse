import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css'

const schema = z.object({
  username: z.string()
    .nonempty("Username must be not empty")
    .max(20, "Username must be less than 20 characters")
    .regex(/^\S*$/, "Username cannot contain spaces"),
  password: z.string()
    .nonempty("Password must be not empty")
    .min(5, "Password Must be at least 5 characters"),
});

function LoginPage() {
  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: zodResolver(schema),
  })
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  
  const onSubmit = async (data) => {
    const userData = {
      username: data.username,
      password: data.password
    }
    try {
        await axios.post('http://localhost:3001/auth/login', userData, {withCredentials: true})
        .then((response) => {
            console.log('User registered successfully:', response.data);
            setServerError("");
            window.location.href = '/'; // reload and navigate to home

        })
        .catch((error) => {
            setServerError(error.response.data.error);
        });
    } catch (error) {
        console.error('Error registering user:', error);
    }
  }

  return (
    <div className='signUpContainer'>
        <form className='signUpCard' onSubmit={handleSubmit(onSubmit)}>
          <div className='signUpTitle'>Login</div>
          <div className = 'signUpDiv'></div>
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
          <p className='errorMessage'>{serverError}</p>
          <button className='saveBtn' type='submit'>Log In</button>
          <span className='signUpRegister'>
            Don't have an account? <span id='signUpRegisterLink' onClick={() => navigate("/signup")}>Register</span>
          </span>
        </form>
    </div>
  )
}

export default LoginPage