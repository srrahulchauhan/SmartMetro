export const INITIAL_USER = {
  name: 'Rahul Chauhan',
  email: 'rahul.chauhan@metrogo.in',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'March 2024',
  membershipTier: 'Platinum Commuter',
  totalJourneys: 142,
  co2SavedKg: 84.6,
  carbonCredits: 280
};

export const INITIAL_SAVED_PASSENGERS = [
  { id: 'p1', name: 'Rahul Chauhan', age: 28, gender: 'Male', phone: '+91 98765 43210', isSelf: true },
  { id: 'p2', name: 'Priya Sharma', age: 26, gender: 'Female', phone: '+91 98123 45678', isSelf: false },
  { id: 'p3', name: 'Amit Verma', age: 31, gender: 'Male', phone: '+91 97654 32109', isSelf: false }
];

export const INITIAL_SAVED_ROUTES = [
  {
    id: 'sr1',
    name: 'Home → Office',
    fromStationId: 'sec-137',
    toStationId: 'sec-16',
    fromName: 'Noida Sector 137',
    toName: 'Noida Sector 16',
    estimatedTime: '24 min',
    fare: 40,
    line: 'aqua',
    icon: 'briefcase'
  },
  {
    id: 'sr2',
    name: 'Office → Shopping Mall',
    fromStationId: 'sec-16',
    toStationId: 'sec-18',
    fromName: 'Noida Sector 16',
    toName: 'Noida Sector 18',
    estimatedTime: '4 min',
    fare: 15,
    line: 'blue',
    icon: 'shopping-bag'
  },
  {
    id: 'sr3',
    name: 'Home → Pari Chowk Hub',
    fromStationId: 'sec-137',
    toStationId: 'pari-chowk',
    fromName: 'Noida Sector 137',
    toName: 'Pari Chowk',
    estimatedTime: '18 min',
    fare: 30,
    line: 'aqua',
    icon: 'map-pin'
  }
];

export const INITIAL_CARD = {
  cardNumber: '6528 8901 2489 4410',
  holderName: 'Rahul Chauhan',
  balance: 850.00,
  isFrozen: false,
  autoRecharge: true,
  autoRechargeThreshold: 100,
  autoRechargeAmount: 500,
  validUntil: '12/29',
  qrCode: 'METROPASS-VIRTUAL-6528890124894410',
  dailyCapUsed: 75.00,
  dailyCapMax: 200.00,
  cashbackEarned: 145.00
};

export const INITIAL_TICKETS = [
  {
    id: 'NM-2026-T8821',
    fromStationId: 'noida-electronic-city',
    toStationId: 'sec-16',
    fromStationName: 'Electronic City',
    toStationName: 'Noida Sector 16',
    journeyType: 'Single Journey',
    date: new Date().toISOString().split('T')[0],
    time: '06:42 PM',
    passengers: [
      { name: 'Rahul Chauhan', age: 28, phone: '+91 98765 43210' }
    ],
    fare: 35.00,
    stopsCount: 6,
    durationMins: 16,
    status: 'ACTIVE', // ACTIVE | UPCOMING | COMPLETED | CANCELLED
    line: 'blue',
    paymentMethod: 'UPI (Google Pay)',
    qrData: 'METROGO:NM-2026-T8821:NEC:NS16:35:ACTIVE',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 3600000).toISOString()
  },
  {
    id: 'NM-2026-T7419',
    fromStationId: 'sec-137',
    toStationId: 'pari-chowk',
    fromStationName: 'Noida Sector 137',
    toStationName: 'Pari Chowk',
    journeyType: 'Return Journey',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '09:15 AM',
    passengers: [
      { name: 'Rahul Chauhan', age: 28, phone: '+91 98765 43210' },
      { name: 'Priya Sharma', age: 26, phone: '+91 98123 45678' }
    ],
    fare: 100.00,
    stopsCount: 6,
    durationMins: 18,
    status: 'UPCOMING',
    line: 'aqua',
    paymentMethod: 'Virtual Metro Card',
    qrData: 'METROGO:NM-2026-T7419:NS137:PARI:100:UPCOMING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  {
    id: 'NM-2026-T5190',
    fromStationId: 'botanical-garden',
    toStationId: 'rajiv-chowk',
    fromStationName: 'Botanical Garden',
    toStationName: 'Rajiv Chowk',
    journeyType: 'Single Journey',
    date: '2026-08-22',
    time: '04:30 PM',
    passengers: [{ name: 'Rahul Chauhan', age: 28, phone: '+91 98765 43210' }],
    fare: 45.00,
    stopsCount: 8,
    durationMins: 28,
    status: 'COMPLETED',
    line: 'blue',
    paymentMethod: 'UPI',
    qrData: 'METROGO:NM-2026-T5190:BG:RC:45:COMPLETED',
    createdAt: '2026-08-22T16:25:00.000Z',
    expiresAt: '2026-08-22T19:25:00.000Z'
  },
  {
    id: 'NM-2026-T4022',
    fromStationId: 'sec-51',
    toStationId: 'knowledge-park-2',
    fromStationName: 'Noida Sector 51',
    toStationName: 'Knowledge Park II',
    journeyType: 'Single Journey',
    date: '2026-08-20',
    time: '11:00 AM',
    passengers: [{ name: 'Rahul Chauhan', age: 28, phone: '+91 98765 43210' }],
    fare: 35.00,
    stopsCount: 8,
    durationMins: 22,
    status: 'CANCELLED',
    refundStatus: 'Refund Credited (₹35.00)',
    refundId: 'RF-992144',
    line: 'aqua',
    paymentMethod: 'Debit Card',
    qrData: 'METROGO:NM-2026-T4022:NS51:KPII:35:CANCELLED',
    createdAt: '2026-08-20T10:50:00.000Z',
    expiresAt: '2026-08-20T13:50:00.000Z'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-90812',
    date: new Date().toISOString(),
    type: 'DEBIT',
    category: 'Ticket Booking',
    title: 'Ticket: Electronic City → Sector 16',
    ticketId: 'NM-2026-T8821',
    amount: 35.00,
    status: 'Completed',
    paymentMethod: 'Google Pay'
  },
  {
    id: 'TXN-90765',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'CREDIT',
    category: 'Metro Card Recharge',
    title: 'Wallet Recharge (+ ₹500.00)',
    amount: 500.00,
    status: 'Completed',
    paymentMethod: 'UPI AutoPay'
  },
  {
    id: 'TXN-90544',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'REFUND',
    category: 'Ticket Refund',
    title: 'Refund for NM-2026-T4022',
    ticketId: 'NM-2026-T4022',
    amount: 35.00,
    status: 'Credited',
    paymentMethod: 'Refund to Card'
  },
  {
    id: 'TXN-90310',
    date: new Date(Date.now() - 259200000).toISOString(),
    type: 'DEBIT',
    category: 'Journey Fare',
    title: 'NFC Gate Tap: Botanical Garden',
    amount: 45.00,
    status: 'Completed',
    paymentMethod: 'Virtual Metro Card'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Journey',
    title: 'Destination Alert 🚇',
    message: 'You are approaching Noida Sector 16. Your destination is 1 station away. Please prepare to exit on Platform 2.',
    timestamp: '2 min ago',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-2',
    category: 'Ticket',
    title: 'Ticket Confirmed ✓',
    message: 'Booking confirmed for Electronic City → Noida Sector 16. Ticket ID: NM-2026-T8821.',
    timestamp: '15 min ago',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-3',
    category: 'Payment',
    title: 'Wallet Balance Update',
    message: 'Your Virtual Metro Card balance is ₹850.00. 10% commuter discount active.',
    timestamp: '2 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: 'notif-4',
    category: 'Service',
    title: 'Normal Service Resumed',
    message: 'Aqua Line frequency has returned to normal 4-minute headway following scheduled maintenance.',
    timestamp: '1 day ago',
    read: true,
    type: 'info'
  },
  {
    id: 'notif-5',
    category: 'Offers',
    title: 'Weekend Green Travel Reward 🎉',
    message: 'Earn 2x carbon credits and 15% cashback on all metro rides this Saturday and Sunday!',
    timestamp: '2 days ago',
    read: true,
    type: 'offer'
  }
];

export const ADMIN_STATS = {
  totalUsers: 842930,
  todayTickets: 38450,
  activeJourneys: 4120,
  todayRevenue: 1489200,
  cancelledTickets: 312,
  virtualCardsActive: 318400,
  hourlyTraffic: [
    { hour: '06:00', passengers: 4200, revenue: 147000 },
    { hour: '08:00', passengers: 18500, revenue: 647500 },
    { hour: '10:00', passengers: 26400, revenue: 924000 },
    { hour: '12:00', passengers: 12100, revenue: 423500 },
    { hour: '14:00', passengers: 10800, revenue: 378000 },
    { hour: '16:00', passengers: 17200, revenue: 602000 },
    { hour: '18:00', passengers: 31500, revenue: 1102500 },
    { hour: '20:00', passengers: 22800, revenue: 798000 },
    { hour: '22:00', passengers: 8300, revenue: 290500 },
  ],
  lineDistribution: [
    { name: 'Aqua Line', value: 38, color: '#06b6d4' },
    { name: 'Blue Line', value: 44, color: '#2563eb' },
    { name: 'Magenta Line', value: 12, color: '#d946ef' },
    { name: 'Airport Express', value: 6, color: '#f97316' },
  ],
  ticketTypeShare: [
    { name: 'QR Digital Ticket', value: 58, color: '#6366f1' },
    { name: 'Virtual Metro Card', value: 34, color: '#10b981' },
    { name: 'Paper Token/Counter', value: 8, color: '#94a3b8' },
  ],
  popularStations: [
    { station: 'Botanical Garden', ridership: '48,200', growth: '+12%' },
    { station: 'Electronic City', ridership: '41,500', growth: '+8%' },
    { station: 'Noida Sector 18', ridership: '39,100', growth: '+15%' },
    { station: 'Pari Chowk', ridership: '34,800', growth: '+6%' },
    { station: 'Sector 51/52 Hub', ridership: '32,400', growth: '+18%' },
  ]
};
