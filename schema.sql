-- Create site settings table
CREATE TABLE site_settings (
  id INT PRIMARY KEY,
  site_name TEXT,
  primary_color TEXT,
  logo_url TEXT,
  ad_enabled BOOLEAN DEFAULT false,
  ad_text TEXT,
  ad_link TEXT
);

-- Insert default row
INSERT INTO site_settings (id, site_name, primary_color, ad_enabled) 
VALUES (1, 'منصة تحفيظ القرآن للأطفال', '#00C9A7', false);

-- Set up Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Public profiles are viewable by everyone." 
ON site_settings FOR SELECT USING (true);

-- Allow authenticated users (Admin) to update settings
CREATE POLICY "Users can update own settings." 
ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert settings." 
ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
