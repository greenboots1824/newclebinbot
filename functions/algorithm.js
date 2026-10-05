function algorithmRNG(max) {
  return Math.floor(Math.random() * max) + 1;
}

function arrayRandomReturn(userContent) {
  const arrayPhrase = userContent.trim().split(/\s+/);
  const arrayRandom = arrayPhrase[Math.floor(Math.random() * arrayPhrase.length)];

  return arrayRandom;
}

module.exports = {
  algorithmRNG,
  arrayRandomReturn
}
