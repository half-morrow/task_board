class Task < ApplicationRecord
  STATUSES = %w[todo in_progress done].freeze
  EXPIRABLE_STATUSES = %w[todo in_progress].freeze

  belongs_to :user
  has_many :task_tags, dependent: :destroy
  has_many :tags, through: :task_tags

  validates :title, presence: true, length: { maximum: 120 }
  validates :description, length: { maximum: 2_000 }
  validates :status, inclusion: { in: STATUSES }
  validates :due_date, comparison: { greater_than_or_equal_to: Date.new(2000, 1, 1) }, allow_nil: true

  scope :expired_tasks, -> { where(status: EXPIRABLE_STATUSES, due_date: ...Date.current) }

  def expired?
    EXPIRABLE_STATUSES.include?(status) && due_date.present? && due_date < Date.current
  end
end
