
import { Venue } from '@/entities/venue';

export const MOCK_VENUES: Venue[] = [
  {
    id: '1',
    name: 'Downtown Sports Complex',
    address: '123 Main St, Downtown, Cityville',
    operatingHours: '06:00 - 23:00',
    isActive: true,
    policy: 'No cancellation within 24h. Full refund if canceled earlier.',
  },
  {
    id: '2',
    name: 'Westside Tennis Club',
    address: '456 West Ave, Westside, Cityville',
    operatingHours: '07:00 - 22:00',
    isActive: true,
    policy: 'Rain check available. Members only on weekends.',
  },
  {
    id: '3',
    name: 'Community Center Courts',
    address: '789 Park Ln, Northside, Cityville',
    operatingHours: '08:00 - 20:00',
    isActive: false,
    policy: 'Free for residents. Booking required 48h in advance.',
  },
   {
    id: '4',
    name: 'Elite Badminton Arena',
    address: '101 Shuttle Way, Eastside, Cityville',
    operatingHours: '05:00 - 00:00',
    isActive: true,
    policy: 'Professional gear required. No casual play.',
  },
  {
    id: '5',
    name: 'North Point Gym',
    address: '555 North Point Blvd',
    operatingHours: '05:00 - 22:00',
    isActive: true,
    policy: 'Towel service included.',
  },
  {
    id: '6',
    name: 'Sunshine Recreation',
    address: '88 Sunny Rd, Beachside',
    operatingHours: '08:00 - 18:00',
    isActive: true,
    policy: 'Outdoor courts only.',
  },
  {
    id: '7',
    name: 'Old Town Basketball',
    address: '44 Cobblestone way',
    operatingHours: '09:00 - 21:00',
    isActive: false,
    policy: 'Renovations in progress.',
  },
  {
    id: '8',
    name: 'Central Squash Courts',
    address: '22 Central Plaza',
    operatingHours: '06:00 - 22:00',
    isActive: true,
    policy: 'Eye protection mandatory.',
  },
  {
    id: '9',
    name: 'Highland Soccer Indoor',
    address: '990 Highland Dr',
    operatingHours: '10:00 - 23:00',
    isActive: true,
    policy: 'Team booking only.',
  },
  {
    id: '10',
    name: 'Riverside Pickleball',
    address: '12 River Rd',
    operatingHours: '07:00 - 20:00',
    isActive: true,
    policy: 'Paddle rental available.',
  },
];

export async function fetchVenues(): Promise<Venue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_VENUES;
}

export async function fetchVenueById(id: string): Promise<Venue | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_VENUES.find((v) => v.id === id);
}
