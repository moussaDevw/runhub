export interface FilterOption<T = string> {
  id: T;
  labelKey?: string;
  label?: string;
}

export const SPORT_FILTER_OPTIONS: readonly string[] = [
  'Running',
  'Foot',
  'Yoga',
  'Basket',
  'Cyclisme',
  'Fitness',
] as const;

export const WHEN_FILTER_KEYS = [
  { id: 'all', labelKey: 'filter.all' },
  { id: 'today', labelKey: 'filter.today' },
  { id: 'week', labelKey: 'filter.week' },
  { id: 'weekend', labelKey: 'filter.weekend' },
  { id: 'month', labelKey: 'filter.month' },
] as const;

export const PRICE_FILTER_KEYS = [
  { id: 'all', labelKey: 'filter.all' },
  { id: 'free', labelKey: 'filter.free' },
  { id: 'paid', labelKey: 'filter.paid' },
] as const;
