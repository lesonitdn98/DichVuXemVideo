import { authHeader } from '../_helpers';
const TOKEN_KEY = 'jwt';

export const userService = {
    signup,
    login,
    logout,
    getUser,
    getAllCategory,
    getCategory,
    getCategoryPosts,
    getPosts,
    addPost
};

function signup(name, email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
    };
    return fetch(`/api/signup`, requestOptions).then(handleResponse).then(data => {
        return data;
    });
}

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`/api/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // login successful if there's a user in the response
            if (data.token) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
            }

            return data;
        });
}

function logout() {
    // remove user from local storage to log user out
    // let data = JSON.parse(localStorage.getItem(TOKEN_KEY)).token;
    localStorage.removeItem(TOKEN_KEY);
    // if(data){
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: authHeader(),
    //         body: JSON.stringify({ token })
    //     };
    //     return fetch(`/api/logout`, requestOptions).then(handleResponse);
    // }
}

function getUser() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/auth`, requestOptions).then(handleResponse);
}

function getAllCategory()
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/category`, requestOptions).then(handleResponse);
}

function getCategory(id)
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/category/` + id, requestOptions).then(handleResponse);
}

function getCategoryPosts(id)
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/category/` + id + `/post`, requestOptions).then(handleResponse);
}

function getPosts()
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/post`, requestOptions).then(handleResponse);
}

function addPost(name, description, video_id, category_id) 
{
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ name, description, video_id, category_id })
    };
    return fetch(`/api/category/` + category_id + `/post`, requestOptions).then(handleResponse).then(data => {
        return data;
    });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}