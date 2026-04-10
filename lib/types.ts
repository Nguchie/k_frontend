export type ImageAsset = {
  id: number;
  title: string;
  image: string;
  alt_text_en: string;
  caption_en?: string;
  location?: string;
};

export type TourDateOption = {
  label: string;
  start_date: string;
  end_date: string;
  price_usd: number;
  availability?: string;
  date_key?: string;
  meals?: string[];
  stay_summary?: string;
  stays?: StayOption[];
  documents_needed?: string[];
};

export type ItinerarySummary = {
  breakfasts?: number;
  lunches?: number;
  dinners?: number;
  nights?: number;
  accommodation_nights?: number;
};

export type StayOption = {
  name: string;
  location: string;
  nights?: number;
  description?: string;
  link?: string;
};

export type ItineraryMoment = {
  title: string;
  body?: string;
};

export type ItineraryDay = {
  title: string;
  location?: string;
  stay?: string;
  meals?: string[];
  breakfast?: ItineraryMoment[];
  morning?: ItineraryMoment[];
  lunch?: ItineraryMoment[];
  afternoon?: ItineraryMoment[];
  evening?: ItineraryMoment[];
  body?: string;
};

export type TravelInformation = {
  documents_needed?: string[];
  booking_support?: string;
  available_dates_note?: string;
};

export type LodgingAndMeals = {
  meal_options?: string[];
  stays?: StayOption[];
};

export type Country = {
  id: number;
  name: string;
  code: string;
  slug: string;
  intro_en?: string;
  seo_title_en?: string;
  meta_description_en?: string;
  canonical_url?: string;
};

export type GuideCategory = {
  id: number;
  name: string;
  slug: string;
  guide_count: number;
};

export type HomepageHeroSlide = {
  id: number;
  eyebrow_en?: string;
  title_en: string;
  subtitle_en: string;
  image?: ImageAsset | string | null;
  position: number;
};

export type Destination = {
  id: number;
  country: Country;
  name_en: string;
  slug: string;
  summary_en: string;
  wildlife_en?: string;
  best_time_en?: string;
  travel_tips_en?: string;
  safari_styles?: string[];
  gallery?: ImageAsset[];
  map_embed_url?: string;
  tours?: Tour[];
  guides?: Guide[];
  reviews?: Review[];
  faqs?: FAQ[];
  seo_title_en?: string;
  meta_description_en?: string;
  canonical_url?: string;
};

export type Tour = {
  id: number;
  destination: Destination;
  destinations?: Destination[];
  title_en: string;
  slug: string;
  summary_en: string;
  overview_en?: string;
  duration_days: number;
  from_price_usd: number;
  budget_level: string;
  safari_type: string;
  urgency_message_en?: string;
  highlights_en?: string[];
  special_offers_en?: Array<{ title: string; body: string }>;
  available_dates?: TourDateOption[];
  itinerary_en?: ItineraryDay[];
  itinerary_summary_en?: ItinerarySummary;
  included_en?: string[];
  excluded_en?: string[];
  accommodation_en?: string;
  lodging_and_meals_en?: LodgingAndMeals;
  travel_information_en?: TravelInformation;
  hero_video_url?: string;
  pricing_note_en?: string;
  gallery?: ImageAsset[];
  guides?: Guide[];
  reviews?: Review[];
  faqs?: FAQ[];
  seo_title_en?: string;
  meta_description_en?: string;
  canonical_url?: string;
};

export type Guide = {
  id: number;
  category?: GuideCategory | null;
  title_en: string;
  slug: string;
  excerpt_en: string;
  body_en?: string;
  reading_time_minutes: number;
  hero_image?: ImageAsset | null;
  country?: Country | null;
  destinations?: Destination[];
  tours?: Tour[];
  seo_title_en?: string;
  meta_description_en?: string;
  canonical_url?: string;
};

export type Review = {
  id: number;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_country?: string;
  source: string;
  rating: number;
  title?: string;
  content: string;
  travel_date?: string;
  trip_type?: string;
  featured?: boolean;
  destination_name?: string;
  destination_slug?: string;
  destination_country_slug?: string;
};

export type FAQ = {
  question_en: string;
  answer_en: string;
};

export type HomepageFAQ = {
  question_en: string;
  tour_slug: string;
  tour_title: string;
  country_slug: string;
};

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  inquiry_type?: "quote" | "notify" | "custom";
  subject?: string;
  travel_dates?: string;
  preferred_tour_date?: string;
  group_size?: number;
  destination?: number | string;
  tour?: number | string;
  budget_level?: string;
  travel_month?: string;
  source_page?: string;
  source_locale?: string;
  message?: string;
};

export type BookingDateOption = {
  value: string;
  label: string;
};
