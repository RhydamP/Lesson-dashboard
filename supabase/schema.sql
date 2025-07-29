-- Schema (example)
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL
);

CREATE TABLE public.lesson_completions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP DEFAULT now()
);
