-- Схема из спецификации «Заготовки».
-- КБЖУ продукта задаётся на 100 г (для мл принимаем 1 мл = 1 г, для шт используется piece_weight_g).

CREATE TABLE products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL UNIQUE,
  unit            TEXT    NOT NULL CHECK (unit IN ('g', 'ml', 'pcs')),
  kcal            REAL    NOT NULL DEFAULT 0,
  protein         REAL    NOT NULL DEFAULT 0,
  fat             REAL    NOT NULL DEFAULT 0,
  carbs           REAL    NOT NULL DEFAULT 0,
  piece_weight_g  REAL,
  category        TEXT    NOT NULL DEFAULT 'Другое',
  -- Необязательная привязка к конкретному товару на edostavka.by.
  edostavka_url   TEXT,
  edostavka_id    INTEGER,
  pack_size       REAL
);

CREATE TABLE recipes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  steps       TEXT    NOT NULL DEFAULT '',
  note        TEXT    NOT NULL DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Ингредиенты на одну порцию.
CREATE TABLE recipe_items (
  recipe_id   INTEGER NOT NULL REFERENCES recipes(id)  ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  amount      REAL    NOT NULL CHECK (amount > 0),
  PRIMARY KEY (recipe_id, product_id)
);

-- Текущий план готовки: одна строка на блюдо, только текущая неделя.
CREATE TABLE plan_items (
  recipe_id  INTEGER PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  portions   INTEGER NOT NULL CHECK (portions > 0)
);

-- Партии в морозилке. Название блюда копируется, чтобы партия пережила удаление рецепта.
CREATE TABLE freezer_batches (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id      INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
  recipe_name    TEXT    NOT NULL,
  portions_made  INTEGER NOT NULL CHECK (portions_made > 0),
  portions_left  INTEGER NOT NULL CHECK (portions_left >= 0),
  cooked_on      TEXT    NOT NULL,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_freezer_batches_cooked_on ON freezer_batches (cooked_on);
