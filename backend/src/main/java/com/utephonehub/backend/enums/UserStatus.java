package com.utephonehub.backend.enums;

/**
 * User status enumeration
 */
public enum UserStatus {
    /**
     * User is active and can use the system normally
     */
    ACTIVE,

    /**
     * User account is locked by admin and cannot login
     */
    LOCKED,

    /**
     * User email has been verified (optional marker status)
     * Currently not enforced in login flow, but can be used for reporting or future logic.
     */
    EMAIL_VERIFIED
}
