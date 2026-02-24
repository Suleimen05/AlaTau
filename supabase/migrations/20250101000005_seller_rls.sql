-- ============================================================
-- AlaTau — Дополнительные RLS-политики для продавцов
-- Продавец видит и обновляет trip_items, назначенные ему
-- ============================================================

-- Продавец может видеть trip_items где он seller_id
CREATE POLICY "trip_items_seller_select" ON trip_items FOR SELECT
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Продавец может обновлять статус своих trip_items
CREATE POLICY "trip_items_seller_update" ON trip_items FOR UPDATE
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));

-- Продавец может видеть поездки, в которых есть его услуги
CREATE POLICY "trips_seller_view" ON trips FOR SELECT
  USING (id IN (SELECT trip_id FROM trip_items WHERE seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())));

-- Продавец может видеть бронирования, назначенные ему
CREATE POLICY "bookings_seller_view" ON bookings FOR SELECT
  USING (seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid()));
