import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { retired-provider } from '@/integrations/retired-provider/client';
import { env } from '@/env';

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

interface PhoneVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
}

export function PhoneVerification({
  isOpen,
  onClose,
  onVerified,
}: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'consolidation'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [consolidationData, setConsolidationData] = useState<{
    whatsappAccountId: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(
        () => setCooldownSeconds(cooldownSeconds - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, '');

    // Ensure it starts with + if it has a country code
    if (cleaned.length > 0 && !cleaned.startsWith('+') && cleaned.length > 10) {
      return '+' + cleaned;
    }

    return cleaned;
  };

  const sendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await retired-provider.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const {
        data: { user },
      } = await retired-provider.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await fetch(`${BACKEND_URL}/api/auth/send-otp-web`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep('otp');
      setCooldownSeconds(30);
      toast({
        title: 'OTP Sent!',
        description: 'Check your WhatsApp for the verification code.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await retired-provider.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const {
        data: { user },
      } = await retired-provider.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp-web`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          userId: user.id,
          otpCode,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Check if it's a consolidation required error
        if (data.error === 'CONSOLIDATION_REQUIRED') {
          setConsolidationData({
            whatsappAccountId: data.data.whatsappAccountId,
          });
          setStep('consolidation');
          return;
        }
        throw new Error(data.message || 'Invalid OTP');
      }

      toast({
        title: 'Phone Verified!',
        description: 'Your WhatsApp number has been linked to your account.',
      });

      onVerified(data.data.phoneNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleConsolidation = async (shouldConsolidate: boolean) => {
    if (!shouldConsolidate) {
      // User declined, go back to phone entry
      setStep('phone');
      setConsolidationData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await retired-provider.auth.getSession();
      if (!session) {
        throw new Error('No authenticated session');
      }

      const {
        data: { user },
      } = await retired-provider.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await fetch(
        `${BACKEND_URL}/api/auth/consolidate-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            phoneNumber: formattedPhone,
            userId: user.id,
            whatsappAccountId: consolidationData?.whatsappAccountId,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to consolidate accounts');
      }

      toast({
        title: 'Accounts Merged!',
        description:
          'Your WhatsApp data has been successfully merged with your account.',
      });

      onVerified(data.data.phone_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      sendOTP();
    } else {
      setError('Please enter a valid phone number with country code');
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      verifyOTP();
    } else {
      setError('Please enter the 6-digit code');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Link Your WhatsApp
          </DialogTitle>
          <DialogDescription>
            Connect your WhatsApp number to use DoryAI on both web and WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Enter your phone number with country code (e.g., +1 for US)
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading || phoneNumber.length < 10 || cooldownSeconds > 0
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : cooldownSeconds > 0 ? (
                `Wait ${cooldownSeconds}s`
              ) : (
                'Send OTP via WhatsApp'
              )}
            </Button>
          </form>
        ) : step === 'consolidation' ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                This phone number is already linked to a WhatsApp account. Would
                you like to merge your WhatsApp data (links, categories, tags)
                into your current account?
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                If you choose "Merge Accounts", all your WhatsApp data will be
                transferred to this Google account and the WhatsApp-only account
                will be removed.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleConsolidation(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => handleConsolidation(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Merging...
                  </>
                ) : (
                  'Merge Accounts'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                disabled={loading}
                className="font-mono text-center text-lg"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your WhatsApp
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                  setError(null);
                }}
                disabled={loading}
              >
                Change Number
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={sendOTP}
              disabled={loading || cooldownSeconds > 0}
            >
              {cooldownSeconds > 0
                ? `Resend in ${cooldownSeconds}s`
                : 'Resend Code'}
            </Button>
          </form>
        )}

        <div className="mt-4 rounded-lg bg-muted p-4">
          <h4 className="text-sm font-medium mb-2">Why link your WhatsApp?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Save and search links directly from WhatsApp</li>
            <li>• Access your links on both web and mobile</li>
            <li>• Get AI-powered link management on the go</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
