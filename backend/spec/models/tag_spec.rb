require "rails_helper"

RSpec.describe Tag, type: :model do
  it "normalizes names" do
    expect(described_class.normalize_name("  FrontEnd ")).to eq("frontend")
  end
end
