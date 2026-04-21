import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://lisgslsclvfazxdlnvzn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImUyMjA4YTQ0LWZkZGEtNDg3NC1hMDdjLWIyNWJmM2JiOTYxNiJ9.eyJwcm9qZWN0SWQiOiJsaXNnc2xzY2x2ZmF6eGRsbnZ6biIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzczMTQ5Mjc3LCJleHAiOjIwODg1MDkyNzcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Lkaa6gp_z849TmIyMICK_LHAaFvx8bOtILN3WLqhmmw';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };