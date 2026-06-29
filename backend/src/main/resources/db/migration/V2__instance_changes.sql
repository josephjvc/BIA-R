ALTER TABLE instances ALTER COLUMN organization_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_participants_user ON instance_participants(user_id);

ALTER TABLE organizations ADD CONSTRAINT uq_org_name UNIQUE (name);
