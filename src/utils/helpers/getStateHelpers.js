
export const getIdentity = (getState) => {
    let { identity } = getState();
    return identity;
}

export const getToken = (getState) => {
    let { token } = getIdentity(getState);
    return token;
}

export const getUsername = (getState) => {
    let { username } = getIdentity(getState);
    return username;
}