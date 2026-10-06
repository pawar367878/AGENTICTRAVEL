export interface BudgetBreakdown {
  hotel: number;
  transport: number;
  food: number;
  activities: number;
  other: number;
  totalEstimated: number;
  allocatedBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  costPerPerson: number;
  statusMessage: string;
  alternativesAdvice?: string[];
}

export class BudgetAgent {
  name = 'Budget Agent';
  role = 'Enforce multi-attribute financial constraints, estimate granular sub-categories, and generate cost-reduction trade-offs.';

  calculate(
    allocatedBudget: number,
    hotelCost: number,
    transportCost: number,
    activitiesCost: number,
    travellersCount: number,
    daysCount: number
  ): BudgetBreakdown {
    // Estimated food per person per day ~ 600 - 900 INR
    const foodCost = Math.round(750 * travellersCount * daysCount);
    // Miscellaneous/Local transit ~ 400 INR per group per day
    const otherCost = Math.round(500 * daysCount + travellersCount * 150);

    const totalEstimated = hotelCost + transportCost + foodCost + activitiesCost + otherCost;
    const remainingBudget = allocatedBudget - totalEstimated;
    const isOverBudget = remainingBudget < 0;
    const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
    const costPerPerson = Math.round(totalEstimated / Math.max(1, travellersCount));

    let statusMessage = '';
    const alternativesAdvice: string[] = [];

    if (isOverBudget) {
      statusMessage = `⚠️ This selection exceeds your planned budget by ₹${overBudgetAmount.toLocaleString('en-IN')}.`;
      if (transportCost > allocatedBudget * 0.4) {
        alternativesAdvice.push('Switch from Flight to High-Speed Train (Vande Bharat) or Volvo Sleeper Bus to save up to ₹10,000.');
      }
      if (hotelCost > allocatedBudget * 0.45) {
        alternativesAdvice.push('Consider a Deluxe Queen Room or boutique heritage stay instead of luxury suite to reduce accommodation costs by ~30%.');
      }
      alternativesAdvice.push('Bundle activities into combo passes or allocate free beach/walking excursions for Day 2.');
    } else {
      statusMessage = `✅ Financial plan fully verified! Remaining financial buffer is ₹${remainingBudget.toLocaleString('en-IN')} (₹${Math.round(remainingBudget / travellersCount).toLocaleString('en-IN')} per traveller).`;
    }

    return {
      hotel: hotelCost,
      transport: transportCost,
      food: foodCost,
      activities: activitiesCost,
      other: otherCost,
      totalEstimated,
      allocatedBudget,
      remainingBudget,
      isOverBudget,
      overBudgetAmount,
      costPerPerson,
      statusMessage,
      alternativesAdvice: isOverBudget ? alternativesAdvice : undefined,
    };
  }
}
