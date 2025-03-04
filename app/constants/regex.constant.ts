export const NOT_ALLOW_SEPCIAL_CHARACTER = /^[^a-zA-Z0-9]$/
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PERCENT_REGEX = /^\d{1,3}(\.\d{1,2})?$/
export const DECIMAL_REGEX =  /^\d+(\.\d{1,2})?$/