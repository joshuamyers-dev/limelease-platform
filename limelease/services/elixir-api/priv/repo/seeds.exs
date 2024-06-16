# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     LimeLease.Repo.insert!(%LimeLease.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias LimeLease.Repo
alias LimeLease.PropertyRequestCategory.PropertyRequestCategory

Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Accessibility"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Amenities"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Broken Amenity"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Cleanliness & Pest Control"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Community & Common Areas"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Flooding"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Furniture & Fixtures"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Health & Safety"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Heating & Cooling"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Landscaping & Outdoor"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Lease Inquiry"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Maintenance & Repairs"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Move-in/Move-out"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Neighbour Dispute"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Package & Delivery"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Parking"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Payment & Rent Issues"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Pet Related"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Renovation & Improvement"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Security"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Inspection"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Noise Complaints"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Utilities (Gas, Water, etc.)"})
Repo.insert!(%PropertyRequestCategory{id: UUIDv7.generate(), name: "Other"})
