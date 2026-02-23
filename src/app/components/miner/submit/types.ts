export interface FormData {
  // Step 1 — Dataset Info
  datasetName: string;
  domain: string;
  dataType: string;
  description: string;
  datasetSize: string;
  generationMethod: string;
  intendedUseCase: string;
  referenceStatsFile: File | null;

  // Step 2 — Technical Specs
  featureCount: string;
  targetColumns: string;
  trainTestSplit: number;
  missingValueStrategy: string;
  normalization: string;
  evaluationMetrics: string[];
  schemaFile: File | null;
  classBalance: string;

  // Step 3 — Privacy Settings
  differentialPrivacy: boolean;
  epsilon: number;
  delta: number;
  kAnonymity: number;
  lDiversity: boolean;
  tCloseness: boolean;
  piiScan: boolean;
  adversarialTesting: boolean;
  syntheticGuarantee: string;
  membershipInference: boolean;

  // Step 4 — Review
  agreedToTerms: boolean;
  agreedToDataPolicy: boolean;
  publicListing: boolean;
}

export const DEFAULT_FORM: FormData = {
  datasetName: "",
  domain: "",
  dataType: "Tabular",
  description: "",
  datasetSize: "",
  generationMethod: "",
  intendedUseCase: "",
  referenceStatsFile: null,

  featureCount: "",
  targetColumns: "",
  trainTestSplit: 80,
  missingValueStrategy: "",
  normalization: "",
  evaluationMetrics: [],
  schemaFile: null,
  classBalance: "",

  differentialPrivacy: true,
  epsilon: 1.0,
  delta: 5,
  kAnonymity: 5,
  lDiversity: true,
  tCloseness: false,
  piiScan: true,
  adversarialTesting: true,
  syntheticGuarantee: "",
  membershipInference: true,

  agreedToTerms: false,
  agreedToDataPolicy: false,
  publicListing: true,
};
