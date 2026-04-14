import * as Yup from 'yup';

export const initialValues = {
    signup: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
    login: {
        email: '',
        password: '',
    },
    productModal: {
        name: '',
        description: '',
        price: '',
        quantity: '',
    },
    addNewClient: {
        clientName: '',
        clientEmail: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        orgName: '',
    },
    addOrganization: {
        legalName: '',
        taxId: '',
        homeCurrency: ''
    }
};

export const validationSchema = {
    signup: Yup.object({
        fullName: Yup.string().required('User name is required'),
        email: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please enter a valid email').required('Email is required'),
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
    productModal: Yup.object({
        name: Yup.string().required('Item name required'),
        description: Yup.string().required('Item name required'),
        unitPrice: Yup.number().required('Price required'),
    }),
    addNewClient: Yup.object({
        clientName: Yup.string().required('Name is required'),
        clientEmail: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        addressLine1: Yup.string().required('Address is required'),
        country: Yup.string().required('Select your country'),
        city: Yup.string().required('City name is required'),
        state: Yup.string().required('state is required'),
        postalCode: Yup.string().required('Postal code is required'),
        orgName: Yup.string().required('Organisation name is required'),
    }),

    addOrganization: Yup.object({
        legalName: Yup.string().min(4, "minimum 4 characters").required('organization is required'),
        taxId: Yup.string().required("Tax-Id is required"),
        homeCurrency: Yup.string().required("Home currency is required")
    }),

};

