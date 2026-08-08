import React, { useState } from "react";
import { Building2, MapPin, UserRound } from "lucide-react";

import FormInput from "@/components/FormInput";
import {
  submitTenantApplication,
} from "./tenantApplication.service";

interface FormErrors {
  saccoName?: string;
  registrationNumber?: string;
  preferredCode?: string;
  county?: string;
  town?: string;
  physicalAddress?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPosition?: string;
}

const TenantApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    saccoName: "",
    registrationNumber: "",
    preferredCode: "",

    county: "",
    town: "",
    physicalAddress: "",

    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactPosition: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successData, setSuccessData] =
    useState<{
      referenceNumber: string;
      saccoName: string;
    } | null>(null);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "preferredCode"
          ? value.toUpperCase()
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setSubmitError(null);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.saccoName.trim()) {
      nextErrors.saccoName =
        "SACCO name is required.";
    } else if (
      formData.saccoName.trim().length < 2
    ) {
      nextErrors.saccoName =
        "SACCO name must be at least 2 characters long.";
    }

    if (
      formData.registrationNumber &&
      formData.registrationNumber.trim().length < 2
    ) {
      nextErrors.registrationNumber =
        "Registration number must be at least 2 characters long.";
    }

    if (
      formData.preferredCode &&
      formData.preferredCode.trim().length < 2
    ) {
      nextErrors.preferredCode =
        "Preferred tenant code must be at least 2 characters long.";
    }

    if (!formData.county.trim()) {
      nextErrors.county =
        "County is required.";
    }

    if (
      formData.town &&
      formData.town.trim().length < 2
    ) {
      nextErrors.town =
        "Town must be at least 2 characters long.";
    }

    if (
      formData.physicalAddress &&
      formData.physicalAddress.trim().length < 2
    ) {
      nextErrors.physicalAddress =
        "Physical address must be at least 2 characters long.";
    }

    if (!formData.contactName.trim()) {
      nextErrors.contactName =
        "Contact name is required.";
    }

    if (!formData.contactEmail.trim()) {
      nextErrors.contactEmail =
        "Contact email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.contactEmail
      )
    ) {
      nextErrors.contactEmail =
        "Please provide a valid email address.";
    }

    if (!formData.contactPhone.trim()) {
      nextErrors.contactPhone =
        "Contact phone is required.";
    } else if (
      formData.contactPhone.trim().length < 7
    ) {
      nextErrors.contactPhone =
        "Please provide a valid phone number.";
    }

    if (
      formData.contactPosition &&
      formData.contactPosition.trim().length < 2
    ) {
      nextErrors.contactPosition =
        "Contact position must be at least 2 characters long.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitError(null);
    setSuccessData(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await submitTenantApplication({
          ...formData,

          saccoName:
            formData.saccoName.trim(),

          registrationNumber:
            formData.registrationNumber?.trim() ||
            undefined,

          preferredCode:
            formData.preferredCode
              ?.trim()
              .toUpperCase() || undefined,

          county:
            formData.county.trim(),

          town:
            formData.town?.trim() ||
            undefined,

          physicalAddress:
            formData.physicalAddress?.trim() ||
            undefined,

          contactName:
            formData.contactName.trim(),

          contactEmail:
            formData.contactEmail
              .trim()
              .toLowerCase(),

          contactPhone:
            formData.contactPhone.trim(),

          contactPosition:
            formData.contactPosition?.trim() ||
            undefined,
        });

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to submit tenant application."
        );
      }

      setSuccessData({
        referenceNumber:
          result.data.referenceNumber,

        saccoName:
          result.data.saccoName,
      });

      setFormData({
        saccoName: "",
        registrationNumber: "",
        preferredCode: "",
        county: "",
        town: "",
        physicalAddress: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        contactPosition: "",
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit tenant application.";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * SUCCESS STATE
   */
  if (successData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
          Application Submitted
        </h2>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Your application for{" "}
          <strong className="text-slate-900 dark:text-white">
            {successData.saccoName}
          </strong>{" "}
          has been submitted successfully.
        </p>

        <div className="mt-6 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Application Reference
          </p>

          <p className="mt-2 font-mono text-xl font-bold tracking-wider text-blue-600 dark:text-blue-400">
            {successData.referenceNumber}
          </p>
        </div>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Keep this reference number for future
          application-status enquiries.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Intro */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          StageTrack Onboarding
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          SACCO Tenant Application
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Submit your SACCO details to request
          onboarding onto the StageTrack platform.
          Once reviewed and approved, your SACCO
          will become an active StageTrack tenant.
        </p>
      </div>

      {/* Server Error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

          <p>{submitError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8"
      >
        {/* ===================================== */}
        {/* SECTION 01 — ORGANIZATION */}
        {/* ===================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Building2 size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  01
                </span>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Organization Details
                </h2>
              </div>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Provide the official details of your SACCO.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormInput
              label="SACCO Name"
              name="saccoName"
              value={formData.saccoName}
              onChange={handleInputChange}
              error={errors.saccoName}
              placeholder="e.g. New Horizon Sacco"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                error={errors.registrationNumber}
                placeholder="e.g. C123456"
              />

              <FormInput
                label="Preferred Tenant Code"
                name="preferredCode"
                value={formData.preferredCode}
                onChange={handleInputChange}
                error={errors.preferredCode}
                placeholder="e.g. NHS"
              />
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-500/10 dark:bg-blue-500/5">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                The preferred tenant code will identify
                your SACCO within StageTrack. It must
                be unique and will be checked during
                application review.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* ===================================== */}
        {/* SECTION 02 — LOCATION */}
        {/* ===================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <MapPin size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  02
                </span>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Location
                </h2>
              </div>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Tell us where your SACCO operates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="County"
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                error={errors.county}
                placeholder="e.g. Nairobi"
              />

              <FormInput
                label="Town"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                error={errors.town}
                placeholder="e.g. Nairobi"
              />
            </div>

            <FormInput
              label="Physical Address"
              name="physicalAddress"
              value={formData.physicalAddress}
              onChange={handleInputChange}
              error={errors.physicalAddress}
              placeholder="e.g. Nairobi CBD, Tom Mboya Street"
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* ===================================== */}
        {/* SECTION 03 — CONTACT */}
        {/* ===================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <UserRound size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  03
                </span>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Primary Contact
                </h2>
              </div>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Provide the person responsible for this application.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormInput
              label="Contact Name"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              error={errors.contactName}
              placeholder="e.g. John Kamau"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                error={errors.contactEmail}
                placeholder="john@example.com"
              />

              <FormInput
                label="Contact Phone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleInputChange}
                error={errors.contactPhone}
                placeholder="0712345678"
              />
            </div>

            <FormInput
              label="Position"
              name="contactPosition"
              value={formData.contactPosition}
              onChange={handleInputChange}
              error={errors.contactPosition}
              placeholder="e.g. Chairperson"
            />
          </div>
        </section>

        {/* ===================================== */}
        {/* SUBMIT */}
        {/* ===================================== */}

        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="mb-4 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              By submitting this application, your
              information will be sent to the StageTrack
              administration team for review. Your SACCO
              will only become an active tenant after
              approval.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              isSubmitting
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
            }`}
          >
            {isSubmitting
              ? "Submitting Application..."
              : "Submit Tenant Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantApplicationForm;
