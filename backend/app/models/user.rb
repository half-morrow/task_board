class User < ApplicationRecord
  has_secure_password

  has_many :tasks, dependent: :destroy
  has_many :tags, dependent: :destroy

  normalizes :username, with: ->(value) { value.to_s.strip }

  validates :username, presence: true, length: { maximum: 40 },
                       format: { with: /\A[a-zA-Z0-9_-]+\z/ },
                       uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 8 }, allow_nil: true
end
