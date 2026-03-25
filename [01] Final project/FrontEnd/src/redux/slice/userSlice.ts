import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UserData = {
    id?: number | string
    firstName: string
    lastName: string
    email: string
    role: string
    token?: string
}

interface UserState {
    data: UserData | null
}

const initialState: UserState = {
    data: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserData>) => {
            state.data = action.payload
        },
        logout: (state) => {
            state.data = null
            localStorage.removeItem('accessToken')
        },
    },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer