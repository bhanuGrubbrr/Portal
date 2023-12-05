import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';

type Address = {
  address1: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
};

export const mapGoogleAddressAutoCompleteComponents = (
  addressComponents: AddressComponent[]
): Address => {
  let address1 = '';
  let postcode = '';
  let city = '';
  let state = '';
  let country = '';

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of addressComponents) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case 'street_number': {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case 'route': {
        address1 += `${component.short_name}`;
        break;
      }

      case 'landmark': {
        address1 += `${component.short_name}`;
        break;
      }

      case 'sublocality_level_1': {
        address1 += `${component.short_name}`;
        break;
      }

      case 'postal_code': {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case 'postal_code_suffix': {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }

      case 'locality':
        city = component.long_name;
        break;

      case 'administrative_area_level_1': {
        state = component.short_name;
        break;
      }

      case 'country':
        country = component.long_name;
        break;
    }
  }

  return {
    address1,
    postcode,
    city,
    state,
    country,
  };
};
