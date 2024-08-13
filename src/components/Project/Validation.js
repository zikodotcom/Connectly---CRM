export const validationRules = {
  name: [(v) => !!v || 'Name is required'],
  username: [(v) => !!v || 'Username is required'],
  email: [(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid'],
  phone: [
    (v) => !!v || 'Phone number is required',
    (v) => /^\d+$/.test(v) || 'Phone number must be valid'
  ],
  country: [(v) => !!v || 'Country is required'],
  address: [(v) => !!v || 'Address is required'],
  city: [(v) => !!v || 'City is required'],
  state: [(v) => !!v || 'State is required'],
  zip: [(v) => !!v || 'Zip code is required'],
  role: [(v) => !!v || 'Role is required'],
  salary: [
    (v) => !!v || 'Salary is required',
    (v) => /^\d+(\.\d{1,2})?$/.test(v) || 'Salary must be valid'
  ]
}
