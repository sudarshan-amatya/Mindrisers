import { createSlice,type PayloadAction } from '@reduxjs/toolkit'

type UserData = {
    id?: number | string
    firstName: string
    lastName: string
    email: string
    isSeller: boolean
    isAdmin: boolean
    sellerRequestStatus: 'none' | 'pending' | 'approved' | 'rejected'
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
        updateSellerStatus: (state, action: PayloadAction<boolean>) => {
            if (state.data) {
                state.data.isSeller = action.payload
            }
        },
    },
})

export const { login, logout, updateSellerStatus } = userSlice.actions
export default userSlice.reducer