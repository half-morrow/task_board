require "rails_helper"

RSpec.describe Task, type: :model do
  it "uses Asia/Tokyo as the application time zone" do
    expect(Time.zone.name).to eq("Asia/Tokyo")
  end

  it "accepts the contract statuses" do
    expect(described_class::STATUSES).to eq(%w[todo in_progress done])
  end

  it "rejects unknown status" do
    task = described_class.new(title: "Task", status: "blocked")

    expect(task).not_to be_valid
    expect(task.errors[:status]).to be_present
  end

  it "treats only unfinished tasks with past due dates as expired" do
    travel_to Time.zone.local(2026, 5, 21, 12, 0, 0) do
      expect(described_class.new(title: "Todo", status: "todo", due_date: Date.new(2026, 5, 20))).to be_expired
      expect(described_class.new(title: "In progress", status: "in_progress", due_date: Date.new(2026, 5, 20))).to be_expired
      expect(described_class.new(title: "Done", status: "done", due_date: Date.new(2026, 5, 20))).not_to be_expired
      expect(described_class.new(title: "Today", status: "todo", due_date: Date.new(2026, 5, 21))).not_to be_expired
      expect(described_class.new(title: "Unset", status: "todo")).not_to be_expired
    end
  end
end
