-- Reference schema (Hibernate will auto-create/update tables)

create table if not exists users (
  id bigserial primary key,
  email varchar(255) not null,
  password_hash varchar(255) not null,
  role varchar(20) not null,
  constraint uk_users_email unique (email)
);

create table if not exists projects (
  id bigserial primary key,
  title varchar(255) not null,
  description text,
  created_by bigint not null,
  constraint fk_projects_created_by foreign key (created_by) references users(id)
);

create table if not exists project_members (
  project_id bigint not null,
  user_id bigint not null,
  constraint fk_project_members_project foreign key (project_id) references projects(id),
  constraint fk_project_members_user foreign key (user_id) references users(id),
  constraint uk_project_members_project_user unique (project_id, user_id)
);

create table if not exists tasks (
  id bigserial primary key,
  title varchar(255) not null,
  description text,
  assigned_to bigint not null,
  project_id bigint not null,
  status varchar(20) not null,
  due_date date,
  constraint fk_tasks_assigned_to foreign key (assigned_to) references users(id),
  constraint fk_tasks_project foreign key (project_id) references projects(id)
);

create index if not exists idx_tasks_project on tasks(project_id);
create index if not exists idx_tasks_assigned_to on tasks(assigned_to);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_due_date on tasks(due_date);

