require "rails_helper"

RSpec.describe TaskSearchQuery do
  it "keeps pagination defaults aligned with the contract" do
    user = User.create!(username: "query_user", password: "password123")

    result = described_class.new(current_user: user, params: {}).call

    expect(result.meta[:page]).to eq(1)
    expect(result.meta[:per_page]).to eq(20)
  end

  it "filters expired tasks using the derived expiration state" do
    travel_to Time.zone.local(2026, 5, 21, 12, 0, 0) do
      user = User.create!(username: "query_user_2", password: "password123")
      expired_task = user.tasks.create!(title: "Expired", status: "todo", due_date: Date.new(2026, 5, 20))
      user.tasks.create!(title: "Done", status: "done", due_date: Date.new(2026, 5, 20))
      user.tasks.create!(title: "Current", status: "in_progress", due_date: Date.new(2026, 5, 21))

      result = described_class.new(current_user: user, params: { status: "expired" }).call

      expect(result.records).to contain_exactly(expired_task)
    end
  end
end
