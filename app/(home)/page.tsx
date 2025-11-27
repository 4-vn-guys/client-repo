import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Separator } from '@shared/ui/separator';
import { IoTennisball } from 'react-icons/io5';
import { SiRacket } from 'react-icons/si';
import { FaBasketballBall, FaTableTennis } from 'react-icons/fa';
import { FaFutbol } from 'react-icons/fa6';
import Image from 'next/image';
import { TypographyH1, TypographyP } from '@shared/ui/typography';
import { SearchBar } from '@/src/features/home/search-bar';
import { getTranslations } from 'next-intl/server';

interface Sport {
  name: string;
  emoji: string;
  icon: React.ReactNode;
}

const sports: Sport[] = [
  {
    name: 'Football',
    emoji: '⚽',
    icon: <FaFutbol />,
  },
  {
    name: 'Badminton',
    emoji: '🏸',
    icon: <SiRacket />,
  },
  {
    name: 'Pickleball',
    emoji: '🥍',
    icon: <SiRacket />,
  },
  {
    name: 'Table Tennis',
    emoji: '🏓',
    icon: <FaTableTennis />,
  },
  {
    name: 'Tennis',
    emoji: '🎾',
    icon: <IoTennisball />,
  },
  {
    name: 'Basketball',
    emoji: '🏀',
    icon: <FaBasketballBall />,
  },
];

export default async function HomePage() {
  const tCommon = await getTranslations('HomePage');

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-green-50'>
      {/* Hero Section */}
      <section className='bg-primary text-primary-foreground relative py-20'>
        <Image
          className='absolute inset-0 h-full w-full object-cover object-center opacity-70'
          loading='eager'
          src='/images/background-home.jpeg'
          alt='Sports Court'
          width={1920}
          height={1080}
        />
        <div className='relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <TypographyH1 className='text-shadow-accent-foreground text-shadow-lg'>
            {tCommon('slogan')}
            <br />
            <span className='text-yellow-300'>{tCommon('subSlogan')}</span>
          </TypographyH1>
          <TypographyP className='text-shadow-accent-foreground mx-auto mb-8 max-w-3xl text-xl text-shadow-md md:text-2xl'>
            {tCommon('infoText')}
          </TypographyP>

          {/* Sport Selection */}
          <div className='mb-8 flex flex-wrap justify-center gap-4'>
            {sports.map(sport => (
              <Button
                key={sport.name}
                variant='secondary'
                className='shadow-accent-foreground h-auto rounded-full px-6 py-3 shadow-lg'
              >
                <span className='text-2xl'>{sport.emoji}</span>
                <span>{sport.name}</span>
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Featured Venues Section */}
      <section
        className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'
        id='featured-venues'
      >
        <h2 className='mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl'>
          Popular Venues Near You
        </h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {/* Venue Card 1 */}
          <Card className='overflow-hidden transition-shadow hover:shadow-xl'>
            <CardHeader className='p-0'>
              <div className='relative h-48 bg-linear-to-br from-green-400 to-blue-500'>
                <Badge className='absolute top-4 left-4 bg-white text-black hover:bg-white'>
                  🏸 Badminton
                </Badge>
                <Badge className='absolute top-4 right-4 bg-yellow-400 text-black hover:bg-yellow-400'>
                  ⭐ 4.8
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              <CardTitle className='mb-2 text-xl'>
                Sports Complex Downtown
              </CardTitle>
              <CardDescription className='mb-3 text-base'>
                Downtown • 2 courts available
              </CardDescription>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-2xl font-bold text-green-600'>
                  $25/hr
                </span>
                <div className='flex text-yellow-400'>★★★★★</div>
              </div>
              <Button className='w-full'>Book Now</Button>
            </CardContent>
          </Card>

          {/* Venue Card 2 */}
          <Card className='overflow-hidden transition-shadow hover:shadow-xl'>
            <CardHeader className='p-0'>
              <div className='relative h-48 bg-linear-to-br from-orange-400 to-red-500'>
                <Badge className='absolute top-4 left-4 bg-white text-black hover:bg-white'>
                  ⚽ Football
                </Badge>
                <Badge className='absolute top-4 right-4 bg-yellow-400 text-black hover:bg-yellow-400'>
                  ⭐ 4.9
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              <CardTitle className='mb-2 text-xl'>Green Field Arena</CardTitle>
              <CardDescription className='mb-3 text-base'>
                Westside • Full field available
              </CardDescription>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-2xl font-bold text-green-600'>
                  $50/hr
                </span>
                <div className='flex text-yellow-400'>★★★★★</div>
              </div>
              <Button className='w-full'>Book Now</Button>
            </CardContent>
          </Card>

          {/* Venue Card 3 */}
          <Card className='overflow-hidden transition-shadow hover:shadow-xl'>
            <CardHeader className='p-0'>
              <div className='relative h-48 bg-linear-to-br from-purple-400 to-pink-500'>
                <Badge className='absolute top-4 left-4 bg-white text-black hover:bg-white'>
                  🥍 Pickleball
                </Badge>
                <Badge className='absolute top-4 right-4 bg-yellow-400 text-black hover:bg-yellow-400'>
                  ⭐ 4.7
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              <CardTitle className='mb-2 text-xl'>Urban Courts Hub</CardTitle>
              <CardDescription className='mb-3 text-base'>
                Midtown • 4 courts available
              </CardDescription>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-2xl font-bold text-green-600'>
                  $15/hr
                </span>
                <div className='flex text-yellow-400'>★★★★★</div>
              </div>
              <Button className='w-full'>Book Now</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-gray-50 py-16' id='how-it-works'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl'>
            How It Works
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <Card className='text-center'>
              <CardHeader>
                <div className='bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                  <span className='text-primary-foreground text-2xl'>🔍</span>
                </div>
                <CardTitle className='text-xl'>1. Find Your Court</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>
                  Search by location, sport, and time. Browse photos, read
                  reviews, and compare prices.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className='text-center'>
              <CardHeader>
                <div className='bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                  <span className='text-primary-foreground text-2xl'>📅</span>
                </div>
                <CardTitle className='text-xl'>2. Book Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>
                  Select your preferred time slot and book immediately. No
                  waiting, no phone calls.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className='text-center'>
              <CardHeader>
                <div className='bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                  <span className='text-primary-foreground text-2xl'>🎾</span>
                </div>
                <CardTitle className='text-xl'>3. Play & Enjoy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>
                  Show up and play! All courts are verified, well-maintained,
                  and ready for action.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-800 md:text-4xl'>
            Why Choose CourtConnect?
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            The easiest way to find and book sports courts. Trusted by thousands
            of players.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='text-center'>
            <CardHeader>
              <div className='mb-4 text-4xl'>⚡</div>
              <CardTitle className='text-lg'>Instant Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Book courts in under 2 minutes</CardDescription>
            </CardContent>
          </Card>
          <Card className='text-center'>
            <CardHeader>
              <div className='mb-4 text-4xl'>💳</div>
              <CardTitle className='text-lg'>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Safe and encrypted transactions</CardDescription>
            </CardContent>
          </Card>
          <Card className='text-center'>
            <CardHeader>
              <div className='mb-4 text-4xl'>⭐</div>
              <CardTitle className='text-lg'>Verified Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>All courts inspected and rated</CardDescription>
            </CardContent>
          </Card>
          <Card className='text-center'>
            <CardHeader>
              <div className='mb-4 text-4xl'>📱</div>
              <CardTitle className='text-lg'>Mobile App</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Book on the go, anytime</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary text-primary-foreground py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Play?
          </h2>
          <p className='mb-8 text-xl'>
            Join thousands of players who trust CourtConnect for their sports
            court bookings.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button size='lg' className='px-8 py-4'>
              Find Courts Near Me
            </Button>
            <Button variant='outline' size='lg' className='px-8 py-4'>
              List Your Venue
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 py-12 text-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div>
              <div className='text-primary mb-4 text-2xl font-bold'>
                CourtConnect
              </div>
              <p className='text-gray-400'>
                Your trusted partner for booking sports courts across the city.
              </p>
            </div>
            <div>
              <h3 className='mb-4 font-bold'>Sports</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white'>
                    Football
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Badminton
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Pickleball
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='mb-4 font-bold'>Company</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Contact
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='mb-4 font-bold'>Legal</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className='my-8' />
          <div className='text-muted-foreground text-center'>
            <p>&copy; 2024 CourtConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
