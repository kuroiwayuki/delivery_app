class Delivery < ApplicationRecord
  belongs_to :user
  belongs_to :area

  validates :delivered_at, presence: true
  validates :price_yen, presence: true, numericality: { greater_than: 0 }
  validates :duration_min, presence: true, numericality: { greater_than: 0 }

  scope :recent, -> { order(delivered_at: :desc) }
  scope :by_user, ->(user) { where(user: user) }
  scope :by_area, ->(area_id) { where(area_id: area_id) if area_id.present? }
  scope :in_period, ->(from_date, to_date) do
    where(delivered_at: from_date..to_date) if from_date.present? && to_date.present?
  end
end
