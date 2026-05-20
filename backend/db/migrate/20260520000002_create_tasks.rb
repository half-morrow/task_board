class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.string :status, null: false, default: "todo"
      t.date :due_date

      t.timestamps
    end

    add_check_constraint :tasks, "status IN ('todo', 'in_progress', 'done', 'expired')", name: "tasks_status_check"
    add_index :tasks, %i[user_id status]
    add_index :tasks, %i[user_id due_date]
  end
end
