import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@/src/shared/ui';
import { HeroSection } from '@/src/widgets/hero-section';
import { Footer } from '@/src/widgets/footer';

export function HomePage() {
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-green-50'>
      {/* Hero Section */}
      <HeroSection />

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
      <Footer />
    </div>
  );
}
