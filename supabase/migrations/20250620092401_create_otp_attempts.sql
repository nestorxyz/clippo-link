-- Create OTP attempts table for verification
CREATE TABLE IF NOT EXISTS public.otp_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('web_verification', 'whatsapp_auth')),
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_otp_attempts_user_id ON public.otp_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_attempts_phone_number ON public.otp_attempts(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_attempts_expires_at ON public.otp_attempts(expires_at);

-- Enable RLS
ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Service role can manage all OTP attempts (for backend)
CREATE POLICY "Service role full access" ON public.otp_attempts
  FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own OTP attempts (optional, for debugging)
CREATE POLICY "Users can view own attempts" ON public.otp_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_attempts
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a scheduled job to clean up expired OTPs
-- This would need to be set up in Supabase dashboard or via pg_cron 