class NormalizeTaskStatusesAndAddExpirationSupport < ActiveRecord::Migration[8.0]
  def up
    execute <<~SQL
      UPDATE tasks
      SET status = 'todo'
      WHERE status = 'expired'
    SQL

    remove_check_constraint :tasks, name: "tasks_status_check"
    add_check_constraint :tasks, "status IN ('todo', 'in_progress', 'done')", name: "tasks_status_check"
  end

  def down
    remove_check_constraint :tasks, name: "tasks_status_check"
    add_check_constraint :tasks, "status IN ('todo', 'in_progress', 'done', 'expired')", name: "tasks_status_check"
  end
end
