const baseURL = "https://countriesnow.space/api/v0.1"

export const getCountries = async () => {
    try {
        const res = await fetch(`${baseURL}/countries/positions`);
        const json = await res.json();

        return json.data.map((item: any) => ({
            label: item.name
        }))

    } catch (error) {
        console.log('error fetching countries: ', error);
        return [];
    }
};

export const getState = async (country: any) => {
    try {
        const res = await fetch(`${baseURL}/countries/states`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ country })
        });
        if (!res.ok) {
            console.log('States API response not ok', res.status);
            return [];
        }

        const json = await res.json();
        return json.data.states.map((state: any) => ({
            label: state.name,
        }))
    } catch (error) {
        console.log('Error getting states: ', error);
    }
};


export const getCities = async (country: string, state: string) => {
  try {
    const res = await fetch(`${baseURL}/countries/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: country.trim(), state: state.trim() }),
    });

    const json = await res.json();

    if (!json?.data || !Array.isArray(json.data)) {
      console.log('Cities data missing for', country, state);
      return [];
    }

    return json.data.map((city: string) => ({
        label: city,
    }));
  } catch (error) {
    console.log('Error fetching cities: ', error);
    return []; // Always return array to avoid undefined.map
  }
};