export const BASE_URL = "http://localhost:5001"; 

// /api/user'
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/user-profile",
        LOGOUT: "/api/auth/logout"
    },

    USERS: {
        GET_ALL_USERS: "/api/user/users", 
        GET_USER_BY_ID: (userId) => `/api/user/users/${userId}`, 
        CREATE_USER: '/api/user', 
        UPDATE_USER: (userId) => `/api/user/users/${userId}`, 
        DELETE_USER: (userId) => `/api/user/users/${userId}`,
        UPDATE_ADMIN: (userId) => `/api/admin/${userId}`,
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard", 
        GET_USER_DASHBOARD_DATA: `/api/tasks/user-dashboard`, 
        GET_ALL_TASKS: `/api/tasks/tasks`,  
        GET_TASK_BY_ID: (taskId) => `/api/tasks/tasks/${taskId}`, 
        CREATE_TASK: `/api/tasks/task`, 
        UPDATE_TASK: (taskId) => `/api/tasks/tasks/${taskId}`, 
        DELETE_TASK: (taskId) => `/api/tasks/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/tasks/${taskId}/todo`
    },

    REPORTS: {
        EXPORT_TASKS: `/api/reports/tasks`,
        EXPORT_USERS: `/api/reports/users`,
    },

    IMAGE: {
        UPLOAD_IMAGE: `/api/upload-image`,
    }
} 