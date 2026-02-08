import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { CompanyType } from "@/types/api";

import type {
  GlobalRegion,
  LatestTableConfig,
  ReviewMetric,
  ReviewItem,
  ReviewThread,
  StatCard,
} from "./dashboard.types";

const assetCell = (image: string, title: string, subtitle?: string) => (
  <div className="flex items-center gap-3 min-w-[160px]">
    <img
      src={image}
      alt={title}
      className="h-10 w-10 rounded-lg object-cover border border-gray-100"
    />
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {subtitle ? (
        <p className="text-xs text-gray-500 truncate max-w-[180px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  </div>
);

const personCell = (name: string, subtitle?: string, avatar?: string) => (
  <div className="flex items-center gap-2 min-w-[140px]">
    <Avatar size="sm">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-sm font-medium text-gray-900">{name}</p>
      {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
    </div>
  </div>
);

const statusPill = (label: string, tone: "success" | "warning" | "error") => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      tone === "success" && "bg-success-50 text-success-700",
      tone === "warning" && "bg-warning-50 text-warning-700",
      tone === "error" && "bg-error-50 text-error-700"
    )}
  >
    {label}
  </span>
);

const actionMenuCell = () => (
  <Button
    variant="ghost"
    size="icon-sm"
    className="rounded-xl border border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100"
    aria-label="Open actions"
  >
    ...
  </Button>
);

export const companyLabelByType: Record<CompanyType, string> = {
  rent_a_car: "Car Rental",
  hotel: "Hotel",
  hospital: "Hospital",
  flight: "Flight",
  transfer: "Transfer",
  tour: "Tour",
  event: "Event",
  activity: "Activity",
  health: "Health",
  room: "Room",
};

export const companyUnitByType: Record<CompanyType, string> = {
  rent_a_car: "car",
  hotel: "hotel",
  hospital: "hospital",
  flight: "flight",
  transfer: "transfer",
  tour: "tour",
  event: "event",
  activity: "activity",
  health: "health center",
  room: "room",
};

export const stats: StatCard[] = [
  {
    label: "Total bookings",
    value: "25,567",
    change: "6.5%",
    trend: "up",
    note: "Since last month",
  },
  {
    label: "Total earnings",
    value: "150k",
    change: "12.5%",
    trend: "down",
    note: "Since last month",
  },
  {
    label: "Average ratings",
    value: "5.0",
    change: "0.8%",
    trend: "up",
    note: "Since last month",
  },
  {
    label: "Completed bookings",
    value: "1,256",
    change: "6.5%",
    trend: "up",
    note: "Since last month",
  },
];

export const revenueData = [
  { month: "Jan", revenue: 42, margin: 66 },
  { month: "Feb", revenue: 31, margin: 64 },
  { month: "Mar", revenue: 62, margin: 22 },
  { month: "Apr", revenue: 58, margin: 18 },
  { month: "May", revenue: 19, margin: 36 },
  { month: "Jun", revenue: 51, margin: 54 },
  { month: "Jul", revenue: 28, margin: 72 },
  { month: "Aug", revenue: 39, margin: 49 },
  { month: "Sep", revenue: 34, margin: 42 },
  { month: "Oct", revenue: 26, margin: 36 },
  { month: "Nov", revenue: 46, margin: 58 },
  { month: "Dec", revenue: 61, margin: 30 },
];

export const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-brand-500)",
  },
  margin: {
    label: "Gross margin",
    color: "var(--color-warning-400)",
  },
};

export const globalRegions: GlobalRegion[] = [
  { label: "Netherlands", value: "22%" },
  { label: "Germany", value: "21%" },
  { label: "Belgium", value: "20%" },
  { label: "Poland", value: "19%" },
  { label: "Austria", value: "19%" },
  { label: "France", value: "18%" },
  { label: "Sweden", value: "17%" },
  { label: "Spain", value: "16%" },
];

export const reviews: ReviewItem[] = [
  {
    id: "review-1",
    rating: 4.5,
    date: "24 Sept, 2023",
    text: "An Anglican church designed by Sir Christopher Wren, known for its rich history and architectural significance.",
    name: "John Doe",
    meta: "Traveled with partner",
    avatar: "/images/user/user-01.jpg",
  },
  {
    id: "review-2",
    rating: 4.7,
    date: "12 Sept, 2023",
    text: "A stunning experience with helpful staff, beautiful interiors, and seamless check-in throughout our stay.",
    name: "Sophia Carter",
    meta: "Family trip",
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: "review-3",
    rating: 4.3,
    date: "08 Sept, 2023",
    text: "Smooth booking experience, comfortable amenities, and friendly hosts. Would book again.",
    name: "Michael Brooks",
    meta: "Business travel",
    avatar: "/images/user/user-03.jpg",
  },
];

export const reviewModalSummary = {
  rating: 5.0,
  total: 45,
};

export const reviewMetrics: ReviewMetric[] = [
  { label: "Cleanliness", score: 4.9 },
  { label: "Service", score: 4.8 },
  { label: "Comfort", score: 4.8 },
  { label: "Communication", score: 4.8 },
  { label: "Accuracy", score: 4.7 },
  { label: "Value", score: 4.7 },
  { label: "Location", score: 4.7 },
  { label: "Amenities", score: 4.7 },
];

export const reviewThreads: ReviewThread[] = [
  {
    id: "review-thread-1",
    name: "Sarah Johnson",
    time: "3h ago",
    rating: 5.0,
    text: "Great stay overall! The staff were friendly and the room was clean. Would definitely come back.",
    likes: 1,
    avatar: "/images/user/user-01.jpg",
    reply: {
      name: "Jake Thompson",
      time: "3h ago",
      text: "Thank you so much, Sarah! We're delighted to hear you had a positive experience.",
      likes: 1,
      avatar: "/images/user/user-04.jpg",
    },
  },
  {
    id: "review-thread-2",
    name: "Nina Patel",
    time: "3h ago",
    rating: 4.7,
    text: "We appreciate your feedback and will keep working to make every stay comfortable and enjoyable.",
    likes: 1,
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: "review-thread-3",
    name: "Michael Brooks",
    time: "5h ago",
    rating: 4.5,
    text: "Smooth booking experience, comfortable amenities, and friendly hosts. Would book again.",
    likes: 2,
    avatar: "/images/user/user-03.jpg",
    reply: {
      name: "Support Team",
      time: "4h ago",
      text: "We appreciate the kind words! Looking forward to welcoming you again.",
      likes: 1,
      avatar: "/images/user/user-06.jpg",
    },
  },
];

const hotelLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all list",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "room", label: "Room" },
    { key: "guests", label: "Number of Guests" },
    { key: "price", label: "Price" },
    { key: "payments", label: "Payments" },
  ],
  rows: [
    {
      id: "hotel-1",
      cells: {
        rank: "1",
        room: assetCell(
          "/images/product/product-01.jpg",
          "Suite Deluxe",
          "1 King size bed, 1 double bed"
        ),
        guests: "3",
        price: "$1,200",
        payments: "$3,600",
      },
    },
    {
      id: "hotel-2",
      cells: {
        rank: "2",
        room: assetCell(
          "/images/product/product-02.jpg",
          "Ocean View Room",
          "1 King size bed, 1 sofa bed"
        ),
        guests: "2",
        price: "$800",
        payments: "$1,600",
      },
    },
    {
      id: "hotel-3",
      cells: {
        rank: "3",
        room: assetCell(
          "/images/product/product-03.jpg",
          "Mountain Cabin",
          "2 Queen size beds"
        ),
        guests: "4",
        price: "$1,500",
        payments: "$6,000",
      },
    },
    {
      id: "hotel-4",
      cells: {
        rank: "4",
        room: assetCell(
          "/images/product/product-04.jpg",
          "Business Suite",
          "1 King size bed, Work desk"
        ),
        guests: "2",
        price: "$1,000",
        payments: "$2,000",
      },
    },
    {
      id: "hotel-5",
      cells: {
        rank: "5",
        room: assetCell(
          "/images/product/product-05.jpg",
          "Family Room",
          "1 King size bed, 2 single beds"
        ),
        guests: "5",
        price: "$1,300",
        payments: "$7,500",
      },
    },
  ],
};

const tourLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all list",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "tour", label: "Tour Name" },
    { key: "destination", label: "Destination" },
    { key: "duration", label: "Duration" },
    { key: "language", label: "Language" },
  ],
  rows: [
    {
      id: "tour-1",
      cells: {
        rank: "1",
        tour: assetCell(
          "/images/backgrounds/tour-hero.jpg",
          "Eiffel Tower + Seine Cruise",
          "Discover Paris from two breathtaking views"
        ),
        destination: "Paris, France",
        duration: "3 hours",
        language: "English, French",
      },
    },
    {
      id: "tour-2",
      cells: {
        rank: "2",
        tour: assetCell(
          "/images/backgrounds/custom-tour.jpg",
          "Grand Canyon Day Trip",
          "Embark on a full-day adventure"
        ),
        destination: "Arizona, USA",
        duration: "1 day",
        language: "English",
      },
    },
    {
      id: "tour-3",
      cells: {
        rank: "3",
        tour: assetCell(
          "/images/backgrounds/adventures.svg",
          "Kyoto Temples & Tea Tour",
          "Dive into Japan's rich history"
        ),
        destination: "Kyoto, Japan",
        duration: "6 hours",
        language: "English, Japanese",
      },
    },
    {
      id: "tour-4",
      cells: {
        rank: "4",
        tour: assetCell(
          "/images/backgrounds/activity-hero.jpg",
          "Serengeti Safari Experience",
          "Witness the raw beauty of Africa"
        ),
        destination: "Serengeti, Tanzania",
        duration: "3 days",
        language: "English, Swahili",
      },
    },
    {
      id: "tour-5",
      cells: {
        rank: "5",
        tour: assetCell(
          "/images/backgrounds/home-hero.jpg",
          "Amalfi Coast Boat Tour",
          "Sail along Italy's stunning coastline"
        ),
        destination: "Amalfi, Italy",
        duration: "8 hours",
        language: "English, Italian",
      },
    },
  ],
};

const rentCarLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all list",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "car", label: "Car Name" },
    { key: "type", label: "Car Type" },
    { key: "color", label: "Color" },
    { key: "customer", label: "Customer Name" },
  ],
  rows: [
    {
      id: "car-1",
      cells: {
        rank: "1",
        car: assetCell(
          "/images/carousel/carousel-01.png",
          "Toyota Corolla",
          "A reliable and fuel-efficient sedan"
        ),
        type: "Sedan",
        color: "White",
        customer: personCell(
          "James Carter",
          "Premium",
          "/images/user/user-04.jpg"
        ),
      },
    },
    {
      id: "car-2",
      cells: {
        rank: "2",
        car: assetCell(
          "/images/carousel/carousel-02.png",
          "Hyundai Tucson",
          "A compact SUV with modern features"
        ),
        type: "SUV",
        color: "Red",
        customer: personCell(
          "Emily Ross",
          "Standard",
          "/images/user/user-05.jpg"
        ),
      },
    },
    {
      id: "car-3",
      cells: {
        rank: "3",
        car: assetCell(
          "/images/carousel/carousel-03.png",
          "Mercedes E-Class",
          "Luxury sedan with top-tier comfort"
        ),
        type: "Hatchback",
        color: "Blue",
        customer: personCell(
          "Sophie Bennett",
          "Premium",
          "/images/user/user-06.jpg"
        ),
      },
    },
    {
      id: "car-4",
      cells: {
        rank: "4",
        car: assetCell(
          "/images/carousel/carousel-04.png",
          "Ford Minibus",
          "A spacious 8-seater van"
        ),
        type: "SUV",
        color: "Black",
        customer: personCell(
          "Daniel Brooks",
          "Corporate",
          "/images/user/user-07.jpg"
        ),
      },
    },
    {
      id: "car-5",
      cells: {
        rank: "5",
        car: assetCell(
          "/images/carousel/carousel-01.png",
          "Fiat 500",
          "A compact, stylish city car"
        ),
        type: "Crossover",
        color: "White",
        customer: personCell(
          "Michael Henderson",
          "Standard",
          "/images/user/user-08.jpg"
        ),
      },
    },
  ],
};

const transferLatest: LatestTableConfig = {
  title: "Latest transfers",
  ctaLabel: "See all transfers",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "transfer", label: "Transfer" },
    { key: "pickup", label: "Pickup" },
    { key: "dropoff", label: "Dropoff" },
    { key: "status", label: "Status" },
  ],
  rows: [
    {
      id: "transfer-1",
      cells: {
        rank: "1",
        transfer: assetCell(
          "/images/backgrounds/transfer-hero.jpg",
          "Airport to Downtown",
          "Private sedan"
        ),
        pickup: "LAX Airport",
        dropoff: "Central Plaza",
        status: statusPill("Completed", "success"),
      },
    },
    {
      id: "transfer-2",
      cells: {
        rank: "2",
        transfer: assetCell(
          "/images/backgrounds/rent-car-hero.jpg",
          "City to Conference",
          "Executive SUV"
        ),
        pickup: "West End",
        dropoff: "Summit Center",
        status: statusPill("In transit", "warning"),
      },
    },
    {
      id: "transfer-3",
      cells: {
        rank: "3",
        transfer: assetCell(
          "/images/backgrounds/yourrentcarsection.jpg",
          "Hotel to Stadium",
          "Minibus"
        ),
        pickup: "Harbor Hotel",
        dropoff: "Arena Gate 3",
        status: statusPill("Scheduled", "success"),
      },
    },
    {
      id: "transfer-4",
      cells: {
        rank: "4",
        transfer: assetCell(
          "/images/backgrounds/home-hero.jpg",
          "Downtown to Airport",
          "Luxury sedan"
        ),
        pickup: "City Square",
        dropoff: "JFK Airport",
        status: statusPill("Delayed", "error"),
      },
    },
    {
      id: "transfer-5",
      cells: {
        rank: "5",
        transfer: assetCell(
          "/images/backgrounds/transfer-hero.jpg",
          "Resort Shuttle",
          "Shared van"
        ),
        pickup: "Palm Resort",
        dropoff: "Marina Gate",
        status: statusPill("Completed", "success"),
      },
    },
  ],
};

const flightLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all flights",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "flight", label: "Flight" },
    { key: "route", label: "Route" },
    { key: "departure", label: "Departure" },
    { key: "status", label: "Status" },
  ],
  rows: [
    {
      id: "flight-1",
      cells: {
        rank: "1",
        flight: assetCell(
          "/images/backgrounds/flight-hero.jpg",
          "HH 218",
          "Economy • Boeing 737"
        ),
        route: "NYC → LAX",
        departure: "10:45 AM",
        status: statusPill("On time", "success"),
      },
    },
    {
      id: "flight-2",
      cells: {
        rank: "2",
        flight: assetCell(
          "/images/backgrounds/flight-hero.jpg",
          "HH 450",
          "Business • Airbus A320"
        ),
        route: "SFO → ORD",
        departure: "12:10 PM",
        status: statusPill("Boarding", "warning"),
      },
    },
    {
      id: "flight-3",
      cells: {
        rank: "3",
        flight: assetCell(
          "/images/backgrounds/flight-hero.jpg",
          "HH 702",
          "Economy • Boeing 787"
        ),
        route: "DXB → LHR",
        departure: "03:30 PM",
        status: statusPill("Delayed", "error"),
      },
    },
    {
      id: "flight-4",
      cells: {
        rank: "4",
        flight: assetCell(
          "/images/backgrounds/flight-hero.jpg",
          "HH 119",
          "Premium • Airbus A330"
        ),
        route: "JFK → MIA",
        departure: "06:20 PM",
        status: statusPill("On time", "success"),
      },
    },
    {
      id: "flight-5",
      cells: {
        rank: "5",
        flight: assetCell(
          "/images/backgrounds/flight-hero.jpg",
          "HH 810",
          "Economy • Boeing 737"
        ),
        route: "SEA → DEN",
        departure: "08:15 PM",
        status: statusPill("On time", "success"),
      },
    },
  ],
};

const eventLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all events",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "event", label: "Event" },
    { key: "location", label: "Location" },
    { key: "date", label: "Date" },
    { key: "tickets", label: "Tickets" },
  ],
  rows: [
    {
      id: "event-1",
      cells: {
        rank: "1",
        event: assetCell(
          "/images/backgrounds/adventures.svg",
          "City Jazz Night",
          "Live music & lounge"
        ),
        location: "New Orleans",
        date: "Sep 24",
        tickets: "140",
      },
    },
    {
      id: "event-2",
      cells: {
        rank: "2",
        event: assetCell(
          "/images/backgrounds/home-hero.jpg",
          "Tech Leaders Summit",
          "Industry keynote sessions"
        ),
        location: "San Francisco",
        date: "Sep 28",
        tickets: "320",
      },
    },
    {
      id: "event-3",
      cells: {
        rank: "3",
        event: assetCell(
          "/images/backgrounds/custom-tour.jpg",
          "Art & Design Expo",
          "Gallery openings"
        ),
        location: "Berlin",
        date: "Oct 02",
        tickets: "210",
      },
    },
    {
      id: "event-4",
      cells: {
        rank: "4",
        event: assetCell(
          "/images/backgrounds/activity-hero.jpg",
          "Food & Wine Festival",
          "Chef tasting tours"
        ),
        location: "Tuscany",
        date: "Oct 08",
        tickets: "180",
      },
    },
    {
      id: "event-5",
      cells: {
        rank: "5",
        event: assetCell(
          "/images/backgrounds/tour-hero.jpg",
          "Coastal Marathon",
          "Race + wellness weekend"
        ),
        location: "Lisbon",
        date: "Oct 12",
        tickets: "260",
      },
    },
  ],
};

const activityLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all activities",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "activity", label: "Activity" },
    { key: "location", label: "Location" },
    { key: "duration", label: "Duration" },
    { key: "guide", label: "Guide" },
  ],
  rows: [
    {
      id: "activity-1",
      cells: {
        rank: "1",
        activity: assetCell(
          "/images/backgrounds/activity-hero.jpg",
          "Cliffside Hike",
          "Sunrise trail experience"
        ),
        location: "Zion, USA",
        duration: "4 hours",
        guide: "S. Navarro",
      },
    },
    {
      id: "activity-2",
      cells: {
        rank: "2",
        activity: assetCell(
          "/images/backgrounds/tour-hero.jpg",
          "City Food Walk",
          "Local flavors tour"
        ),
        location: "Lisbon, PT",
        duration: "3 hours",
        guide: "R. Alves",
      },
    },
    {
      id: "activity-3",
      cells: {
        rank: "3",
        activity: assetCell(
          "/images/backgrounds/custom-tour.jpg",
          "Kayak & Cave",
          "Ocean cave discovery"
        ),
        location: "Algarve, PT",
        duration: "2 hours",
        guide: "M. Silva",
      },
    },
    {
      id: "activity-4",
      cells: {
        rank: "4",
        activity: assetCell(
          "/images/backgrounds/home-hero.jpg",
          "Cultural Workshop",
          "Local artisan class"
        ),
        location: "Kyoto, JP",
        duration: "2 hours",
        guide: "T. Mori",
      },
    },
    {
      id: "activity-5",
      cells: {
        rank: "5",
        activity: assetCell(
          "/images/backgrounds/adventures.svg",
          "Night Market Tour",
          "Street food + shopping"
        ),
        location: "Bangkok, TH",
        duration: "3 hours",
        guide: "N. Kiat",
      },
    },
  ],
};

const hospitalLatest: LatestTableConfig = {
  title: "Latest bookings",
  ctaLabel: "See all list",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "service", label: "Service Name" },
    { key: "department", label: "Department" },
    { key: "doctor", label: "Doctor Name" },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price Info" },
    { key: "location", label: "Location" },
    { key: "contact", label: "Contact Info" },
    { key: "actions", label: "Actions", headerClassName: "text-right" },
  ],
  rows: [
    {
      id: "hospital-1",
      cells: {
        rank: "1",
        service: "MRI Scan (Brain)",
        department: "Radiology",
        doctor: "Dr. Elena Petrov",
        duration: "45 mins",
        price: "Contact for pricing",
        location: "Block A, Room 203",
        contact: "+44 20 1234 5678",
        actions: <div className="flex justify-end">{actionMenuCell()}</div>,
      },
    },
    {
      id: "hospital-2",
      cells: {
        rank: "2",
        service: "General Health Check",
        department: "General Clinic",
        doctor: "Dr. Michael Andersen",
        duration: "30 mins",
        price: "Ask at reception",
        location: "Block B, Room 110",
        contact: "info@cityhospital.com",
        actions: <div className="flex justify-end">{actionMenuCell()}</div>,
      },
    },
    {
      id: "hospital-3",
      cells: {
        rank: "3",
        service: "Cardiology Consultation",
        department: "Cardiology",
        doctor: "Dr. Sofia Romano",
        duration: "25 mins",
        price: "Contact for pricing",
        location: "Block C, Room 304",
        contact: "cardio@cityhospital.com",
        actions: <div className="flex justify-end">{actionMenuCell()}</div>,
      },
    },
    {
      id: "hospital-4",
      cells: {
        rank: "4",
        service: "Abdomen Ultrasound",
        department: "Radiology",
        doctor: "Dr. Hiroshi Tanaka",
        duration: "20 mins",
        price: "Ask at reception",
        location: "Block A, Room 208",
        contact: "+81 3 4567 8910",
        actions: <div className="flex justify-end">{actionMenuCell()}</div>,
      },
    },
    {
      id: "hospital-5",
      cells: {
        rank: "5",
        service: "Physiotherapy Session",
        department: "Rehabilitation",
        doctor: "Dr. Maria Schneider",
        duration: "1 hour",
        price: "Contact front desk",
        location: "Block D, Room 101",
        contact: "physio@cityhospital.com",
        actions: <div className="flex justify-end">{actionMenuCell()}</div>,
      },
    },
  ],
};

const healthLatest: LatestTableConfig = {
  title: "Latest sessions",
  ctaLabel: "See all sessions",
  columns: [
    { key: "rank", label: "Rank", headerClassName: "w-12" },
    { key: "package", label: "Package" },
    { key: "specialist", label: "Specialist" },
    { key: "session", label: "Session" },
    { key: "status", label: "Status" },
  ],
  rows: [
    {
      id: "health-1",
      cells: {
        rank: "1",
        package: assetCell(
          "/images/health/service/service-1.webp",
          "Wellness Reset",
          "Nutrition + mobility"
        ),
        specialist: "Dr. Nguyen",
        session: "10:30 AM",
        status: statusPill("Confirmed", "success"),
      },
    },
    {
      id: "health-2",
      cells: {
        rank: "2",
        package: assetCell(
          "/images/health/service/service-2.jpg",
          "Stress Relief",
          "Mindfulness session"
        ),
        specialist: "Dr. Kim",
        session: "11:00 AM",
        status: statusPill("Pending", "warning"),
      },
    },
    {
      id: "health-3",
      cells: {
        rank: "3",
        package: assetCell(
          "/images/health/service/service-3.jpg",
          "Rehab Therapy",
          "Post-injury support"
        ),
        specialist: "Dr. Allen",
        session: "01:00 PM",
        status: statusPill("In session", "success"),
      },
    },
    {
      id: "health-4",
      cells: {
        rank: "4",
        package: assetCell(
          "/images/health/consult.jpg",
          "Diet Consultation",
          "Personalized plan"
        ),
        specialist: "Dr. Mora",
        session: "02:15 PM",
        status: statusPill("Confirmed", "success"),
      },
    },
    {
      id: "health-5",
      cells: {
        rank: "5",
        package: assetCell(
          "/images/health/resort-1.jpg",
          "Recovery Retreat",
          "Weekend program"
        ),
        specialist: "Dr. Diaz",
        session: "04:00 PM",
        status: statusPill("Scheduled", "success"),
      },
    },
  ],
};

export const latestTablesByType: Record<CompanyType, LatestTableConfig> = {
  rent_a_car: rentCarLatest,
  hotel: hotelLatest,
  hospital: hospitalLatest,
  flight: flightLatest,
  transfer: transferLatest,
  tour: tourLatest,
  event: eventLatest,
  activity: activityLatest,
  health: healthLatest,
  room: hotelLatest,
};

export const resolveDashboardContent = (
  companyType?: CompanyType
): {
  resolvedCompanyType: CompanyType;
  companyLabel: string;
  companyUnit: string;
  latestTable: LatestTableConfig;
} => {
  const resolvedCompanyType = companyType ?? "hotel";
  const companyLabel = companyLabelByType[resolvedCompanyType] ?? "Company";
  const companyUnit = companyUnitByType[resolvedCompanyType] ?? "listing";
  const latestTable =
    latestTablesByType[resolvedCompanyType] ?? latestTablesByType.hotel;

  return {
    resolvedCompanyType,
    companyLabel,
    companyUnit,
    latestTable,
  };
};
