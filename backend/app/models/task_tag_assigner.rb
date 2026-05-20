class TaskTagAssigner
  def self.call(task:, tag_names:, user:)
    names = Array(tag_names).map { |name| Tag.normalize_name(name) }.reject(&:blank?).uniq
    task.tags = names.map { |name| user.tags.find_or_initialize_by(name:) }
  end
end
