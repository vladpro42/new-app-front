import { ActionReducerMapBuilder, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

type FetchUserDataParam = {
    email: string, password: string
}

type AccessToken = string


export const fetchUserData = createAsyncThunk<AccessToken, FetchUserDataParam, { rejectValue: null }>(
    'auth/fetchUserData',
    async (param, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<AccessToken>('/auth/login', param);
            return data;
        } catch (error) {
            return rejectWithValue(null);
        }
    }
);

type Loading = 'loading' | 'succeeded' | 'failed'

interface AuthState {
    data: AccessToken | null,
    status: Loading
}

const initialState: AuthState = {
    data: null,
    status: 'loading'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<AccessToken>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            // .addCase(fetchUserData.rejected, (state, action: PayloadAction<null>) => {
            //     state.status = 'failed';
            //     state.data = action.payload;
            // });
    },

})

export const authActions = authSlice.actions

export default authSlice.reducer