import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearch } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const phoneSchema = z.object({
  phone: z.string().min(9, 'Valid phone number is required').max(15),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { sendPhoneOtp, verifyPhoneOtp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const returnUrl = new URLSearchParams(searchString).get('returnUrl') || '/dashboard';

  useEffect(() => {
    if (user && !authLoading) {
      navigate(returnUrl);
    }
  }, [user, authLoading, navigate, returnUrl]);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  const onPhoneSubmit = async (data: PhoneFormData) => {
    const fullPhone = `+966${data.phone.replace(/^0/, '')}`;
    const { error } = await sendPhoneOtp(fullPhone);

    if (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: error.message,
      });
    } else {
      setOtpSent(true);
      setSentToPhone(fullPhone);
      toast({
        title: t('auth.otpSent'),
        description: t('auth.otpSentDesc'),
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (otp.length !== 4) return;

    setIsVerifying(true);
    const { error } = await verifyPhoneOtp(sentToPhone, otp);
    setIsVerifying(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: error.message,
      });
      setOtpValue('');
    } else {
      toast({
        title: t('auth.loginSuccess'),
      });
    }
  };

  const resetPhoneFlow = () => {
    setOtpSent(false);
    setSentToPhone('');
    setOtpValue('');
    phoneForm.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.signInTitle')}
            </CardTitle>
            <CardDescription className="text-center">{t('auth.signInDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {otpSent ? (
              <div className="space-y-6">
                <p className="text-center text-muted-foreground text-sm">
                  {t('auth.enterOtp')} <strong dir="ltr">{sentToPhone}</strong>
                </p>
                <div className="flex justify-center" dir="ltr">
                  <InputOTP
                    maxLength={4}
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value);
                      if (value.length === 4) {
                        handleVerifyOtp(value);
                      }
                    }}
                    disabled={isVerifying}
                    autoFocus
                    textAlign="center"
                    inputMode="numeric"
                    data-testid="input-otp"
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-12 text-lg font-semibold rounded-lg border"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-12 text-lg font-semibold rounded-lg border"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-12 text-lg font-semibold rounded-lg border"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-12 text-lg font-semibold rounded-lg border"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {isVerifying && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{t('auth.verifying')}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetPhoneFlow}
                  disabled={isVerifying}
                  data-testid="button-try-different-phone"
                >
                  {t('auth.tryDifferentPhone')}
                </Button>
              </div>
            ) : (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.phoneNumber')}</FormLabel>
                        <FormControl>
                          <div className="relative flex" dir="ltr">
                            <span className="inline-flex items-center px-3 rounded-s-md border border-e-0 border-input bg-muted text-muted-foreground text-sm">
                              +966
                            </span>
                            <Input
                              type="tel"
                              inputMode="numeric"
                              placeholder="5XXXXXXXX"
                              className="rounded-s-none"
                              data-testid="input-phone"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={phoneForm.formState.isSubmitting}
                    data-testid="button-send-otp"
                  >
                    {phoneForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                        {t('auth.sendingOtp')}
                      </>
                    ) : (
                      t('auth.sendOtp')
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
