class Tag < ApplicationRecord
  belongs_to :user
  has_many :task_tags, dependent: :destroy
  has_many :tasks, through: :task_tags

  normalizes :name, with: ->(value) { normalize_name(value) }

  validates :name, presence: true, length: { maximum: 40 },
                   uniqueness: { scope: :user_id, case_sensitive: false }

  def self.normalize_name(value)
    value.to_s.strip.downcase
  end
end
