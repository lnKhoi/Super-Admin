import { Rule } from 'antd/lib/form';
import * as Yup from 'yup';

// Utility function to create a password validation schema
export const createPasswordValidationSchema = () => {
  return Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required");
};

export const passwordRules: Rule[] = [
  {
    required: true,
    message: "Password is required.",
  },
  {
    validator: (_, value: string) => {
      if (!value) return Promise.resolve();
      if (value.length < 8) return Promise.reject(new Error("Password must be at least 8 characters long."));
      if (value.length > 20) return Promise.reject(new Error("Password must be at most 20 characters long."));
      if (!/[A-Z]/.test(value)) return Promise.reject(new Error("Password must contain at least one uppercase letter."));
      if (!/[0-9]/.test(value)) return Promise.reject(new Error("Password must contain at least one number."));
      if (!/[@$!%*?&]/.test(value)) return Promise.reject(new Error("Password must contain at least one special character."));

      return Promise.resolve(); // Valid password
    },
  },
];
