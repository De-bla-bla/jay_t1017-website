/**
 * Data store module for admin profile
 * Falls back to in-memory storage if database is unavailable
 */

let inMemoryProfile = {
  id: 1,
  artist_name: "JayT1017",
  bio: "Emo Rap Artist from Ghana",
  profile_image: "",
  social_links: {
    instagram: "https://instagram.com/jay_t1017",
    tiktok: "https://tiktok.com/@jay_t1017",
    twitter: "https://twitter.com/jayt1017x",
    facebook: "https://facebook.com/JayT1017",
    snapchat: "https://snapchat.com/add/jay_t2021395",
    appleMusic: "https://music.apple.com",
  },
};

export { inMemoryProfile };
