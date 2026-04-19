-- Definition ---------------------------------------------------------------------
CREATE TABLE log (
 id         UUID NOT NULL DEFAULT UUID_GENERATE_V4(),
 text       TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, now()),

 PRIMARY KEY(id)
);
