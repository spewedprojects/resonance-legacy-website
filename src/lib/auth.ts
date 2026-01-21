export const checkAuth = (): boolean => {
    const isAuth = localStorage.getItem("isAdminAuthenticated");
    return isAuth === "true";
};

export const login = (password: string): boolean => {
    // Simple hardcoded password for demonstration
    if (password === "admin123") {
        localStorage.setItem("isAdminAuthenticated", "true");
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem("isAdminAuthenticated");
};
