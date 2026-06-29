ALTER TABLE reports ALTER COLUMN type TYPE VARCHAR(50) USING type::text;
ALTER TABLE risks ALTER COLUMN risk_level TYPE VARCHAR(20) USING risk_level::text;
DROP TYPE IF EXISTS report_type;
DROP TYPE IF EXISTS risk_level;
