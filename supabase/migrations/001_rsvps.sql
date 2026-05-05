create table if not exists rsvps (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text not null,
  shirt_size    text not null,
  shoe_size     text not null,
  booking_code  text not null unique,
  status        text not null default 'pending',
  created_at    timestamptz default now(),
  confirmed_at  timestamptz
);

create index if not exists rsvps_booking_code_idx on rsvps (booking_code);
create index if not exists rsvps_status_idx on rsvps (status);
