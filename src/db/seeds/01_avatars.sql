DO $$
DECLARE 
  num_avatars CONSTANT INTEGER := 11;
BEGIN
  FOR i IN 1..num_avatars LOOP
    INSERT INTO avatars VALUES (DEFAULT);
  END LOOP;

END $$