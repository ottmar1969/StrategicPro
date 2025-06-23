// Payment Service for ContentScale Platform
// Note: This is a mock implementation for demo purposes
// In production, integrate with actual Stripe API

interface PaymentRequest {
  amount: number;
  type: "article" | "credits";
  credits?: number;
  userId: string;
}

interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  status: string;
}

const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter Pack", credits: 5, price: 25, popular: false },
  { id: "popular", name: "Popular Pack", credits: 10, price: 40, popular: true },
  { id: "professional", name: "Professional Pack", credits: 25, price: 75, popular: false }
];

export async function processPayment(request: PaymentRequest): Promise<PaymentIntent> {
  try {
    // In production, this would integrate with Stripe
    // For demo purposes, we'll simulate the payment intent creation
    
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured - payments disabled in demo mode");
    }

    // Validate payment amount
    if (request.amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // For credit packages, validate the amount matches expected price
    if (request.type === "credits" && request.credits) {
      const package_ = CREDIT_PACKAGES.find(pkg => pkg.credits === request.credits);
      if (package_ && request.amount !== package_.price) {
        throw new Error("Payment amount doesn't match credit package price");
      }
    }

    // Mock Stripe payment intent
    const paymentIntent: PaymentIntent = {
      client_secret: `pi_mock_${Date.now()}_secret_mock`,
      payment_intent_id: `pi_mock_${Date.now()}`,
      amount: request.amount * 100, // Convert to cents
      status: "requires_payment_method"
    };

    // In production, you would:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: request.amount * 100,
    //   currency: 'usd',
    //   metadata: {
    //     userId: request.userId,
    //     type: request.type,
    //     credits: request.credits?.toString() || '0'
    //   }
    // });

    return paymentIntent;

  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function handlePaymentSuccess(paymentIntentId: string, userId: string): Promise<{
  success: boolean;
  credits?: number;
  message: string;
}> {
  try {
    // In production, verify the payment with Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // For demo, simulate successful payment
    const mockPayment = {
      id: paymentIntentId,
      amount: 4000, // $40 in cents
      metadata: {
        userId,
        type: "credits",
        credits: "10"
      },
      status: "succeeded"
    };

    if (mockPayment.status === "succeeded") {
      const credits = parseInt(mockPayment.metadata.credits || "0");
      
      if (credits > 0) {
        // In production, update user credits in database
        // await contentStorage.updateUser(userId, { 
        //   credits: userCurrentCredits + credits 
        // });
        
        return {
          success: true,
          credits,
          message: `Successfully added ${credits} credits to your account`
        };
      } else {
        // Single article payment
        return {
          success: true,
          message: "Payment successful - you can now generate content"
        };
      }
    } else {
      throw new Error("Payment not confirmed");
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      message: `Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export function getCreditPackages() {
  return CREDIT_PACKAGES.map(pkg => ({
    ...pkg,
    pricePerCredit: pkg.price / pkg.credits,
    savings: pkg.popular ? Math.round((1 - (pkg.price / pkg.credits) / 5) * 100) : 0
  }));
}

export function calculatePrice(hasApiKey: boolean, articleCount: number): number {
  // First article is always free
  if (articleCount === 0) return 0;
  
  // With API key: 10 free articles, then $1 each
  if (hasApiKey) {
    return articleCount <= 10 ? 0 : 1;
  }
  
  // Without API key: First free, then $10 each
  return articleCount === 1 ? 10 : 10;
}

export async function validatePaymentForArticle(userId: string, hasApiKey: boolean): Promise<{
  canGenerate: boolean;
  requiresPayment: boolean;
  price: number;
  message: string;
}> {
  try {
    // In production, get user's current article count from database
    // const user = await contentStorage.getUser(userId);
    // const articleCount = await contentStorage.getUserArticles(userId).length;
    
    // For demo, simulate user data
    const user = { freeArticlesUsed: 0, credits: 0 };
    const articleCount = user.freeArticlesUsed;

    // First article is always free
    if (articleCount === 0) {
      return {
        canGenerate: true,
        requiresPayment: false,
        price: 0,
        message: "First article is free!"
      };
    }

    // With API key users get 10 free articles
    if (hasApiKey && articleCount < 10) {
      return {
        canGenerate: true,
        requiresPayment: false,
        price: 0,
        message: `${10 - articleCount} free articles remaining with your API key`
      };
    }

    // Check if user has credits
    if (user.credits > 0) {
      return {
        canGenerate: true,
        requiresPayment: false,
        price: 0,
        message: `Using 1 credit (${user.credits - 1} remaining)`
      };
    }

    // Requires payment
    const price = hasApiKey ? 1 : 10;
    return {
      canGenerate: false,
      requiresPayment: true,
      price,
      message: `Payment required: $${price} per article${hasApiKey ? ' (with API key)' : ' (add API key for $1 pricing)'}`
    };

  } catch (error) {
    console.error("Payment validation error:", error);
    return {
      canGenerate: false,
      requiresPayment: true,
      price: 10,
      message: "Error validating payment - please try again"
    };
  }
}