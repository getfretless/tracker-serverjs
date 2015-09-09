select row_to_json(r) from (
  select *,
    ('http://localhost:3000/boards/' || boards.id) as url,
    (select array_to_json(array_agg(row_to_json(s))) from (
        select *,
          ('http://localhost:3000/stories/' || stories.id) as url,
          (select row_to_json(u) from
            (select id, name, email, created_at, updated_at from users where stories.user_id = users.id) u
          ) as user
        from stories where board_id = boards.id
      ) s
    ) as stories
  from boards WHERE id = $1
) r
