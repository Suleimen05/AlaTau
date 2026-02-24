-- ============================================================
-- AlaTau — Привязка услуг к маршрутам
-- Каждый гид/трансфер/жильё получает список route_ids_json
-- ============================================================

-- -----------------------------------------------
-- Гиды → маршруты
-- -----------------------------------------------
-- Айгерим: лёгкие и средние маршруты
UPDATE guides
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes
  WHERE title IN ('Пик Фурманова','Большое Алматинское озеро','Кольсайские озера','Ущелье Чарын')
)
WHERE title = 'Айгерим Турсын';

-- Нурлан: сложные + средние
UPDATE guides
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes
  WHERE title IN ('Пик Талгар','Пик Фурманова')
)
WHERE title = 'Нурлан Серкебаев';

-- Дана: лёгкие / эко
UPDATE guides
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes
  WHERE title IN ('Большое Алматинское озеро','Ущелье Чарын','Кольсайские озера')
)
WHERE title = 'Дана Оспанова';

-- Ерлан: сложные + средние (скальный туризм)
UPDATE guides
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes
  WHERE title IN ('Пик Талгар','Пик Фурманова')
)
WHERE title = 'Ерлан Жумабаев';

-- -----------------------------------------------
-- Трансферы → маршруты (1 трансфер = 1 маршрут)
-- -----------------------------------------------
UPDATE transfers
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Большое Алматинское озеро'
)
WHERE to_location ILIKE '%Алматинское%';

UPDATE transfers
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Пик Фурманова'
)
WHERE to_location ILIKE '%Фурманова%';

UPDATE transfers
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Ущелье Чарын'
)
WHERE to_location ILIKE '%Чарын%';

UPDATE transfers
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Кольсайские озера'
)
WHERE to_location ILIKE '%Кольсай%';

UPDATE transfers
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Пик Талгар'
)
WHERE to_location ILIKE '%Талгар%';

-- -----------------------------------------------
-- Жильё → маршруты
-- -----------------------------------------------
UPDATE housing
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Большое Алматинское озеро'
)
WHERE title ILIKE '%Алматинского%';

UPDATE housing
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Ущелье Чарын'
)
WHERE title ILIKE '%Чарын%';

UPDATE housing
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Пик Фурманова'
)
WHERE title ILIKE '%Фурманова%';

UPDATE housing
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes WHERE title = 'Кольсайские озера'
)
WHERE title ILIKE '%Кольсай%';

-- Глэмпинг — доступен для всех маршрутов
UPDATE housing
SET route_ids_json = (
  SELECT COALESCE(jsonb_agg(id), '[]'::jsonb)
  FROM routes
)
WHERE title ILIKE '%Глэмпинг%';
