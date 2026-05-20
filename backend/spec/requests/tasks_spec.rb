require "rails_helper"

RSpec.describe "Tasks", type: :request do
  around do |example|
    travel_to Time.zone.local(2026, 5, 21, 12, 0, 0) do
      example.run
    end
  end

  it "requires login" do
    get "/api/v1/tasks"

    expect(response).to have_http_status(:unauthorized)
  end

  it "creates and lists only current user's tasks" do
    User.create!(username: "other_user", password: "password123").tasks.create!(title: "Hidden", status: "todo")
    post "/api/v1/auth/register", params: { username: "task_user", password: "password123" }

    post "/api/v1/tasks", params: { title: "Build board", status: "in_progress", tag_names: %w[frontend frontend] }
    get "/api/v1/tasks", params: { q: "Build" }

    body = response.parsed_body
    expect(body["data"].length).to eq(1)
    expect(body["data"].first["title"]).to eq("Build board")
    expect(body["data"].first["is_expired"]).to eq(false)
    expect(body["data"].first["tags"].map { |tag| tag["name"] }).to eq([ "frontend" ])
  end

  it "marks overdue tasks as expired on create and show" do
    post "/api/v1/auth/register", params: { username: "create_user", password: "password123" }

    post "/api/v1/tasks", params: {
      title: "Past due",
      status: "todo",
      due_date: "2026-05-20"
    }

    created = response.parsed_body["data"]
    expect(created["status"]).to eq("todo")
    expect(created["is_expired"]).to eq(true)

    get "/api/v1/tasks/#{created['id']}"

    shown = response.parsed_body["data"]
    expect(shown["status"]).to eq("todo")
    expect(shown["is_expired"]).to eq(true)
  end

  it "keeps done tasks out of expiration logic" do
    post "/api/v1/auth/register", params: { username: "done_user", password: "password123" }

    post "/api/v1/tasks", params: {
      title: "Completed",
      status: "done",
      due_date: "2026-05-20"
    }

    body = response.parsed_body["data"]
    expect(body["status"]).to eq("done")
    expect(body["is_expired"]).to eq(false)
  end

  it "updates overdue tasks using the same expiration rule" do
    post "/api/v1/auth/register", params: { username: "update_user", password: "password123" }

    post "/api/v1/tasks", params: {
      title: "Draft",
      status: "in_progress",
      due_date: "2026-05-21"
    }
    task_id = response.parsed_body["data"]["id"]

    patch "/api/v1/tasks/#{task_id}", params: {
      title: "Draft",
      status: "in_progress",
      due_date: "2026-05-20"
    }

    updated = response.parsed_body["data"]
    expect(updated["status"]).to eq("in_progress")
    expect(updated["is_expired"]).to eq(true)
  end

  it "filters expired tasks through the derived expiration state" do
    post "/api/v1/auth/register", params: { username: "filter_user", password: "password123" }

    post "/api/v1/tasks", params: { title: "Expired todo", status: "todo", due_date: "2026-05-20" }
    expired_id = response.parsed_body["data"]["id"]
    post "/api/v1/tasks", params: { title: "Completed", status: "done", due_date: "2026-05-20" }
    post "/api/v1/tasks", params: { title: "Current", status: "in_progress", due_date: "2026-05-21" }

    get "/api/v1/tasks", params: { status: "expired" }

    body = response.parsed_body
    expect(body["data"].map { |task| task["id"] }).to eq([ expired_id ])
    expect(body["data"].first["is_expired"]).to eq(true)
  end
end
