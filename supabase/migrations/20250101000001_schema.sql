-- ============================================================
-- AlaTau — Полная схема БД
-- Запусти этот файл в Supabase Dashboard → SQL Editor
-- ============================================================

-- -----------------------------------------------
-- SEQUENCE для номеров бронирования
-- -----------------------------------------------
CREATE SEQUENCE IF NOT EXISTS booking_ref_seq START 1;

-- -----------------------------------------------
-- 1. ПОЛЬЗОВАТЕЛИ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id       BIGINT UNIQUE NOT NULL,
  username          TEXT,
  first_name        TEXT,
  last_name         TEXT,
  phone             TEXT,
  avatar_url        TEXT,
  is_seller         BOOLEAN DEFAULT false,
  level             INTEGER DEFAULT 1,
  level_name        TEXT DEFAULT 'Новичок',
  level_progress    INTEGER DEFAULT 0,
  total_eco_points  INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 2. ПРОФИЛИ ПРОДАВЦОВ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS seller_profiles (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_type       TEXT CHECK (seller_type IN ('guide', 'equipment', 'transfer', 'housing')),
  bio               TEXT,
  is_verified       BOOLEAN DEFAULT false,
  documents_json    JSONB DEFAULT '[]',
  bank_details_json JSONB DEFAULT '{}',
  rating            DECIMAL(3,2) DEFAULT 0,
  total_reviews     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 3. МАРШРУТЫ (контент от администратора)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  difficulty    TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_min  INTEGER,
  duration_max  INTEGER,
  distance_km   DECIMAL(5,1),
  elevation_m   INTEGER,
  region        TEXT,
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  images_json   JSONB DEFAULT '[]',
  rating        DECIMAL(3,2) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 4. ГИДЫ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS guides (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id        UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  specialization   TEXT,
  languages_json   JSONB DEFAULT '[]',
  experience_years INTEGER DEFAULT 0,
  price_per_person INTEGER NOT NULL,
  min_group        INTEGER DEFAULT 1,
  max_group        INTEGER DEFAULT 10,
  duration_hours   INTEGER,
  route_ids_json   JSONB DEFAULT '[]',
  avatar_url       TEXT,
  rating           DECIMAL(3,2) DEFAULT 0,
  review_count     INTEGER DEFAULT 0,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 5. СНАРЯЖЕНИЕ (аренда)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS equipment (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id           UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  category            TEXT,
  price_per_day       INTEGER NOT NULL,
  quantity_total      INTEGER DEFAULT 1,
  quantity_available  INTEGER DEFAULT 1,
  images_json         JSONB DEFAULT '[]',
  rating              DECIMAL(3,2) DEFAULT 0,
  review_count        INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 6. ТРАНСФЕРЫ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS transfers (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id         UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  from_location     TEXT NOT NULL,
  to_location       TEXT NOT NULL,
  price_per_vehicle INTEGER NOT NULL,
  vehicle_type      TEXT,
  capacity_persons  INTEGER DEFAULT 4,
  duration_minutes  INTEGER,
  route_ids_json    JSONB DEFAULT '[]',
  rating            DECIMAL(3,2) DEFAULT 0,
  review_count      INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 7. ЖИЛЬЁ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS housing (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id     UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  type          TEXT,
  location      TEXT,
  price_per_night INTEGER NOT NULL,
  max_guests    INTEGER DEFAULT 2,
  amenities_json JSONB DEFAULT '[]',
  images_json   JSONB DEFAULT '[]',
  route_ids_json JSONB DEFAULT '[]',
  rating        DECIMAL(3,2) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 8. ПОЕЗДКИ (конструктор — "корзина")
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  route_id       UUID REFERENCES routes(id),
  title          TEXT,
  date_start     DATE,
  date_end       DATE,
  persons_count  INTEGER DEFAULT 1,
  status         TEXT DEFAULT 'draft'
                 CHECK (status IN ('draft','pending','confirmed','in_progress','completed','cancelled')),
  total_price    INTEGER DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 9. ЭЛЕМЕНТЫ ПОЕЗДКИ (каждая услуга)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS trip_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id      UUID REFERENCES trips(id) ON DELETE CASCADE,
  service_type TEXT CHECK (service_type IN ('guide','equipment','transfer','housing')),
  service_id   UUID NOT NULL,
  seller_id    UUID REFERENCES seller_profiles(id),
  quantity     INTEGER DEFAULT 1,
  unit_price   INTEGER NOT NULL,
  total_price  INTEGER NOT NULL,
  date_start   DATE,
  date_end     DATE,
  status       TEXT DEFAULT 'pending'
               CHECK (status IN ('pending','confirmed','rejected','cancelled')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 10. БРОНИРОВАНИЯ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_item_id   UUID REFERENCES trip_items(id),
  seller_id      UUID REFERENCES seller_profiles(id),
  user_id        UUID REFERENCES users(id),
  booking_ref    TEXT UNIQUE DEFAULT (
                   'ALT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                   LPAD(NEXTVAL('booking_ref_seq')::TEXT, 5, '0')
                 ),
  status         TEXT DEFAULT 'pending'
                 CHECK (status IN ('pending','confirmed','rejected','cancelled','completed')),
  confirmed_at   TIMESTAMPTZ,
  cancelled_at   TIMESTAMPTZ,
  cancel_reason  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 11. ПЛАТЕЖИ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id      UUID REFERENCES trips(id),
  user_id      UUID REFERENCES users(id),
  amount       INTEGER NOT NULL,
  currency     TEXT DEFAULT 'KZT',
  method       TEXT DEFAULT 'mock'
               CHECK (method IN ('mock','kaspi','telegram_pay','card')),
  external_ref TEXT,
  status       TEXT DEFAULT 'pending'
               CHECK (status IN ('pending','paid','failed','refunded')),
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 12. ОТЗЫВЫ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES users(id),
  trip_id          UUID REFERENCES trips(id),
  reviewable_type  TEXT CHECK (reviewable_type IN ('route','guide','equipment','transfer','housing')),
  reviewable_id    UUID NOT NULL,
  rating           INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT,
  images_json      JSONB DEFAULT '[]',
  is_verified      BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 13. ЭКО-ЧЕЛЛЕНДЖИ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT CHECK (category IN ('ecology','achievement','community')),
  points           INTEGER DEFAULT 0,
  icon             TEXT,
  condition_type   TEXT,
  condition_value  INTEGER DEFAULT 1,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_challenges (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  progress     INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, challenge_id)
);

-- -----------------------------------------------
-- 14. ДОСТИЖЕНИЯ (бейджи)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  category        TEXT,
  condition_type  TEXT,
  condition_value INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- -----------------------------------------------
-- 15. КАЛЕНДАРЬ ДОСТУПНОСТИ ПРОДАВЦА
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS seller_availability (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id     UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  service_type  TEXT,
  service_id    UUID,
  date          DATE NOT NULL,
  is_available  BOOLEAN DEFAULT true,
  slots_total   INTEGER DEFAULT 1,
  slots_booked  INTEGER DEFAULT 0,
  UNIQUE (seller_id, service_id, date)
);

-- -----------------------------------------------
-- 16. УВЕДОМЛЕНИЯ
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT,
  title      TEXT,
  message    TEXT,
  is_read    BOOLEAN DEFAULT false,
  data_json  JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (маршруты, услуги, достижения, отзывы)
CREATE POLICY "public_routes"        ON routes        FOR SELECT USING (is_active = true);
CREATE POLICY "public_guides"        ON guides        FOR SELECT USING (is_active = true);
CREATE POLICY "public_equipment"     ON equipment     FOR SELECT USING (is_active = true);
CREATE POLICY "public_transfers"     ON transfers     FOR SELECT USING (is_active = true);
CREATE POLICY "public_housing"       ON housing       FOR SELECT USING (is_active = true);
CREATE POLICY "public_challenges"    ON challenges    FOR SELECT USING (is_active = true);
CREATE POLICY "public_achievements"  ON achievements  FOR SELECT USING (true);
CREATE POLICY "public_reviews"       ON reviews       FOR SELECT USING (true);
CREATE POLICY "public_users_view"    ON users         FOR SELECT USING (true);
CREATE POLICY "public_sellers_view"  ON seller_profiles FOR SELECT USING (true);
CREATE POLICY "public_availability"  ON seller_availability FOR SELECT USING (true);

-- Пользователь видит/редактирует только своё
CREATE POLICY "users_update_own"     ON users  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own"     ON users  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "trips_select_own"     ON trips  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert_own"     ON trips  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update_own"     ON trips  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trips_delete_own"     ON trips  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "trip_items_select"    ON trip_items FOR SELECT
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "trip_items_insert"    ON trip_items FOR INSERT
  WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "trip_items_update"    ON trip_items FOR UPDATE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));
CREATE POLICY "trip_items_delete"    ON trip_items FOR DELETE
  USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "payments_own"         ON payments         FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert"      ON payments         FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_own"         ON bookings         FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_own"    ON notifications    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_challenges_own"  ON user_challenges  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_challenges_upsert" ON user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_challenges_upd"  ON user_challenges  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_ach_own"         ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_ach_insert"      ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Продавец управляет своим профилем
CREATE POLICY "seller_own"           ON seller_profiles FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "seller_insert"        ON seller_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "seller_avail_manage"  ON seller_availability FOR ALL
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Продавец управляет своими услугами
CREATE POLICY "guides_seller_manage" ON guides FOR ALL
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "equip_seller_manage"  ON equipment FOR ALL
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "transfer_seller_mgmt" ON transfers FOR ALL
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
CREATE POLICY "housing_seller_mgmt"  ON housing FOR ALL
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Отзывы — пишет только кто реально забронировал
CREATE POLICY "reviews_insert"       ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid() AND status = 'completed')
  );
CREATE POLICY "reviews_update_own"   ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (seed)
-- ============================================================

-- Маршруты
INSERT INTO routes (title, description, difficulty, duration_min, duration_max, distance_km, elevation_m, region, images_json, rating, review_count) VALUES
('Пик Фурманова',            'Классический маршрут с потрясающими видами на Большое Алматинское озеро', 'medium', 6,  8,  14, 3050, 'Алматы',             '["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"]', 4.8, 124),
('Большое Алматинское озеро','Живописное высокогорное озеро в окружении величественных пиков',          'easy',   4,  5,  10, 2500, 'Алматы',             '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"]', 4.9, 210),
('Пик Талгар',               'Самая высокая точка Заилийского Алатау для опытных альпинистов',          'hard',   48, 72, 25, 4973, 'Алматинская область','["https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80"]', 4.7,  67),
('Ущелье Чарын',             'Мини-Гранд-Каньон Казахстана с уникальными скальными образованиями',     'easy',   3,  4,  5,  1200, 'Алматинская область','["https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80"]', 4.6, 189),
('Кольсайские озера',        'Три живописных горных озера в сосновом лесу',                             'easy',   5,  6,  12, 1800, 'Алматинская область','["https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"]', 4.8, 145);

-- Эко-челленджи
INSERT INTO challenges (title, description, category, points, icon, condition_type, condition_value) VALUES
('Собери мусор на маршруте', 'Возьми с собой мешок и собери 1 кг мусора во время похода',       'ecology',     10, 'trash',    'trash_kg',       1),
('Первое восхождение',       'Заверши свой первый маршрут с гидом через приложение',             'achievement', 15, 'mountain', 'route_count',    1),
('Фотограф природы',         'Поделись 5 фотографиями с маршрута в нашем сообществе',            'community',    5, 'camera',   'photos_count',   5),
('Эко-транспорт',            'Используй общий трансфер вместо личного автомобиля',               'ecology',      8, 'bus',      'shared_transfer',1),
('Мастер походов',           'Заверши 5 разных маршрутов через приложение',                      'achievement', 25, 'star',     'route_count',    5);

-- Достижения
INSERT INTO achievements (title, description, icon, category, condition_type, condition_value) VALUES
('Первое восхождение!', 'Завершён первый маршрут',        'mountain', 'achievement', 'route_count',   1),
('Эко-герой',           'Собрано 5 кг мусора',            'leaf',     'ecology',     'trash_kg',      5),
('Фотограф',            '10 фото в сообществе',           'camera',   'community',   'photos_count', 10),
('Исследователь',       'Посещено 3 разных региона',      'map',      'achievement', 'region_count',  3),
('Покоритель вершин',   'Завершено 10 маршрутов',         'trophy',   'achievement', 'route_count',  10);
