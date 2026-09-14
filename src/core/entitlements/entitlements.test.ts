import { createEntitlementsService } from './entitlements';

describe('createEntitlementsService', () => {
  it('defaults to the free plan', () => {
    const service = createEntitlementsService();
    expect(service.getPlan()).toBe('free');
  });

  it('denies premium features on the free plan', () => {
    const service = createEntitlementsService('free');
    expect(service.hasFeature('unlimitedGoals')).toBe(false);
    expect(service.hasFeature('advancedAnalytics')).toBe(false);
    expect(service.hasFeature('csvExport')).toBe(false);
  });

  it('grants premium features on the premium plan', () => {
    const service = createEntitlementsService('premium');
    expect(service.hasFeature('unlimitedGoals')).toBe(true);
    expect(service.hasFeature('advancedAnalytics')).toBe(true);
    expect(service.hasFeature('csvExport')).toBe(true);
  });
});
