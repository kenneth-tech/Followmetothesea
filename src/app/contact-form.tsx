"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  type CountryCode,
} from "libphonenumber-js/min";
import mobileExamples from "libphonenumber-js/mobile/examples";
import { ArrowIcon } from "./arrow-icon";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const countryOptions = getCountries()
  .map((country: CountryCode) => ({
    code: country,
    callingCode: getCountryCallingCode(country),
    name: regionNames.of(country) ?? country,
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ContactForm() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode>("PH");
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const phonePlaceholder =
    getExampleNumber(selectedCountry, mobileExamples)?.formatNational() ??
    "Phone number";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setError("");
    setIsSubmitting(true);
    setSent(false);

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          country: String(formData.get("country") || ""),
          email: String(formData.get("email") || ""),
          message: String(formData.get("message") || ""),
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send your inquiry.");
      }

      form.reset();
      setSelectedCountry("PH");
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your inquiry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          autoComplete="name"
          maxLength={100}
          name="name"
          type="text"
          placeholder="Your full name"
          required
        />
      </label>
      <label>
        <span>Phone</span>
        <div className="phone-field">
          <select
            aria-label="Country calling code"
            name="country"
            onChange={(event) =>
              setSelectedCountry(event.target.value as CountryCode)
            }
            value={selectedCountry}
          >
            {countryOptions.map((country) => (
              <option value={country.code} key={country.code}>
                {isHydrated ? country.name : country.code} (+
                {country.callingCode})
              </option>
            ))}
          </select>
          <input
            autoComplete="tel-national"
            inputMode="tel"
            maxLength={30}
            name="phone"
            type="tel"
            placeholder={phonePlaceholder}
            required
          />
        </div>
      </label>
      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          maxLength={254}
          name="email"
          type="email"
          placeholder="you@email.com"
          required
        />
      </label>
      <label>
        <span>Message</span>
        <textarea
          maxLength={1000}
          name="message"
          placeholder="Tell us what you need"
          required
          rows={4}
        />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Sending..."
          : sent
            ? "Message received!"
            : "Send inquiry"}
        <ArrowIcon />
      </button>
      {error && (
        <p className="form-status is-error" role="alert">
          {error}
        </p>
      )}
      {sent && (
        <p className="form-status" role="status">
          Thanks! We&apos;ll be in touch soon.
        </p>
      )}
    </form>
  );
}
