import {
  canCreateArticle,
  canEditArticle,
  canDeleteArticle,
} from "../article.authz.js";

import { runMatrixPolicyTests } from "../test-utils/runMatrixPolicyTests.js";
import { ARTICLE_POLICY_MATRIX } from "../matrices/article.matrix.js";

runMatrixPolicyTests({
  label: "Article creation",
  policy: canCreateArticle,
  matrix: { create: ARTICLE_POLICY_MATRIX.create },
  requiresResource: false,
});

runMatrixPolicyTests({
  label: "Article editing",
  policy: canEditArticle,
  matrix: { edit: ARTICLE_POLICY_MATRIX.edit },
  requiresResource: true,
});

runMatrixPolicyTests({
  label: "Article deletion",
  policy: canDeleteArticle,
  matrix: { delete: ARTICLE_POLICY_MATRIX.delete },
  requiresResource: true,
});
