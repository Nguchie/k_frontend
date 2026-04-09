import { countryDialCodes } from "@/lib/country-dial-codes";

export function PhoneField() {
  return (
    <div className="booking-phone-grid">
      <label>
        Code
        <select name="phone_country_code" defaultValue="+1">
          {countryDialCodes.map((item) => (
            <option key={`${item.country}-${item.code}`} value={item.code}>
              {item.country} ({item.code})
            </option>
          ))}
        </select>
      </label>
      <label>
        Number
        <input name="phone_number" placeholder="Phone number" />
      </label>
    </div>
  );
}
