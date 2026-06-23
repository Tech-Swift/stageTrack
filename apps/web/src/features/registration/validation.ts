// src/features/registration/validation.ts
import { type AllowedRole, type RegistrationFormData } from '../../types/registration';

export const ALLOWED_ROLES = [
{ value: 'DRIVER', label: 'Driver' },
  { value: 'CONDUCTOR', label: 'Conductor' },
  { value: 'STAGE_MARSHAL', label: 'Stage Marshal' }, // Match single L uppercase
  { value: 'VEHICLE_OWNER', label: 'Vehicle Owner' }
];

export const ROLE_DOCUMENT_RULES: Record<AllowedRole, { label: string; fieldName: keyof RegistrationFormData }[]> = {
DRIVER: [
    { label: "Profile Image", fieldName: "profileImageUrl" },
    { label: "Certificate of Good Conduct", fieldName: "goodConductUrl" },
    { label: "Driving Licence", fieldName: "licenceUrl" }
  ],
  CONDUCTOR: [
    { label: "Profile Image", fieldName: "profileImageUrl" },
    { label: "Certificate of Good Conduct", fieldName: "goodConductUrl" },
    { label: "PSV Badge", fieldName: "badgeUrl" }
  ],
  STAGE_MARSHAL: [
    { label: "Profile Image", fieldName: "profileImageUrl" },
    { label: "Certificate of Good Conduct", fieldName: "goodConductUrl" }
  ],
  VEHICLE_OWNER: [
    { label: "Profile Image", fieldName: "profileImageUrl" },
    { label: "Vehicle Logbook", fieldName: "vehicleLogbookUrl" }
  ]
};

// Your email/phone regex matching functions below...
export const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email address';
  return undefined;
};

export const validatePhone = (phone: string) => {
  if (!phone) return 'Phone number is required';
  if (!/^07\d{8}$/.test(phone)) return 'Invalid phone number format (use 07XXXXXXXX)';
  return undefined;
};