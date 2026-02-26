// Mood-to-content mapping for personalized spiritual guidance
export const moods = [
  {
    id: 'anxious',
    label: 'Anxious',
    arabic: 'قلق',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
  },
  {
    id: 'sad',
    label: 'Sad',
    arabic: 'حزين',
    color: 'blue',
    gradient: 'from-blue-400 to-indigo-500',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    arabic: 'شاكر',
    color: 'sanctuary',
    gradient: 'from-sanctuary-400 to-sanctuary-500',
    bgLight: 'bg-sanctuary-50',
    bgDark: 'dark:bg-sanctuary-900/20',
  },
  {
    id: 'angry',
    label: 'Angry',
    arabic: 'غاضب',
    color: 'rose',
    gradient: 'from-rose-400 to-red-500',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-900/20',
  },
  {
    id: 'lonely',
    label: 'Lonely',
    arabic: 'وحيد',
    color: 'violet',
    gradient: 'from-violet-400 to-purple-500',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-900/20',
  },
  {
    id: 'hopeful',
    label: 'Hopeful',
    arabic: 'متفائل',
    color: 'sky',
    gradient: 'from-sky-400 to-cyan-500',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-900/20',
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    arabic: 'مثقل',
    color: 'cream',
    gradient: 'from-cream-400 to-cream-300',
    bgLight: 'bg-cream-200',
    bgDark: 'dark:bg-night-100',
  },
  {
    id: 'peaceful',
    label: 'At Peace',
    arabic: 'مطمئن',
    color: 'teal',
    gradient: 'from-teal-400 to-sanctuary-500',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-900/20',
  },
];

export const moodGuidanceContent = {
  anxious: {
    verse: {
      arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      translation: 'Verily, in the remembrance of Allah do hearts find rest.',
      reference: 'Quran 13:28',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "Nothing befalls a believer, a prick of a thorn or anything greater, but Allah raises him in degree thereby or removes a sin from him."',
      source: 'Sahih Muslim 2572',
    },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal",
      translation: 'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from inability and laziness.',
      source: 'Sahih al-Bukhari 6369',
    },
    advice: 'Take a deep breath. Your anxiety is valid, but remember that Allah is the Best of Planners. Try reading Surah Ad-Duha — it was revealed during a difficult time to bring comfort.',
    actionSuggestion: 'Do 33 counts of SubhanAllah to calm your heart',
  },
  sad: {
    verse: {
      arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
      reference: 'Quran 94:5-6',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "How wonderful is the case of a believer; there is good for him in everything — and this applies only to a believer. If prosperity befalls him, he is grateful and that is good for him. If adversity befalls him, he is patient and that is good for him."',
      source: 'Sahih Muslim 2999',
    },
    dua: {
      arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ',
      transliteration: "Allahumma rahmataka arju fala takilni ila nafsi tarfata 'ayn, wa aslih li sha'ni kullahu",
      translation: 'O Allah, I hope for Your mercy. Do not leave me to myself even for the blink of an eye. Correct all of my affairs for me.',
      source: 'Abu Dawud 5090',
    },
    advice: 'It is okay to feel sad. Even the Prophet ﷺ experienced deep sadness. Let yourself feel, then turn to Allah in your vulnerability — He is closest to the brokenhearted.',
    actionSuggestion: 'Write in your journal what is weighing on your heart',
  },
  grateful: {
    verse: {
      arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
      translation: 'If you are grateful, I will surely increase you [in favor].',
      reference: 'Quran 14:7',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "He who does not thank people does not thank Allah."',
      source: 'Abu Dawud 4811',
    },
    dua: {
      arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
      translation: 'O Allah, help me remember You, be grateful to You, and worship You beautifully.',
      source: 'Abu Dawud 1522',
    },
    advice: 'What a beautiful state to be in! Gratitude multiplies blessings. Consider sharing this feeling — call someone you love, give charity, or simply smile at a stranger.',
    actionSuggestion: 'Complete a full set of morning adhkar as thanks',
  },
  angry: {
    verse: {
      arabic: 'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
      translation: 'Those who restrain anger and pardon people — and Allah loves the doers of good.',
      reference: 'Quran 3:134',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "The strong person is not the one who overcomes others by physical strength. Rather, the strong person is the one who controls themselves while in anger."',
      source: 'Sahih al-Bukhari 6114',
    },
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: "A'udhu billahi minash-shaytanir-rajim",
      translation: 'I seek refuge in Allah from the accursed Satan.',
      source: 'Sahih al-Bukhari 3282',
    },
    advice: 'The Prophet ﷺ advised: if you are angry while standing, sit down. If still angry, lie down. Perform wudu — water cools anger. This moment will pass.',
    actionSuggestion: 'Say Astaghfirullah 100 times to find calm',
  },
  lonely: {
    verse: {
      arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
      translation: 'And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
      reference: 'Quran 2:186',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me. If he remembers Me within himself, I remember him within Myself."',
      source: 'Sahih al-Bukhari 7405',
    },
    dua: {
      arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
      transliteration: 'Ya Hayyu Ya Qayyum, bi rahmatika astaghith',
      translation: 'O Ever-Living, O Self-Sustaining, in Your mercy I seek relief.',
      source: 'Tirmidhi 3524',
    },
    advice: 'You are never truly alone. Allah is closer to you than your jugular vein. In moments of solitude, speak to Him freely — He hears every whisper of your heart.',
    actionSuggestion: 'Talk to Allah in sujood — pour your heart out',
  },
  hopeful: {
    verse: {
      arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
      translation: 'Indeed, Allah does not allow to be lost the reward of those who do good.',
      reference: 'Quran 9:120',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "Know that victory comes with patience, relief comes with affliction, and ease comes with hardship."',
      source: 'Musnad Ahmad 2800',
    },
    dua: {
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
      translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
      source: 'Quran 2:201',
    },
    advice: 'Hope in Allah is one of the most powerful states of the heart. Channel this energy into action — set a spiritual goal and take the first step today.',
    actionSuggestion: 'Set a new dhikr goal and start working toward it',
  },
  overwhelmed: {
    verse: {
      arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
      translation: 'Allah does not burden a soul beyond that it can bear.',
      reference: 'Quran 2:286',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "Take up good deeds only as much as you are able, for the best deeds are those done consistently even if they are few."',
      source: 'Sunan Ibn Majah 4240',
    },
    dua: {
      arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      transliteration: 'Hasbunallahu wa ni\'mal-wakeel',
      translation: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
      source: 'Quran 3:173',
    },
    advice: 'You do not have to carry everything at once. Put things down, breathe, and hand your burdens to Allah. Start with one small step — even one dhikr counts.',
    actionSuggestion: 'Close your eyes and say SubhanAllah 10 times slowly',
  },
  peaceful: {
    verse: {
      arabic: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَى رَبِّكِ رَاضِيَةً مَرْضِيَّةً',
      translation: 'O reassured soul, return to your Lord, well-pleased and pleasing [to Him].',
      reference: 'Quran 89:27-28',
    },
    hadith: {
      text: 'The Prophet ﷺ said: "Richness is not having many possessions, but richness is the richness of the soul."',
      source: 'Sahih al-Bukhari 6446',
    },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
      translation: 'O Allah, I ask You for well-being in this world and the Hereafter.',
      source: 'Sunan Ibn Majah 3871',
    },
    advice: 'This inner peace is a gift from Allah. Savor it, be present in it, and ask Allah to preserve it. Use this tranquility to deepen your connection with Him.',
    actionSuggestion: 'Read a page of Quran while in this beautiful state',
  },
};
