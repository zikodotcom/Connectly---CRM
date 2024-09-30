export const validationRules = {
  taskName: [
    (v) => !!v || 'Task name is required',
    (v) => (v && v.length >= 3) || 'Task name must be at least 3 characters long'
  ],
  dateS: [(v) => !!v || 'Start date is required'],
  dateF: [
    (v) => !!v || 'End date is required'
    // (v) => !v || (v && this.formData.dateS <= v) || 'End date must be after start date'
  ],
  status: [(v) => !!v || 'Status is required'],
  id: [(v) => !!v || 'Project is required'],
  description: [
    (v) => !!v || 'Description is required',
    (v) => (v && v.length >= 10) || 'Description must be at least 10 characters long'
  ]
}
