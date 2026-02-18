// arken/packages/sigil-protocol/test/queryInput.test.ts
import { getQueryInput, z } from '../util/schema';

describe('getQueryInput', () => {
  const model = z.object({
    name: z.string(),
    level: z.number(),
  });

  it('keeps Prisma-style take pagination when provided', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      take: 25,
      where: { name: 'ranger' },
    });

    expect(parsed).toBeDefined();
    expect(parsed?.take).toBe(25);
    expect(parsed?.where?.name?.equals).toBe('ranger');
  });

  it('preserves legacy limit pagination for backward compatibility', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({ limit: 50 });

    expect(parsed).toBeDefined();
    expect(parsed?.limit).toBe(50);
  });
});
