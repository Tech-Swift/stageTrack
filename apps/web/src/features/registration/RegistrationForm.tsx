// src/features/registration/RegistrationForm.tsx
import React, { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormFileUpload from '../../components/FormFileUpload';
import { validateEmail, validatePhone, ALLOWED_ROLES, ROLE_DOCUMENT_RULES } from './validation';
import { api } from '../../lib/api';
import type { RegistrationFormData, FormErrors, Tenant } from '../../types/registration';

const FALLBACK_TENANTS: Tenant[] = [
  { id: "fallback-1", name: "Staging Test SACCO", code: "TEST_SACCO" }
];

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    tenantCode: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nationalId: '',
    role: '',
    profileImageUrl: '',
    goodConductUrl: '',
    licenceUrl: '',
    badgeUrl: '',
    vehicleLogbookUrl: '',
  });

  const [tenants, setTenants] = useState<Tenant[]>(FALLBACK_TENANTS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    useEffect(() => {
    console.log("LOG: RegistrationForm mounted. Pinging backend for tenants...");
    
    // Define an interface matching your server envelope structure
    interface TenantResponse {
        success: boolean;
        count: number;
        activeCount: number;
        inactiveCount: number;
        data: Tenant[];
    }

    api.get<TenantResponse>('/tenants')
        .then((response) => {
        console.log("LOG: Raw tenant data envelope received:", response.data);
        
        // Fixed here: Extracting the nested .data array from the response envelope
        const saccoList = response.data?.data;
        
        if (saccoList && Array.isArray(saccoList) && saccoList.length > 0) {
            setTenants(saccoList);
        }
        })
        .catch((err) => {
        console.warn('LOG: Axios tenant catch triggered. Using local fallback array.', err);
        });
    }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nextState = { ...prev, [name]: value };

      if (name === 'role') {
        nextState.profileImageUrl = '';
        nextState.goodConductUrl = '';
        nextState.licenceUrl = '';
        nextState.badgeUrl = '';
        nextState.vehicleLogbookUrl = '';
      }

      return nextState;
    });

    if (errors[name as keyof RegistrationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const runValidation = (): boolean => {
    const localErrors: FormErrors = {};

    const emailErr = validateEmail(formData.email);
    if (emailErr) localErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) localErrors.phone = phoneErr;

    if (!formData.firstName.trim()) localErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) localErrors.lastName = 'Last name is required';
    if (!formData.tenantCode) localErrors.tenantCode = 'Please select a SACCO Platform Tenant';
    if (!formData.role) localErrors.role = 'Please assign an operational role request';
    if (!formData.nationalId.trim()) localErrors.nationalId = 'National ID value is required';

    // Fixed: Safe key lookup matching the schema of ROLE_DOCUMENT_RULES directly
    if (formData.role && formData.role in ROLE_DOCUMENT_RULES) {
      const requiredDocs = ROLE_DOCUMENT_RULES[formData.role as keyof typeof ROLE_DOCUMENT_RULES];
      requiredDocs.forEach((doc) => {
        const value = formData[doc.fieldName];
        if (!value || !value.trim()) {
          localErrors[doc.fieldName] = `${doc.label} file is required`;
        }
      });
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!runValidation()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/registrations', formData);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Submission rejected by server rules');
      }

      setSubmitMessage({ type: 'success', text: 'Registration request submitted successfully!' });
      
      setFormData({
        tenantCode: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        nationalId: '',
        role: '',
        profileImageUrl: '',
        goodConductUrl: '',
        licenceUrl: '',
        badgeUrl: '',
        vehicleLogbookUrl: '',
      });
    } catch (err: any) {
      const serverErrorMessage = err.response?.data?.message || err.message || 'Failed to communicate with API server';
      setSubmitMessage({ type: 'error', text: serverErrorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mappedTenantOptions = (tenants || []).map((t) => ({
    value: t.code,
    label: t.name,
  }));

  // Fixed: Safe key lookup matching the schema of ROLE_DOCUMENT_RULES directly here too
  const activeDocumentFields = formData.role && formData.role in ROLE_DOCUMENT_RULES
    ? ROLE_DOCUMENT_RULES[formData.role as keyof typeof ROLE_DOCUMENT_RULES]
    : [];

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-3">
        SACCO Platform Registration Request
      </h2>

      {submitMessage && (
        <div
          className={`p-4 mb-4 rounded font-medium text-sm ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormSelect
          label="Select SACCO / Organization"
          name="tenantCode"
          value={formData.tenantCode}
          onChange={handleInputChange}
          options={mappedTenantOptions}
          error={errors.tenantCode}
          defaultLabel="-- Choose Target SACCO System --"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            placeholder="John"
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            placeholder="Doe"
          />
        </div>

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="johndoe@example.com"
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          placeholder="07XXXXXXXX"
        />

        <FormInput
          label="National ID Number"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          error={errors.nationalId}
          placeholder="12345678"
        />

        <FormSelect
          label="Requested Fleet Operation Role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          options={ALLOWED_ROLES}
          error={errors.role}
          defaultLabel="-- Choose Your Specific Role --"
        />

        {activeDocumentFields.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Required Documents for {ALLOWED_ROLES.find(r => r.value === formData.role)?.label}
            </h3>
            {activeDocumentFields.map((doc) => (
              <FormFileUpload
                key={doc.fieldName}
                label={doc.label}
                name={doc.fieldName}
                error={errors[doc.fieldName]}
                onUploadSuccess={(url) => {
                  setFormData((prev) => ({ ...prev, [doc.fieldName]: url }));
                  if (errors[doc.fieldName]) {
                    setErrors((prev) => ({ ...prev, [doc.fieldName]: undefined }));
                  }
                }}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 font-bold rounded text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 mt-6 ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;