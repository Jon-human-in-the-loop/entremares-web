-- ============================================================
-- ENTREMARES — Supabase Schema
-- Paste this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  price         INTEGER NOT NULL, -- in EUR cents
  pieces        INTEGER NOT NULL,
  weight        TEXT NOT NULL DEFAULT '',
  ingredients   TEXT NOT NULL DEFAULT '',
  available     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  badge         TEXT, -- 'mostPopular' | 'limitedEdition' | NULL
  image_url     TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT TRANSLATIONS (ES / EN / PT)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_translations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale           TEXT NOT NULL CHECK (locale IN ('es', 'en', 'pt')),
  name             TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  UNIQUE(product_id, locale)
);

-- ============================================================
-- PRODUCT FLAVORS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_flavors (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_key   TEXT NOT NULL,  -- 'dulce-leche' | 'chocolate' etc.
  is_signature BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  TEXT PRIMARY KEY, -- EM-XXXXXX format
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  shipping_address    JSONB NOT NULL,   -- { address, city, postalCode }
  items               JSONB NOT NULL,   -- [{ packId, name, price, quantity }]
  total               INTEGER NOT NULL, -- in EUR cents
  payment_method      TEXT NOT NULL DEFAULT 'mbway', -- 'mbway' | 'multibanco'
  payment_status      TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'cancelled'
  payment_reference   TEXT,             -- Multibanco ref or MB WAY transaction ID
  payment_entity      TEXT,             -- Multibanco entity number
  payment_expires_at  TIMESTAMPTZ,      -- when payment reference expires
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin', -- 'admin' | 'editor'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Products are public read, admin write
-- Orders are admin only
-- ============================================================
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_flavors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users           ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "translations_public_read"
  ON product_translations FOR SELECT USING (TRUE);

CREATE POLICY "flavors_public_read"
  ON product_flavors FOR SELECT USING (TRUE);

-- Only admins can write products
CREATE POLICY "products_admin_write"
  ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "translations_admin_write"
  ON product_translations FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "flavors_admin_write"
  ON product_flavors FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Only admins can access orders
CREATE POLICY "orders_admin_only"
  ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Admin users table
CREATE POLICY "admin_users_self"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

-- ============================================================
-- STORAGE BUCKET for product images
-- Run this separately in: Storage → New Bucket
-- Name: product-images | Public: true
-- ============================================================

-- ============================================================
-- SEED DATA — Initial products
-- Run AFTER creating the schema
-- ============================================================
INSERT INTO products (id, slug, price, pieces, weight, ingredients, available, is_featured, badge, image_url, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'classic-6',      1890, 6,  '180g', 'Farinha de trigo, manteiga, dulce de leche, chocolate de cobertura.',                           TRUE, TRUE, NULL,            '/images/packs/classic-6.jpg',      1),
  ('a0000000-0000-0000-0000-000000000002', 'premium-12',     3290, 12, '360g', 'Farinha de trigo, manteiga, dulce de leche, chocolate de cobertura, framboesa.',              TRUE, TRUE, 'mostPopular',   '/images/packs/premium-12.jpg',     2),
  ('a0000000-0000-0000-0000-000000000003', 'special-edition',4490, 12, '360g', 'Farinha de trigo, manteiga, dulce de leche, chocolate belga, pistácio, flor de sal.',        TRUE, TRUE, 'limitedEdition','/images/packs/special-edition.jpg', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_translations (product_id, locale, name, description, long_description) VALUES
  -- Classic ES
  ('a0000000-0000-0000-0000-000000000001','es','Pack Clásico','La introducción perfecta a nuestros clásicos.','El Pack Clásico es una perfecta introducción a los alfajores Entremares. Cada pieza está hecha a mano con ingredientes premium y técnicas tradicionales, reflejando siglos de herencia artesanal.'),
  ('a0000000-0000-0000-0000-000000000001','en','Classic Pack','The perfect introduction to our classics.','The Classic Pack is a perfect introduction to Entremares alfajores. Each piece is handmade with premium ingredients and traditional techniques.'),
  ('a0000000-0000-0000-0000-000000000001','pt','Pack Clássico','A introdução perfeita aos nossos clássicos.','O Pack Clássico é uma introdução perfeita aos alfajores Entremares. Cada peça é feita à mão com ingredientes premium.'),
  -- Premium ES
  ('a0000000-0000-0000-0000-000000000002','es','Pack Premium','Nuestra selección más completa. Una experiencia handcrafted de excelencia.','El Pack Premium es nuestro más vendido, ofreciendo una impresionante variedad de sabores premium. Con 12 piezas cuidadosamente seleccionadas.'),
  ('a0000000-0000-0000-0000-000000000002','en','Entremares Premium Pack','Our most complete selection. A handcrafted experience of excellence.','For the true connoisseur, the Premium Pack delivers our finest selection. Perfect for special occasions or as a distinguished corporate gift.'),
  ('a0000000-0000-0000-0000-000000000002','pt','Pack Premium','A nossa seleção mais completa. Uma experiência handcrafted de excelência.','O Pack Premium é o nosso bestseller, oferecendo uma variedade impressionante de sabores premium.'),
  -- Special ES
  ('a0000000-0000-0000-0000-000000000003','es','Edición Especial','Sabores de edición limitada en embalaje premium para ocasiones especiales.','La Edición Especial es la cima del arte de hacer alfajores. Con ingredientes raros y sabores innovadores, cada pieza es una obra maestra.'),
  ('a0000000-0000-0000-0000-000000000003','en','Special Edition','Limited edition flavors in premium packaging for special occasions.','The Special Edition is the pinnacle of alfajor craftsmanship. With rare ingredients and innovative flavors, each piece is a masterpiece.'),
  ('a0000000-0000-0000-0000-000000000003','pt','Edição Especial','Sabores de edição limitada em embalagem premium para ocasiões especiais.','A Edição Especial é o auge da arte de fazer alfajores. Com ingredientes raros e sabores inovadores, cada peça é uma obra-prima.')
ON CONFLICT (product_id, locale) DO NOTHING;

INSERT INTO product_flavors (product_id, flavor_key, is_signature, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001','dulce-leche', TRUE,  1),
  ('a0000000-0000-0000-0000-000000000001','chocolate',   FALSE, 2),
  ('a0000000-0000-0000-0000-000000000001','limon',       FALSE, 3),
  ('a0000000-0000-0000-0000-000000000002','dulce-leche', TRUE,  1),
  ('a0000000-0000-0000-0000-000000000002','chocolate',   FALSE, 2),
  ('a0000000-0000-0000-0000-000000000002','framboesa',   FALSE, 3),
  ('a0000000-0000-0000-0000-000000000002','cafe',        FALSE, 4),
  ('a0000000-0000-0000-0000-000000000002','limon',       FALSE, 5),
  ('a0000000-0000-0000-0000-000000000003','pistacio',    TRUE,  1),
  ('a0000000-0000-0000-0000-000000000003','flor-sal',    FALSE, 2),
  ('a0000000-0000-0000-0000-000000000003','trufa',       FALSE, 3)
ON CONFLICT DO NOTHING;
