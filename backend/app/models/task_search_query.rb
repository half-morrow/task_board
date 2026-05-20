TaskSearchResult = Data.define(:records, :meta)

class TaskSearchQuery
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 50

  def initialize(current_user:, params:)
    @current_user = current_user
    @params = params
  end

  def call
    scope = current_user.tasks.includes(:tags).left_joins(:tags).distinct.order(created_at: :desc)
    scope = apply_keyword(scope)
    scope = if params[:status] == "expired"
      scope.merge(Task.expired_tasks)
    elsif Task::STATUSES.include?(params[:status])
      scope.where(status: params[:status])
    else
      scope
    end
    scope = scope.where(tags: { name: Tag.normalize_name(params[:tag]) }) if params[:tag].present?

    total_count = scope.count
    records = scope.limit(per_page).offset((page - 1) * per_page)

    TaskSearchResult.new(records:, meta: meta(total_count))
  end

  private

  attr_reader :current_user, :params

  def apply_keyword(scope)
    return scope if params[:q].blank?

    keyword = "%#{ActiveRecord::Base.sanitize_sql_like(params[:q].to_s.strip)}%"
    scope.where("tasks.title ILIKE :keyword OR tasks.description ILIKE :keyword OR tags.name ILIKE :keyword", keyword:)
  end

  def page
    [ params[:page].to_i, 1 ].max
  end

  def per_page
    value = params[:per_page].presence&.to_i || DEFAULT_PER_PAGE
    value.clamp(1, MAX_PER_PAGE)
  end

  def meta(total_count)
    {
      page:,
      per_page:,
      total_count:,
      total_pages: (total_count.to_f / per_page).ceil
    }
  end
end
