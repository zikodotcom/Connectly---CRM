export const validationRules = {
  projectName: [(v) => !!v || 'Project Name is required'],
  priority: [(v) => !!v || 'Priority is required'],
  status: [(v) => !!v || 'Status is required'],
  amount: [
    (v) => !!v || 'Project amount is required',
    (v) => /^\d+(\.\d{1,2})?$/.test(v) || 'Amount must be a valid number'
  ],
  idC: [(v) => !!v || 'Client name is required'],
  responsable: [(v) => !!v || 'Responsable is required'],
  description: [(v) => !!v || 'Description is required'],
  dateS: [(v) => !!v || 'Start date is required'],
  dateF: [
    (v) => !!v || 'End date is required',
    (v) => !v || (v && this.formData.dateS <= v) || 'End date must be after start date'
  ]
}
