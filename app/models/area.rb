class Area < ApplicationRecord
  has_many :deliveries, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true

  scope :ordered, -> { order(:name) }
end
