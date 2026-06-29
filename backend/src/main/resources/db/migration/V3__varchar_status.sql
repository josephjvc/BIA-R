ALTER TABLE instances ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
ALTER TABLE instances ALTER COLUMN status DROP DEFAULT;
ALTER TABLE instances ALTER COLUMN status SET DEFAULT 'IN_PROGRESS';

ALTER TABLE instance_status_history ALTER COLUMN from_status TYPE VARCHAR(50) USING from_status::text;
ALTER TABLE instance_status_history ALTER COLUMN to_status TYPE VARCHAR(50) USING to_status::text;

DROP TYPE IF EXISTS instance_status;
