package com.utephonehub.backend.enums;

import lombok.Getter;

/**
 * Enum for user registration chart time period selection
 */
@Getter
public enum RegistrationPeriod {
    SEVEN_DAYS(7),
    THIRTY_DAYS(30),
    THREE_MONTHS(90);

    private final int days;

    RegistrationPeriod(int days) {
        this.days = days;
    }
}
