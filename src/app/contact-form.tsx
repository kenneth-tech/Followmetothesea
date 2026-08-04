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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
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
      <button type="submit">
        {sent ? "Message received!" : "Send inquiry"}
        <ArrowIcon />
      </button>
      {sent && (
        <p className="form-status" role="status">
          Thanks! We&apos;ll be in touch soon.
        </p>
      )}
    </form>
  );
}
