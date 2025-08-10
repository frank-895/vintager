
CREATE TABLE public.tasting_note (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tasting_note text NOT NULL,
  CONSTRAINT tasting_note_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wine (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  vintage smallint,
  region text,
  vineyard text,
  brand text,
  varietal text,
  volume text,
  alcohol_content text,
  stock_level integer,
  light_bold smallint,
  smooth_tannic smallint,
  dry_sweet smallint,
  soft_acidic smallint,
  description text,
  country text,
  image text,
  price numeric,
  CONSTRAINT wine_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wine_tast_note (
  wine_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tasting_note_id bigint NOT NULL,
  CONSTRAINT wine_tast_note_pkey PRIMARY KEY (wine_id, tasting_note_id),
  CONSTRAINT wine_tast_note_tasting_note_id_fkey FOREIGN KEY (tasting_note_id) REFERENCES public.tasting_note(id),
  CONSTRAINT wine_tast_note_wine_id_fkey FOREIGN KEY (wine_id) REFERENCES public.wine(id)
);