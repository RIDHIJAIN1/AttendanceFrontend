import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import authReducer from '../features/auth/authSlice'
import employeeReducer from '../features/employee/employeeSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  },
  reducer:{
    auth : authReducer
  },
  reducer:{
    employee: employeeReducer
  }


})