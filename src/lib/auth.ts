const PASSWORD_STORAGE_KEY = "resonance_admin_password";
const AUTH_STORAGE_KEY = "isAdminAuthenticated";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

export const getAdminPassword = (): string => {
    if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
};

export const checkAuth = (): boolean => {
    if (typeof window === "undefined") return false;
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return isAuth === "true";
};

export const login = (password: string): boolean => {
    if (typeof window === "undefined") return false;
    if (password === getAdminPassword()) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        return true;
    }
    return false;
};

export const changePassword = (
    currentPassword: string,
    newPassword: string,
): { success: boolean; message: string } => {
    if (typeof window === "undefined") {
        return { success: false, message: "Browser storage not available" };
    }

    const currentSaved = getAdminPassword();
    if (currentPassword !== currentSaved) {
        return {
            success: false,
            message: "The last used (current) password entered is incorrect.",
        };
    }

    if (!newPassword || newPassword.trim().length < 4) {
        return {
            success: false,
            message: "New password must be at least 4 characters long.",
        };
    }

    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword.trim());
    return {
        success: true,
        message: "Admin password has been updated successfully.",
    };
};

export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
};
