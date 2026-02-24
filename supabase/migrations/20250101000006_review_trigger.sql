-- Триггер пересчёта рейтинга после добавления/изменения/удаления отзыва
CREATE OR REPLACE FUNCTION recalc_rating() RETURNS TRIGGER AS $$
DECLARE
  _type  TEXT;
  _id    UUID;
  _table TEXT;
  _avg   NUMERIC;
  _count INT;
BEGIN
  _type := COALESCE(NEW.reviewable_type, OLD.reviewable_type);
  _id   := COALESCE(NEW.reviewable_id,   OLD.reviewable_id);

  _table := CASE _type
    WHEN 'route'     THEN 'routes'
    WHEN 'guide'     THEN 'guides'
    WHEN 'equipment' THEN 'equipment'
    WHEN 'transfer'  THEN 'transfers'
    WHEN 'housing'   THEN 'housing'
    ELSE NULL
  END;

  IF _table IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(AVG(rating), 0), COUNT(*)
    INTO _avg, _count
    FROM reviews
   WHERE reviewable_type = _type
     AND reviewable_id   = _id;

  EXECUTE format(
    'UPDATE %I SET rating = %L, review_count = %L WHERE id = %L',
    _table, ROUND(_avg, 2), _count, _id
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_recalc_rating ON reviews;

CREATE TRIGGER trg_recalc_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalc_rating();
