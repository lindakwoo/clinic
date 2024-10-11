const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
        const response = await fetch("http://localhost:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Failed to refresh access token");
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        return data.access;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";  // Redirect to login
        throw error;
    }
};

const customFetch = async (url, options = {}) => {
    const csrfToken = getCookie('csrftoken');
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token:", accessToken);
    console.log(csrfToken)

    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            'X-CSRFToken': csrfToken,
        },
    };

    console.log(fetchOptions)
    try {
        let response = await fetch(url, fetchOptions);

        if (response.status === 401) {
            // Attempt to refresh the access token
            accessToken = await refreshAccessToken();
            fetchOptions.headers.Authorization = `Bearer ${accessToken}`;
            response = await fetch(url, fetchOptions);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.status !== 204 ? await response.json() : {}
        console.log("data", data)

        return data;

    } catch (error) {
        console.error("Error during fetch:", error);
        throw error;  // Re-throw the error after logging it

    }

};

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

export default customFetch;
