const roleSet = {
  4: [
    ["werewolf", "doctor", "seer"],
    ["werewolf", "cultist", "anti-cult", "seer"],
    ["werewolf", "seer", "cultist", "anti-cult"],
    ["werewolf", "seer", "cultist", "doctor"]
  ],
  5: [
    ["werewolf", "seer", "doctor", "werewolf-cub", "cultist"],
    ["werewolf", "cultist", "anti-cult", "doctor", "seer"],
    ["werewolf", "werewolf-cub", "cultist", "anti-cult", "seer"],
  ],
  6: [
    ["seer", "werewolf", "doctor", "cultist", "anti-cult", "werewolf-cub"]
  ]
};

module.exports = roleSet;
