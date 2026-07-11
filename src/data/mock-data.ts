export const MOCK_PARTICIPANTS = Array.from({ length: 32 }).map((_, i) => ({
  id: String(i),
  initials: ['AD', 'MS', 'FN', 'KB', 'OS', 'PD'][i % 6],
  bgColor: ['#f2784f', '#2c7a55', '#c64a86', '#b78ad6', '#e0913a', '#d9633f'][i % 6]
}));

export const DUMMY_EVENT_DETAILS = {
  title: 'Sunset Run • Corniche',
  subtitle: 'course • corniche ouest',
  location: 'Corniche Ouest • Dakar',
  price: 'Gratuit',
  sportLabel: 'RUNNING',
  imageSource: require('@/assets/images/bg_home.jpeg'), // Fallback image
};

export const DUMMY_EVENTS = [
  {
    id: '1',
    title: 'Sunset Run • Corniche',
    price: 'Gratuit',
    time: '18:30',
    location: 'Corniche Ouest',
    distance: '5 & 10 km',
    participants: MOCK_PARTICIPANTS,
    totalPlaces: 40,
    sportLabel: 'Running',
    sportColor: '#f2784f', // SportsColors.running
    badgeTime: 'AUJ.  18:30',
    imageSource: require('@/assets/images/bg_home.jpeg'),
  },
  {
    id: '2',
    title: 'Match de Foot • 5v5',
    price: '2 500 CFA',
    time: '20:00',
    location: 'Sea Plaza',
    distance: '',
    participants: [
      { id: '1', initials: 'MB', bgColor: '#2c7a55' },
      { id: '2', initials: 'FA', bgColor: '#e0913a' },
    ],
    totalPlaces: 10,
    sportLabel: 'Foot',
    sportColor: '#2c7a55', // SportsColors.foot
    badgeTime: 'JEU  20:00',
    imageSource: require('@/assets/images/bg_home.jpeg'),
  },
];
