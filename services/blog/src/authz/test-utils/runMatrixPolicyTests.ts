import { describe, it, expect } from "vitest";
import { articleByUser1, ACTORS } from "../__tests__/fixtures.js";

type MatrixPolicyTestCase = {
  label: string;
  policy: Function;
  matrix: Record<string, Record<string, boolean>>;
  requiresResource: boolean;
};

export function runMatrixPolicyTests({
  label,
  policy,
  matrix,
  requiresResource,
}: MatrixPolicyTestCase) {
  describe(label, () => {
    for (const [action, rules] of Object.entries(matrix)) {
      describe(action, () => {
        for (const [actor, expected] of Object.entries(rules)) {
          it(`${actor} → ${expected ? "allowed" : "denied"}`, () => {
            const user = ACTORS[actor as keyof typeof ACTORS];

            const result = requiresResource
              ? policy(user, articleByUser1)
              : policy(user);

            expect(result).toBe(expected);
          });
        }
      });
    }
  });
}
