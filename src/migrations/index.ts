import * as migration_20260913_191345_initial from './20260913_191345_initial';
import * as migration_20260913_191346_publish_contact_points from './20260913_191346_publish_contact_points';
import * as migration_20260913_210524_blog_posts from './20260913_210524_blog_posts';

export const migrations = [
  {
    up: migration_20260913_191345_initial.up,
    down: migration_20260913_191345_initial.down,
    name: '20260913_191345_initial',
  },
  {
    up: migration_20260913_191346_publish_contact_points.up,
    down: migration_20260913_191346_publish_contact_points.down,
    name: '20260913_191346_publish_contact_points',
  },
  {
    up: migration_20260913_210524_blog_posts.up,
    down: migration_20260913_210524_blog_posts.down,
    name: '20260913_210524_blog_posts'
  },
];
