import jwt from "jwt-decode";


export var onChangeLogin = new Set();

function notify()
{
    const status =  isLoggedIn();
    onChangeLogin.forEach(t=>t(status));
}

export const addOnChangeLoginListener = (listener)=>{
    onChangeLogin.add(listener);
}

export const removeOnChangeLoginListener = (listener)=>{
    onChangeLogin.delete(listener);
}

export const isLoggedIn = ()=>{
    return localStorage.getItem('token') !== null;
}

export const login = (token)=>{
    localStorage.setItem("token", token);
    const decoded = jwt(localStorage.getItem('token'));
    localStorage.setItem("roles", decoded['roles']);
    notify();
}

export const isAdmin = () =>{
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decoded = jwt(token);
    return decoded['roles'].includes("ROLE_admin");
}

export const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    window.location="/home";
    notify();
}
export const getToken = ()=>{
    return localStorage.getItem('token');
}
