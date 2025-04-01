alias LimeLease.Repo
alias LimeLease.PropertyRequestCategory.PropertyRequestCategory
alias LimeLease.Task.Task

categories = [
  %{id: UUIDv7.generate(), name: "Accessibility"},
  %{id: UUIDv7.generate(), name: "Amenities"},
  %{id: UUIDv7.generate(), name: "Broken Amenity"},
  %{id: UUIDv7.generate(), name: "Cleanliness & Pest Control"},
  %{id: UUIDv7.generate(), name: "Community & Common Areas"},
  %{id: UUIDv7.generate(), name: "Flooding"},
  %{id: UUIDv7.generate(), name: "Furniture & Fixtures"},
  %{id: UUIDv7.generate(), name: "Health & Safety"},
  %{id: UUIDv7.generate(), name: "Heating & Cooling"},
  %{id: UUIDv7.generate(), name: "Landscaping & Outdoor"},
  %{id: UUIDv7.generate(), name: "Lease Inquiry"},
  %{id: UUIDv7.generate(), name: "Maintenance & Repairs"},
  %{id: UUIDv7.generate(), name: "Move-in/Move-out"},
  %{id: UUIDv7.generate(), name: "Neighbour Dispute"},
  %{id: UUIDv7.generate(), name: "Package & Delivery"},
  %{id: UUIDv7.generate(), name: "Parking"},
  %{id: UUIDv7.generate(), name: "Payment & Rent Issues"},
  %{id: UUIDv7.generate(), name: "Pet Related"},
  %{id: UUIDv7.generate(), name: "Renovation & Improvement"},
  %{id: UUIDv7.generate(), name: "Security"},
  %{id: UUIDv7.generate(), name: "Inspection"},
  %{id: UUIDv7.generate(), name: "Noise Complaints"},
  %{id: UUIDv7.generate(), name: "Utilities (Gas, Water, etc.)"},
  %{id: UUIDv7.generate(), name: "Other"}
]

Repo.insert_all(PropertyRequestCategory, categories)

tasks = [
  %{id: UUIDv7.generate(), name: "Routine Property Inspection", frequency_months: 6, type: :routine},
  %{id: UUIDv7.generate(), name: "Annual Safety Compliance Check", frequency_months: 12, type: :compliance},
  %{id: UUIDv7.generate(), name: "Quarterly Compliance Audit", frequency_months: 3, type: :compliance},
  %{id: UUIDv7.generate(), name: "Monthly Fire Alarm Test", frequency_months: 1, type: :safety},
  %{id: UUIDv7.generate(), name: "Bi-Annual HVAC Maintenance", frequency_months: 6, type: :routine},
  %{id: UUIDv7.generate(), name: "Annual Elevator Inspection (if applicable)", frequency_months: 12, type: :safety},
  %{id: UUIDv7.generate(), name: "Semi-Annual Pest Control", frequency_months: 6, type: :routine},
  %{id: UUIDv7.generate(), name: "Bi-Annual Gas Safety Check", frequency_months: 24, type: :safety},
  %{id: UUIDv7.generate(), name: "Bi-Annual Electrical System Safety Check", frequency_months: 24, type: :safety},
  %{id: UUIDv7.generate(), name: "Quarterly Water Quality Test", frequency_months: 3, type: :compliance},
  %{id: UUIDv7.generate(), name: "Monthly Emergency Exit Drill", frequency_months: 1, type: :safety},
  %{id: UUIDv7.generate(), name: "Regular Smoke Alarm Battery Replacement", frequency_months: 12, type: :routine},
  %{id: UUIDv7.generate(), name: "Annual Smoke Alarm Test and Maintenance", frequency_months: 12, type: :safety},
  # %{id: UUIDv7.generate(), name: "Check All Smoke Alarms After Each Tenancy Change", frequency_months: 0, type: :safety},
  %{id: UUIDv7.generate(), name: "Ensure Minimum Property Standards", frequency_months: 12, type: :compliance},
  %{id: UUIDv7.generate(), name: "Check for Mould and Dampness Issues", frequency_months: 6, type: :routine},
  %{id: UUIDv7.generate(), name: "Ensure Adequate Locks and Security Measures", frequency_months: 12, type: :safety},
  %{id: UUIDv7.generate(), name: "Annual Pool and Spa Safety Inspection (if applicable)", frequency_months: 12, type: :safety}
]

Repo.insert_all(Task, tasks)
