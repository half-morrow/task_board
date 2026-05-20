class TaskSerializer
  def self.call(task)
    {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      is_expired: task.expired?,
      due_date: task.due_date&.iso8601,
      tags: task.tags.map { |tag| TagSerializer.call(tag) },
      created_at: task.created_at.iso8601,
      updated_at: task.updated_at.iso8601
    }
  end
end
