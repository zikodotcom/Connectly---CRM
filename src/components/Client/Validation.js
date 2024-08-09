export const validationRules = {
  clientName: [(v) => !!v || 'Client name is required'],
  owner: [(v) => !!v || 'Owner is required'],
  industry: [(v) => !!v || 'Industry is required'],
  currency: [(v) => !!v || 'Currency is required'],
  languages: [(v) => !!v || 'language is required'],
  description: [(v) => !!v || 'Description is required'],

  website: [
    (v) => !!v || 'Website is required',
    (v) => {
      const pattern = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/
      return pattern.test(v) || 'Website must be a valid URL'
    }
  ],
  email: [(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid'],
  phone: [
    (v) => !!v || 'Phone number is required',
    (v) => /^\d+$/.test(v) || 'Phone number must be valid'
  ],
  country: [(v) => !!v || 'Country is required'],
  adresse: [(v) => !!v || 'Addresse is required'],
  city: [(v) => !!v || 'City is required'],
  state: [(v) => !!v || 'State is required'],
  zipCode: [(v) => !!v || 'Zip code is required'],
  role: [(v) => !!v || 'Role is required'],
  facebook: [
    (v) => {
      if (v == '') {
        return
      }
      const pattern = /^(https?:\/\/)?(www\.)?facebook.com\/[A-Za-z0-9_.-]+\/?$/
      return pattern.test(v) || 'Facebook link must be a valid URL'
    }
  ],
  instgram: [
    (v) => {
      if (v == '') {
        return
      }
      const pattern = /^(https?:\/\/)?(www\.)?instagram.com\/[A-Za-z0-9_.-]+\/?$/
      return pattern.test(v) || 'Instagram link must be a valid URL'
    }
  ],
  linkedin: [
    (v) => {
      if (v == '') {
        return
      }
      const pattern = /^(https?:\/\/)?(www\.)?linkedin.com\/in\/[A-Za-z0-9_-]+\/?$/
      return pattern.test(v) || 'LinkedIn link must be a valid URL'
    }
  ],
  twitter: [
    (v) => {
      if (v == '') {
        return
      }
      const pattern = /^(https?:\/\/)?(www\.)?twitter.com\/[A-Za-z0-9_]+\/?$/
      return pattern.test(v) || 'Twitter link must be a valid URL'
    }
  ],
  salary: [
    (v) => !!v || 'Salary is required',
    (v) => /^\d+(\.\d{1,2})?$/.test(v) || 'Salary must be valid'
  ],
  whatsapp: [(v) => /^\d+$/.test(v) || 'Whatsapp number must be valid']
}
