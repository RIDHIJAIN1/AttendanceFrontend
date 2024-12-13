import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    employees:[]
}

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers:{
        addEmployee:(state, action)=>{
            state.employees.push(action.payload)
        },
        clearEmployee:(state)=>{
            state.employees=[];
        }
    },
});

export const {addEmployee , clearEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;