import axios from "axios";

export interface CountryCurrency {
    label: string,
    value: string,
    currencyName: string,
    currencyCode: string,
    currencySymbol: string,
    flag: string,
};

const BASE_URL = "https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flag";

export const fetchCountries = async (): Promise<CountryCurrency[]> => {
    try {
        console.log('fetching data...')
        const res = await axios.get(BASE_URL);

        const formatted: CountryCurrency[] = res.data.filter((country: any) => country?.currencies && country?.name?.common && Object.keys(country.currencies).length > 0).map((country: any) => {
            const currencyKeys = Object.keys(country.currencies);
            const currencyCode = currencyKeys?.[0]
            const currency = country.currencies?.[currencyCode] || {};
            return {
                label: country?.name?.common ?? '',
                value: country.cca2 ?? '',
                currencyName: currency?.name ?? '',
                currencyCode: currencyCode ?? '',
                currencySymbol: currency?.symbol ?? '',
                flag: country?.flag?? ''
            }
        }).sort(( a: CountryCurrency , b : CountryCurrency) => a.label.localeCompare(b.label));

        console.log('first item: ', formatted[0])
        return formatted;
    } catch (error: any) {
        console.log('error fetching coountries: ', error.message)
        throw error;
    }
}