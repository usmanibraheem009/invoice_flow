import * as Yup from 'yup';

export const initialValues = {
    signup: {
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
    login: {
        email: '',
        password: '',
    },
    clientDetails: {
        clientName: '',
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        paymentTerms: '',
    }
};

export const validationSchema = {
    signup: Yup.object({
        userName: Yup.string().required('User name is required'),
        email: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,'Please enter a valid email').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must contain 1 uppercase, one letter and one character(e.g: Abcd290@)').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Password is required')
    }),
    login: Yup.object({
        email: Yup.string().email('Please enter a valid email').required('Email is required'),
        password: Yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
    }),
    clientDetails: Yup.object({
        clientName: Yup.string().required('Client name is required'),
        invoiceNumber: Yup.string().required('Invoice Number is required'),
        issueDate: Yup.string().required('Issue Date is required'),
        dueDate: Yup.string().required('Due Date is required'),
        paymentTerms: Yup.string().required('Payment Terms is required'),
    }),
};

