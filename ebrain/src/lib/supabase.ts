
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;


const supabaseUrl = 'https://enhiucyodopknrbdtswy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaGl1Y3lvZG9wa25yYmR0c3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg2MzQsImV4cCI6MjA2NDk1NDYzNH0.mqZh6tgICrAqPSm9-B3RUxpYAPYtwbsdhOXPttr4Wpc'
export const supabase = createClient(supabaseUrl, supabaseKey);
        