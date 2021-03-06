import {followAPI, usersAPI} from "../api/api";
import {setFriendsTC} from "./FriendsReducer";

const FOLLOW = 'findUsersPage/FOLLOW'
const UNFOLLOW = 'findUsersPage/UNFOLLOW'
const SET_USERS = 'findUsersPage/SETUSERS'
const SET_CURRENT_PAGE = 'findUsersPage/SET_CURRENT_PAGE'
const SET_TOTAL_USERS_COUNT = 'findUsersPage/SET_TOTAL_USERS_COUNT'
const TOGGLE_IS_FETCHING = 'findUsersPage/TOGGLE_IS_FETCHING'
const TOGGLE_FOLLOWING_PROGRESS = 'findUsersPage/TOGGLE_FOLLOWING_PROGRESS'

//state
let initialState = {
    users: [],
    pageSize: 5,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingProgress: []
};

const findUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FOLLOW :
            return {
                ...state,
                users: state.users.map(u => {
                    if (u.id === action.userId) {
                        return {...u, followed: true}
                    }
                    return u
                })
            }
        case UNFOLLOW :
            return {
                ...state,
                users: state.users.map(u => {
                    if (u.id === action.userId) {
                        return {...u, followed: false}
                    }
                    return u
                })
            }
        case SET_USERS :
            return {
                ...state,
                users: [...action.users]
            }
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage
            }
        case SET_TOTAL_USERS_COUNT:
            return {
                ...state,
                totalUsersCount: action.totalCount
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case TOGGLE_FOLLOWING_PROGRESS:
            return {
                ...state,
                followingProgress: action.isFetching
                    ? [...state.followingProgress, action.userId]
                    : state.followingProgress.filter(id => id !== action.userId)
            }
        default:
            return state
    }
}
//action creaters
export const follow = (userId) => {
    return {type: FOLLOW, userId}
}
export const unfollow = (userId) => {
    return {type: UNFOLLOW, userId}
}
export const setUsers = (users) => {
    return {type: SET_USERS, users}
}
export const setCurrentPage = (currentPage) => {
    return {type: SET_CURRENT_PAGE, currentPage}
}
export const setTotalUsersCount = (totalCount) => {
    return {type: SET_TOTAL_USERS_COUNT, totalCount}
}
export const toggleIsFetching = (isFetching) => {
    return {type: TOGGLE_IS_FETCHING, isFetching}
}
export const toggleFollowingProgress = (isFetching, userId) => {
    return {type: TOGGLE_FOLLOWING_PROGRESS, isFetching, userId}
}

export default findUsersReducer

export const getUsersTC = (currentPage, pageSize) => async (dispatch) => {
    dispatch(setCurrentPage(currentPage))
    dispatch(toggleIsFetching(true))
    dispatch(setUsers(''))
    dispatch(setTotalUsersCount(''))
    let response = await usersAPI.getUsers(currentPage, pageSize)
    dispatch(toggleIsFetching(false))
    dispatch(setUsers(response.items))
    dispatch(setTotalUsersCount(response.totalCount))
}

export const unfollowTC = (userId) => async (dispatch) => {
    dispatch(toggleFollowingProgress(true, userId))
    let response = await followAPI.unfollow(userId)
    if (response.resultCode === 0) {
        dispatch(unfollow(userId))
    }
    dispatch(toggleFollowingProgress(false, userId))
    dispatch(setFriendsTC())
}

export const followTC = (userId) => async (dispatch) => {
    dispatch(toggleFollowingProgress(true, userId))
    let response = await followAPI.follow(userId)
    if (response.resultCode === 0) {
        dispatch(follow(userId))
    }
    dispatch(toggleFollowingProgress(false, userId))
    dispatch(setFriendsTC())
}
