const API_BASE_URL = "http://localhost:8080/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(API_BASE_URL + endpoint, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json();
}