function getAvatar(user) {
  return user.displayAvatarURL({
    size: 1024,
    extension: 'png'
  })
}

module.exports = {
  getAvatar
};
