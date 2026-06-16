CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ──────────────────────────────────────────────
CREATE TYPE instance_status AS ENUM (
    'in_progress', 'completed', 'reviewed', 'approved',
    'disapproved', 'finished', 'archived'
);

CREATE TYPE risk_level AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');

CREATE TYPE report_type AS ENUM (
    'instance_summary', 'instance_history', 'bia', 'risk', 'executive_resilience'
);

-- ── Core tables ────────────────────────────────────────
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),
    display_name    VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(512),
    organization_id UUID REFERENCES organizations(id),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE instances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    version         VARCHAR(50)  NOT NULL DEFAULT '1.0',
    status          instance_status NOT NULL DEFAULT 'in_progress',
    period_start    DATE,
    period_end      DATE,
    created_by      UUID         NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_instances_organization ON instances(organization_id);
CREATE INDEX idx_instances_status ON instances(status);

CREATE TABLE instance_participants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id),
    role        VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (instance_id, user_id)
);
CREATE INDEX idx_instance_participants_instance ON instance_participants(instance_id);

CREATE TABLE instance_status_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID           NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    from_status instance_status,
    to_status   instance_status NOT NULL,
    changed_by  UUID           NOT NULL REFERENCES users(id),
    reason      TEXT,
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);
CREATE INDEX idx_status_history_instance ON instance_status_history(instance_id);

CREATE TABLE instance_activity_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID         NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    user_id     UUID         NOT NULL REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    details     JSONB,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_logs_instance ON instance_activity_logs(instance_id);
CREATE INDEX idx_activity_logs_created ON instance_activity_logs(created_at DESC);

CREATE TABLE instance_comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID         NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    user_id     UUID         NOT NULL REFERENCES users(id),
    content     TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_instance ON instance_comments(instance_id);

-- ── Business process tables ────────────────────────────
CREATE TABLE business_processes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id         UUID         NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    business_unit       VARCHAR(255),
    owner               VARCHAR(255),
    description         TEXT,
    key_objectives      TEXT,
    country             VARCHAR(100),
    region              VARCHAR(100),
    sites               TEXT,
    employees_count     INTEGER,
    bia_periodicity     VARCHAR(50),
    critical_time_period VARCHAR(50),
    criticality         VARCHAR(50),
    status              VARCHAR(50)  NOT NULL DEFAULT 'active',
    notes               TEXT,
    sort_order          INTEGER      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_processes_instance ON business_processes(instance_id);

CREATE TABLE process_activities (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id           UUID        NOT NULL REFERENCES business_processes(id) ON DELETE CASCADE,
    name                 VARCHAR(255) NOT NULL,
    critical_time_period VARCHAR(50),
    notes                TEXT,
    sort_order           INTEGER     NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activities_process ON process_activities(process_id);

-- ── BIA assessments ────────────────────────────────────
CREATE TABLE bia_assessments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id      UUID NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    process_id       UUID NOT NULL REFERENCES business_processes(id) ON DELETE CASCADE,
    mtpd             INTEGER,
    rto              INTEGER,
    rpo              INTEGER,
    impact_score     NUMERIC(5,2),
    criticality      VARCHAR(50),
    impact_categories JSONB,
    notes            TEXT,
    assessed_by      UUID REFERENCES users(id),
    assessed_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (instance_id, process_id)
);
CREATE INDEX idx_bia_instance ON bia_assessments(instance_id);
CREATE INDEX idx_bia_process ON bia_assessments(process_id);

-- ── Risks ──────────────────────────────────────────────
CREATE TABLE risks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id     UUID         NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    process_id      UUID         REFERENCES business_processes(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    probability     INTEGER      CHECK (probability BETWEEN 1 AND 5),
    impact          INTEGER      CHECK (impact BETWEEN 1 AND 5),
    risk_level      risk_level,
    treatment       VARCHAR(50),
    action_plan     TEXT,
    owner           VARCHAR(255),
    status          VARCHAR(50)  NOT NULL DEFAULT 'identified',
    notes           TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_risks_instance ON risks(instance_id);
CREATE INDEX idx_risks_process ON risks(process_id);
CREATE INDEX idx_risks_level ON risks(risk_level);

-- ── Reports ────────────────────────────────────────────
CREATE TABLE reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID        NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    type        report_type NOT NULL,
    title       VARCHAR(255) NOT NULL,
    snapshot    JSONB,
    generated_by UUID       NOT NULL REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reports_instance ON reports(instance_id);
CREATE INDEX idx_reports_type ON reports(type);

CREATE TABLE instance_exports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID         NOT NULL REFERENCES instances(id) ON DELETE CASCADE,
    type        VARCHAR(50)  NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_size   BIGINT,
    exported_by UUID         NOT NULL REFERENCES users(id),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_exports_instance ON instance_exports(instance_id);
