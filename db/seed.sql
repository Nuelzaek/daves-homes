-- Optional starter data — the 5 sample listings from the original design.
-- Safe to skip if you'd rather add real listings from the admin dashboard.
insert into public.listings (slug, title, neighbourhood, type, price_per_year, beds, baths, size_sqm, description, images, featured, available) values
('woji-terrace', 'Sunlit 2-Bed Terrace', 'Woji', 'Terrace', 2400000, 2, 2, 95,
 'A bright, low-maintenance terrace house tucked into a quiet close off the Woji waterline. Both bedrooms face east and catch the morning light, the living room opens onto a small paved yard, and the kitchen has been redone with granite counters. Ten minutes to Genesis Centre, gated compound with 24-hour security.',
 array['https://images.pexels.com/photos/32115995/pexels-photo-32115995.jpeg?auto=compress&cs=tinysrgb&w=1400','https://images.pexels.com/photos/6970077/pexels-photo-6970077.jpeg?auto=compress&cs=tinysrgb&w=1400','https://images.pexels.com/photos/8135502/pexels-photo-8135502.jpeg?auto=compress&cs=tinysrgb&w=1400','https://images.pexels.com/photos/10827396/pexels-photo-10827396.jpeg?auto=compress&cs=tinysrgb&w=1400'],
 true, true)
on conflict (slug) do nothing;
