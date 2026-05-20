class TaskTag < ApplicationRecord
  belongs_to :task
  belongs_to :tag

  validates :tag_id, uniqueness: { scope: :task_id }
  validate :same_owner

  private

  def same_owner
    return if task.blank? || tag.blank? || task.user_id == tag.user_id

    errors.add(:tag, "must belong to the same user")
  end
end
