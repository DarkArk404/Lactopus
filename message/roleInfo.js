const roles = [
  {
    name: "werewolf",
    description: "🐺 Kamu adalah penjahat yang menyamar diantara werewolf. Bunuh semua warga supaya kamu menang",
    skillText: "🐺 Werewolf, Pilih siapa mangsamu",
    cmdText: "/bite",
    team: "werewolf"
  },
  {
    name: "seer",
    description: "🔮 Kamu adalah warga yang bisa cek identitas sebenarnya dari suatu orang. Gantung Werewolf supaya kamu menang",
    skillText: "🔮 Seer, pilih siapa yang ingin di check",
    team: "villager",
    cmdText: "/seerCheck"
  },
  {
    name: "doctor",
    description: "💉 Kamu adalah warga yang bisa menyembuhkan suatu orang pada malam hari, mana tau orang lain butuh bantuan",
    skillText: "💉 Doctor, pilih siapa yang ingin dilindungi",
    team: "villager",
    cmdText: "/heal"
  },
  {
    name: "villager",
    description: "🧑‍🌾 Kamu adalah warga (luar)biasa, tugasmu itu cari tau siapa werewolf, dan gantungkan werewolfnya",
    team: "villager"
  },
  {
    name: "cultist",
    description: "🤵 Kamu bukan dipihak warga atau werewolf, misi kamu gantung werewolf dan membuat semua warga menjadi cultist",
    skillText: "🤵 Cultist, pilih siapa yang ingin di ubah menjadi cultist",
    team: "cultist",
    cmdText: "/cult"
  },
  {
    name: "anti-cult",
    description: "🚬 Kamu adalah warga yang membantu warga membasmi Cultist. Jika kamu didatangi Cultist, kamu akan membunuhnya",
    skillText: "🚬 Anti-Cult, pilih siapa yang ingin di check rumahnya",
    cmdText: "/anticult",
    team: "villager"
  },
  {
    name: "werewolf-cub",
    description: "🐕 Kamu dipihak werewolf, dan baru bisa menjadi werewolf jika werewolf lainnya mati",
    team: "werewolf"
  }
];

module.exports = roles;