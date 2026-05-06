create table if not exists schedule_data (
  id text primary key,
  schedule jsonb not null default '[]',
  updated_at timestamptz default now()
);

insert into schedule_data (id, schedule) values ('main', '[
  {"date": "September 14", "day": "Monday", "rounds": [{"course": "Bandon Dunes", "time": "3:00 PM", "players": "8 players"}]},
  {"date": "September 15", "day": "Tuesday", "rounds": [{"course": "Sheep Ranch", "time": "9:10 AM", "players": "8 players"}, {"course": "Pacific Dunes", "time": "3:10 PM", "players": "8 players"}]},
  {"date": "September 16", "day": "Wednesday", "rounds": [{"course": "Bandon Preserve", "time": "8:00 AM", "players": "8 players"}, {"course": "Old Macdonald", "time": "12:30 PM", "players": "8 players"}]},
  {"date": "September 17", "day": "Thursday", "rounds": [{"course": "Bandon Trails", "time": "9:20 AM", "players": "8 players"}]}
]') on conflict (id) do nothing;
