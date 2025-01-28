import Cookies from 'js-cookie';

const getCsrfToken = async () => {
    if (!Cookies.get('csrftoken')) {
        promiseResolution('/csrf',
            {
                "method": 'GET',
                "credentials": 'include',
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            },
            (data) => Cookies.set('csrftoken', data.csrftoken));
    }
    return Cookies.get('csrftoken');
};

const UserSession = {
    set: (loggedUser) => Cookies.set('loggedUser', JSON.stringify(loggedUser)),
    get: () => {
        const loggedUser = Cookies.get('loggedUser');
        if (!Boolean(loggedUser)) {
            return null;
        }
        return JSON.parse(loggedUser);
    },
    remove: () => Cookies.remove('loggedUser')
}

const requestTemplate = async (method) => ({
    "method": method,
    "credentials": 'include',
    "headers": {
        "X-CSRFToken": await getCsrfToken(),
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
});

const promiseResolution = async (resource, requestObject, successCallback, setAlertMessage) => {
    fetch(resource, requestObject)
        .then(async response => {
            try {
                if (response.status === 204) {
                    return null;
                }
                return await response.clone().json();
            } catch {
                const error = await response.text();
                throw new Error(error);
            }
        })
        .then((data) => {
            if (!data) {
                successCallback();
            }
            else if (Boolean(data.error)) {
                const error = data.error;
                setAlertMessage({ message: error.message });
            } else {
                successCallback(data);
            }
        })
        .catch(error => console.error(error));
};

const requests = {
    GET: async (resource, successCallback, setAlertMessage) =>
        promiseResolution(resource, await requestTemplate('GET'),
            successCallback, setAlertMessage),
    POST: async (resource, body, successCallback, setAlertMessage) => {
        promiseResolution(resource, {
            ...(await requestTemplate('POST')),
            "body": JSON.stringify(body)
        }, successCallback, setAlertMessage)
    },
    PUT: async (resource, body, successCallback, setAlertMessage) => {
        promiseResolution(resource, {
            ...(await requestTemplate('PUT')),
            "body": JSON.stringify(body)
        }, successCallback, setAlertMessage)
    }
};

const joinClassNames = (...args) => [...args].join(' ');

const checkPathValue = (path, pathname, subRoutes) => {
    const extractedPath = pathname.replace(path, '');
    const matches = /^\/(.*?)\/?$/.exec(extractedPath);
    if (!Boolean(matches)) {
        return false;
    }
    const exactPathChild = matches[1];
    for (let sr of subRoutes) {
        if (exactPathChild.includes(sr)) {
            return `${path}/${sr}`;
        }
    }
    return false;
};

const checkIfSameUser = (user1, user2) => user1.username === user2.username;

export {
    UserSession,
    checkIfSameUser,
    checkPathValue,
    joinClassNames,
    requests
};