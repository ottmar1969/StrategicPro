# ContentScale Payment System Guide

## Updated Pricing Structure

### Pricing Tiers

**1. Free Generation**
- First article: Always free for everyone
- API key users: 4 free articles total

**2. API Key Users ($1/article)**
- 4 free articles, then $1 per article
- Can use credits (1 credit = $1 value)
- Best value for regular users

**3. Premium Users with Credits ($5/article)**
- 1 credit = $5 value (50% savings vs direct payment)
- No API key required
- Ideal for occasional use

**4. Premium Direct Payment ($10/article)**
- No credits or API key required
- Pay-per-use premium generation
- Full price option

## Credit System

### Credit Packages
- **Starter Pack**: 5 credits for $25 ($5/credit)
- **Popular Pack**: 10 credits for $40 ($4/credit) - 20% savings
- **Professional Pack**: 25 credits for $75 ($3/credit) - 40% savings

### Credit Usage
- API key users: 1 credit = $1 article
- Premium users: 1 credit = $5 article (50% discount)
- Credits never expire
- Credits are consumed automatically when available

## Payment Flow

### User Scenarios

**Scenario 1: New User**
- First article: Free
- Second article: $10 direct payment OR add API key for more free articles

**Scenario 2: API Key User**
- Articles 1-4: Free
- Article 5+: $1 each OR 1 credit each

**Scenario 3: Premium User with Credits**
- First article: Free
- Subsequent: 1 credit each ($5 value, 50% savings)

**Scenario 4: Premium User without Credits**
- First article: Free
- Subsequent: $10 each

## Implementation Details

### Frontend Display
- Shows current pricing method
- Displays credit balance
- Indicates savings with credits
- Clear upgrade path to API keys

### Backend Logic
- Eligibility check before generation
- Automatic credit deduction
- Usage tracking per user
- Payment method recording

### Testing Endpoints
- `/api/test/payment-scenarios` - Test all pricing scenarios
- `/api/test/buy-credits` - Simulate credit purchase
- `/api/test/generate-pricing` - Check current user pricing

## Benefits Summary

**With API Keys**: 4 free + $1/article
**With Credits**: 50% savings ($5 instead of $10)
**Direct Payment**: No setup required, $10/article

This system incentivizes API key adoption while providing flexible payment options for all user types.

Contact: O. Francisca (+31 628073996)
Domain: contentscale.site