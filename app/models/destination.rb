class Destination < ApplicationRecord
  belongs_to :meetup
  has_many :flights, dependent: :destroy

  geocoded_by :fly_to_city
end
