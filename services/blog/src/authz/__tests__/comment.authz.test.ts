import {
  canCreateComment,
  canEditComment,
  canDeleteComment,
} from "../comment.authz.js";
import { runMatrixPolicyTests } from "../test-utils/runMatrixPolicyTests.js";
import { COMMENT_POLICY_MATRIX } from "../matrices/comment.matrix.js";

runMatrixPolicyTests({
  label: "Comment creation",
  policy: canCreateComment,
  matrix: { create: COMMENT_POLICY_MATRIX.create },
  requiresResource: false,
});

runMatrixPolicyTests({
  label: "Comment editing",
  policy: canEditComment,
  matrix: { edit: COMMENT_POLICY_MATRIX.edit },
  requiresResource: true,
});

runMatrixPolicyTests({
  label: "Comment deletion",
  policy: canDeleteComment,
  matrix: { delete: COMMENT_POLICY_MATRIX.delete },
  requiresResource: true,
});
