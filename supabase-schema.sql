-- FVMA Disaster Response Platform - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- ORGANIZATIONS (FVMA, regional associations)
-- ============================================
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  org_type text check (org_type in ('state_association', 'regional_association', 'practice')),
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  website text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- MEMBERS (Veterinary clinics and staff)
-- ============================================
create table members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  full_name text not null,
  role text check (role in ('owner', 'veterinarian', 'vet_tech', 'practice_manager', 'staff')),
  email text,
  phone text not null,
  specialty text, -- 'small_animal', 'mixed', 'large_animal', 'exotic', 'emergency', etc.
  is_24_7 boolean default false,
  vet_count integer default 1,
  address_line1 text,
  address_line2 text,
  city text,
  county text, -- Important for geographic filtering
  state text default 'FL',
  postal_code text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  ce_opt_in boolean default false, -- For CE/marketing communications
  emergency_opt_in boolean default true, -- Emergency alerts (always true)
  status text check (status in ('active', 'inactive', 'closed')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index members_county_idx on members(county);
create index members_status_idx on members(status);
create index members_ce_opt_in_idx on members(ce_opt_in);

-- ============================================
-- EVENTS (Disaster events: hurricanes, floods, etc.)
-- ============================================
create table events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null, -- e.g., "Hurricane Ian 2026"
  event_type text check (event_type in ('hurricane', 'flood', 'wildfire', 'tornado', 'earthquake', 'other')),
  status text check (status in ('draft', 'active', 'closed')) default 'draft',
  start_date timestamptz,
  end_date timestamptz,
  affected_counties text[], -- Array of county names
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index events_status_idx on events(status);
create index events_org_idx on events(organization_id);

-- ============================================
-- OUTREACH CAMPAIGNS (SMS/Voice/Email batches)
-- ============================================
create table outreach_campaigns (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  campaign_type text check (campaign_type in ('sms', 'voice', 'email')) not null,
  status text check (status in ('draft', 'sending', 'completed', 'failed')) default 'draft',
  message_template text not null,
  audience_filter jsonb, -- {counties: [...], specialty: [...], ce_opt_in: true/false}
  total_recipients integer default 0,
  sent_count integer default 0,
  delivered_count integer default 0,
  failed_count integer default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index campaigns_event_idx on outreach_campaigns(event_id);
create index campaigns_status_idx on outreach_campaigns(status);

-- ============================================
-- RESPONSES (Clinic check-in responses)
-- ============================================
create table responses (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references outreach_campaigns(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  status text check (status in ('safe_operating', 'safe_closed', 'need_help', 'unsafe_evacuating')) not null,
  channel text check (channel in ('sms', 'voice', 'email', 'web')) not null,
  phone_number text,
  answers jsonb default '{}'::jsonb, -- Detailed responses to triage questions
  needs text[], -- Array of needs: ['medical_supplies', 'evacuation', 'personnel', etc.]
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  responded_at timestamptz default now(),
  created_at timestamptz default now()
);

create index responses_event_idx on responses(event_id);
create index responses_member_idx on responses(member_id);
create index responses_status_idx on responses(status);
create index responses_channel_idx on responses(channel);

-- ============================================
-- RESOURCE REQUESTS (Specific needs from clinics)
-- ============================================
create table resource_requests (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid references responses(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  request_type text check (request_type in ('medical_supplies', 'evacuation', 'personnel', 'equipment', 'shelter', 'other')) not null,
  description text not null,
  priority text check (priority in ('low', 'medium', 'high', 'critical')) default 'medium',
  status text check (status in ('pending', 'in_progress', 'fulfilled', 'cancelled')) default 'pending',
  assigned_to text, -- Person/organization handling this request
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index resource_requests_event_idx on resource_requests(event_id);
create index resource_requests_status_idx on resource_requests(status);
create index resource_requests_priority_idx on resource_requests(priority);

-- ============================================
-- CE COURSES (Continuing Education)
-- ============================================
create table ce_courses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  description text,
  instructor_names text[],
  location text, -- Physical address or "Virtual"
  start_date timestamptz not null,
  end_date timestamptz not null,
  ce_credits decimal(3, 1) default 0,
  price decimal(10, 2) default 0,
  max_attendees integer,
  current_registrations integer default 0,
  status text check (status in ('draft', 'published', 'full', 'completed', 'cancelled')) default 'draft',
  registration_url text, -- Auto-generated slug
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index ce_courses_status_idx on ce_courses(status);
create index ce_courses_start_date_idx on ce_courses(start_date);

-- ============================================
-- CE REGISTRATIONS (Course sign-ups)
-- ============================================
create table ce_registrations (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references ce_courses(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  attendee_name text not null,
  attendee_email text not null,
  attendee_phone text,
  payment_status text check (payment_status in ('pending', 'paid', 'refunded')) default 'pending',
  attendance_verified boolean default false,
  certificate_sent boolean default false,
  registered_at timestamptz default now(),
  unique(course_id, attendee_email)
);

create index ce_registrations_course_idx on ce_registrations(course_id);
create index ce_registrations_member_idx on ce_registrations(member_id);

-- ============================================
-- ANNOUNCEMENTS (FVMA communications)
-- ============================================
create table announcements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  content text not null,
  announcement_type text check (announcement_type in ('ce_course', 'legislative', 'member_benefit', 'job_posting', 'general')) not null,
  channel text check (channel in ('email', 'sms', 'both')) not null,
  audience_filter jsonb, -- {counties: [...], specialty: [...], ce_opt_in: true}
  status text check (status in ('draft', 'scheduled', 'sent', 'cancelled')) default 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_recipients integer default 0,
  open_count integer default 0, -- Email opens
  click_count integer default 0, -- Link clicks
  opt_out_count integer default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index announcements_status_idx on announcements(status);
create index announcements_type_idx on announcements(announcement_type);

-- ============================================
-- AUDIT LOG (Track all admin actions)
-- ============================================
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null, -- 'created_event', 'launched_campaign', 'exported_data', etc.
  entity_type text, -- 'event', 'campaign', 'member', etc.
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

create index audit_log_user_idx on audit_log(user_id);
create index audit_log_entity_idx on audit_log(entity_type, entity_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
alter table organizations enable row level security;
alter table members enable row level security;
alter table events enable row level security;
alter table outreach_campaigns enable row level security;
alter table responses enable row level security;
alter table resource_requests enable row level security;
alter table ce_courses enable row level security;
alter table ce_registrations enable row level security;
alter table announcements enable row level security;
alter table audit_log enable row level security;

-- Organizations: FVMA admins can see all
create policy "FVMA admins can view organizations"
  on organizations for select
  using (auth.uid() in (select user_id from auth.users));

-- Members: FVMA admins can see all
create policy "FVMA admins can view members"
  on members for select
  using (auth.uid() in (select user_id from auth.users));

-- Events: FVMA admins can CRUD
create policy "FVMA admins can view events"
  on events for select
  using (auth.uid() in (select user_id from auth.users));

create policy "FVMA admins can create events"
  on events for insert
  with check (auth.uid() in (select user_id from auth.users));

create policy "FVMA admins can update events"
  on events for update
  using (auth.uid() in (select user_id from auth.users));

-- Similar policies for other tables (FVMA admin access)
-- Add more granular policies as needed for multi-org support

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to tables with updated_at
create trigger update_organizations_updated_at before update on organizations
  for each row execute function update_updated_at_column();

create trigger update_members_updated_at before update on members
  for each row execute function update_updated_at_column();

create trigger update_events_updated_at before update on events
  for each row execute function update_updated_at_column();

create trigger update_resource_requests_updated_at before update on resource_requests
  for each row execute function update_updated_at_column();

create trigger update_ce_courses_updated_at before update on ce_courses
  for each row execute function update_updated_at_column();

-- Auto-increment CE course registrations
create or replace function increment_course_registrations()
returns trigger as $$
begin
  update ce_courses
  set current_registrations = current_registrations + 1
  where id = new.course_id;
  return new;
end;
$$ language plpgsql;

create trigger ce_registration_created
  after insert on ce_registrations
  for each row execute function increment_course_registrations();

-- ============================================
-- SEED DATA (FVMA Organization)
-- ============================================
insert into organizations (name, org_type, email, phone, state, website)
values (
  'Florida Veterinary Medical Association',
  'state_association',
  'info@fvma.org',
  '(555) 123-4567',
  'FL',
  'https://fvma.org'
);

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Enable Auth in Supabase dashboard
-- 3. Add FVMA admin emails to Auth > Users
-- 4. Set up RLS policies for multi-org if needed
-- 5. Configure storage bucket for logos/certificates
