import express from 'express';
import { contentStorage } from './content-storage.js';

const router = express.Router();

// Test payment scenarios
router.post('/api/test/payment-scenarios', async (req, res) => {
  try {
    const scenarios = [
      {
        name: "First Time User",
        user: { credits: 0, freeArticlesUsed: 0, hasOwnApiKey: false },
        expected: { price: 0, method: "free" }
      },
      {
        name: "User with API Key (Free Articles)",
        user: { credits: 0, freeArticlesUsed: 2, hasOwnApiKey: true },
        expected: { price: 0, method: "free_api" }
      },
      {
        name: "User with API Key (Used Free Articles)",
        user: { credits: 5, freeArticlesUsed: 4, hasOwnApiKey: true },
        expected: { price: 1, method: "credits", creditCost: 1 }
      },
      {
        name: "Premium User with Credits",
        user: { credits: 3, freeArticlesUsed: 1, hasOwnApiKey: false },
        expected: { price: 5, method: "credits", creditCost: 1 }
      },
      {
        name: "Premium User without Credits",
        user: { credits: 0, freeArticlesUsed: 1, hasOwnApiKey: false },
        expected: { price: 10, method: "payment" }
      }
    ];

    const results = scenarios.map(scenario => {
      const eligibility = checkUserEligibilitySync(scenario.user);
      const passed = eligibility.price === scenario.expected.price && 
                    eligibility.method === scenario.expected.method;
      
      return {
        scenario: scenario.name,
        passed,
        expected: scenario.expected,
        actual: {
          price: eligibility.price,
          method: eligibility.method,
          creditCost: eligibility.creditCost
        }
      };
    });

    res.json({
      testResults: results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length
      }
    });
  } catch (error) {
    console.error('Payment test error:', error);
    res.status(500).json({ error: 'Payment test failed' });
  }
});

// Simulate credit purchase
router.post('/api/test/buy-credits', async (req, res) => {
  try {
    const { sessionId, packageId } = req.body;
    
    const packages = {
      starter: { credits: 5, price: 25 },
      popular: { credits: 10, price: 40 },
      professional: { credits: 25, price: 75 }
    };

    const selectedPackage = packages[packageId as keyof typeof packages];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package' });
    }

    // Simulate successful payment
    const user = await contentStorage.getUserBySession(sessionId);
    if (user) {
      user.credits += selectedPackage.credits;
      await contentStorage.updateUser(user.id, { credits: user.credits });
    }

    res.json({
      success: true,
      package: selectedPackage,
      newCreditBalance: user?.credits || 0,
      message: `Successfully purchased ${selectedPackage.credits} credits for $${selectedPackage.price}`
    });
  } catch (error) {
    console.error('Credit purchase test error:', error);
    res.status(500).json({ error: 'Credit purchase test failed' });
  }
});

// Test article generation pricing
router.post('/api/test/generate-pricing', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const user = await contentStorage.getUserBySession(sessionId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eligibility = checkUserEligibilitySync(user);
    
    res.json({
      user: {
        credits: user.credits,
        freeArticlesUsed: user.freeArticlesUsed,
        hasOwnApiKey: user.hasOwnApiKey
      },
      pricing: eligibility,
      breakdown: {
        canGenerateFree: eligibility.price === 0,
        usingCredits: eligibility.method === 'credits',
        creditCost: eligibility.creditCost || 0,
        dollarPrice: eligibility.price || 0
      }
    });
  } catch (error) {
    console.error('Generate pricing test error:', error);
    res.status(500).json({ error: 'Generate pricing test failed' });
  }
});

function checkUserEligibilitySync(user: any) {
  const { credits, freeArticlesUsed, hasApiKey } = user;

  // First article is always free
  if (freeArticlesUsed === 0) {
    return {
      allowed: true,
      method: "free",
      remaining: 1,
      price: 0
    };
  }

  // API key users get 4 free articles, then $1 per article
  if (hasApiKey && freeArticlesUsed < 4) {
    return {
      allowed: true,
      method: "free_api",
      remaining: 4 - freeArticlesUsed,
      price: 0
    };
  }

  // After free articles with API key, charge $1
  if (hasApiKey && freeArticlesUsed >= 4) {
    if (credits > 0) {
      return {
        allowed: true,
        method: "credits",
        remaining: credits,
        price: 1,
        creditCost: 1
      };
    }
    return {
      allowed: false,
      requiresPayment: true,
      method: "payment",
      price: 1
    };
  }

  // Premium users: $5 with credits, $10 without credits
  if (credits > 0) {
    return {
      allowed: true,
      method: "credits",
      remaining: credits,
      price: 5,
      creditCost: 1
    };
  }

  return {
    allowed: false,
    requiresPayment: true,
    method: "payment",
    price: 10
  };
}

export default router;