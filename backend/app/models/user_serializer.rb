class UserSerializer
  def self.call(user)
    {
      id: user.id,
      username: user.username
    }
  end
end
