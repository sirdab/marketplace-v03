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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, CheckCircle, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const emailSchema = z.object({
  email: z.string().email('Valid email is required'),
});

const phoneSchema = z.object({
  phone: z.string().min(9, 'Valid phone number is required').max(15),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { sendMagicLink, sendPhoneOtp, verifyPhoneOtp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');

  const returnUrl = new URLSearchParams(searchString).get('returnUrl') || '/dashboard';

  useEffect(() => {
    if (user && !authLoading) {
      navigate(returnUrl);
    }
  }, [user, authLoading, navigate, returnUrl]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

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

  const onEmailSubmit = async (data: EmailFormData) => {
    const { error } = await sendMagicLink(data.email, returnUrl);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: error.message,
      });
    } else {
      setEmailSent(true);
      setSentToEmail(data.email);
    }
  };

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

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 4) return;
    
    setIsVerifying(true);
    const { error } = await verifyPhoneOtp(sentToPhone, otpValue);
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
              {emailSent ? t('auth.checkEmail') : t('auth.signInTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent 
                ? t('auth.magicLinkSent') 
                : t('auth.signInDescription')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  {t('auth.linkSentTo')} <strong>{sentToEmail}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('auth.checkSpam')}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false);
                    emailForm.reset();
                  }}
                  data-testid="button-try-different-email"
                >
                  {t('auth.tryDifferentEmail')}
                </Button>
              </div>
            ) : (
              <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'email' | 'phone')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="phone" data-testid="tab-phone">
                    <Phone className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('auth.phone')}
                  </TabsTrigger>
                  <TabsTrigger value="email" data-testid="tab-email">
                    <Mail className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('auth.email')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone">
                  {otpSent ? (
                    <div className="space-y-4">
                      <p className="text-center text-muted-foreground text-sm">
                        {t('auth.enterOtp')} <strong dir="ltr">{sentToPhone}</strong>
                      </p>
                      <div className="flex justify-center" dir="ltr">
                        <InputOTP
                          maxLength={4}
                          value={otpValue}
                          onChange={(val) => {
                            setOtpValue(val);
                            if (val.length === 4) {
                              setTimeout(() => {
                                document.querySelector<HTMLButtonElement>('[data-testid="button-verify-otp"]')?.click();
                              }, 100);
                            }
                          }}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          data-testid="input-otp"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleVerifyOtp}
                        disabled={otpValue.length !== 4 || isVerifying}
                        data-testid="button-verify-otp"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                            {t('auth.verifying')}
                          </>
                        ) : (
                          t('auth.verifyOtp')
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetPhoneFlow}
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
                </TabsContent>

                <TabsContent value="email">
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.email')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  className="pl-10"
                                  data-testid="input-email"
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
                        disabled={emailForm.formState.isSubmitting}
                        data-testid="button-send-magic-link"
                      >
                        {emailForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                            {t('auth.sendingLink')}
                          </>
                        ) : (
                          t('auth.sendMagicLink')
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
