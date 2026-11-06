import { syncToCloud } from "./siteData";

const PASSWORD_HASH_KEY = "resonance_admin_password_hash";
const INITIALIZED_KEY = "resonance_admin_initialized";
const AUTH_STORAGE_KEY = "isAdminAuthenticated";
const LEGACY_STORAGE_KEY = "resonance_admin_password";
const PASSWORD_UPDATED_AT_KEY = "resonance_admin_password_updated_at";

export const getPasswordLastChanged = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PASSWORD_UPDATED_AT_KEY);
};

export const setPasswordLastChanged = (timestamp?: string) => {
    if (typeof window === "undefined") return;
    const ts = timestamp || new Date().toISOString();
    localStorage.setItem(PASSWORD_UPDATED_AT_KEY, ts);
};

// Master setup and emergency recovery key (configurable via hosting environment variable)
export const MASTER_SETUP_KEY =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_ADMIN_MASTER_KEY) ||
    "Resonance@Admin2026!";

const SALT = "resonance_auth_salt_v2_";

/**
 * Computes a secure SHA-256 hash of the password using Web Crypto API
 */
export const hashPassword = async (password: string): Promise<string> => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(SALT + password);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        } catch (e) {
            console.warn("Web Crypto failed, falling back to fallback hashing", e);
        }
    }
    // Deterministic fallback for non-crypto environments (SSR/testing)
    let hash = 0;
    const str = SALT + password;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
};

/**
 * Checks whether an administrator password has been customized and initialized
 */
export const isPasswordInitialized = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(INITIALIZED_KEY) === "true";
};

/**
 * Checks whether current user is authenticated
 */
export const checkAuth = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
};

/**
 * First-Time Setup: Requires the Master Verification Key to claim and secure the admin account
 */
export const setupInitialPassword = async (
    masterKey: string,
    newPassword: string,
): Promise<{ success: boolean; message: string }> => {
    if (typeof window === "undefined") {
        return { success: false, message: "Browser storage not available" };
    }

    if (!masterKey || masterKey.trim() !== MASTER_SETUP_KEY) {
        return {
            success: false,
            message: "Invalid Master Setup Key. Please verify your ownership credentials.",
        };
    }

    if (!newPassword || newPassword.trim().length < 6) {
        return {
            success: false,
            message: "New password must be at least 6 characters long for security.",
        };
    }

    const hashed = await hashPassword(newPassword.trim());
    const updatedAt = new Date().toISOString();
    localStorage.setItem(PASSWORD_HASH_KEY, hashed);
    localStorage.setItem(INITIALIZED_KEY, "true");
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setPasswordLastChanged(updatedAt);

    // Sync auth state to cloud backend if connected
    syncToCloud("resonance_admin_auth", {
        hash: hashed,
        initialized: true,
        updatedAt,
    });

    return {
        success: true,
        message: "Admin password successfully initialized and secured!",
    };
};

/**
 * Emergency Password Reset: Resets password using the Master Key without needing the old password
 */
export const resetPasswordWithMasterKey = async (
    masterKey: string,
    newPassword: string,
): Promise<{ success: boolean; message: string }> => {
    return setupInitialPassword(masterKey, newPassword);
};

/**
 * Standard Login: Validates password against stored SHA-256 hash
 */
export const login = async (password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const cleanPwd = password.trim();
    const inputHash = await hashPassword(cleanPwd);
    const storedHash = localStorage.getItem(PASSWORD_HASH_KEY);

    // 1. Matches secure stored hash
    if (storedHash && inputHash === storedHash) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        return true;
    }

    // 2. Backward compatibility: Initial default before first-time setup has completed
    if (!storedHash && !isPasswordInitialized() && cleanPwd === "admin123") {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        return true;
    }

    // 3. Backward compatibility: Upgrade legacy plain-text password to hash
    const legacyPlain = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyPlain && cleanPwd === legacyPlain) {
        localStorage.setItem(PASSWORD_HASH_KEY, inputHash);
        localStorage.setItem(INITIALIZED_KEY, "true");
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        return true;
    }

    return false;
};

/**
 * Change password from within the authenticated admin panel
 */
export const changePassword = async (
    currentPassword: string,
    newPassword: string,
): Promise<{ success: boolean; message: string }> => {
    if (typeof window === "undefined") {
        return { success: false, message: "Browser storage not available" };
    }

    // Verify current password
    const isCurrentValid = await login(currentPassword);
    if (!isCurrentValid) {
        return {
            success: false,
            message: "The current password entered is incorrect.",
        };
    }

    if (!newPassword || newPassword.trim().length < 6) {
        return {
            success: false,
            message: "New password must be at least 6 characters long.",
        };
    }

    const hashed = await hashPassword(newPassword.trim());
    const updatedAt = new Date().toISOString();
    localStorage.setItem(PASSWORD_HASH_KEY, hashed);
    localStorage.setItem(INITIALIZED_KEY, "true");
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setPasswordLastChanged(updatedAt);

    syncToCloud("resonance_admin_auth", {
        hash: hashed,
        initialized: true,
        updatedAt,
    });

    return {
        success: true,
        message: "Admin password updated successfully.",
    };
};

/**
 * Clears current session
 */
export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
};
